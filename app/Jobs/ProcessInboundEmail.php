<?php

namespace App\Jobs;

use App\Models\MailMessage;
use App\Models\MailAlert;
use App\Models\MailAttachment;
use App\Models\MailAccount;
use App\Models\MailThread;
use App\Models\User;
use App\Services\MailActivityLogger;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Resend\Laravel\Facades\Resend;

class ProcessInboundEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public array $backoff = [30, 300, 900];

    private const MAX_INBOUND_ATTACHMENT_BYTES = 25 * 1024 * 1024;

    public function __construct(public string $resendEmailId)
    {
    }

    public function handle(): void
    {
        $existingMessage = MailMessage::where('provider_id', $this->resendEmailId)->first();
        if ($existingMessage) {
            $this->storeInboundAttachments($existingMessage, $existingMessage->attachments ?? []);

            return;
        }

        $email = Resend::emails()->receiving->get($this->resendEmailId)->toArray();
        $from = $this->parseAddress((string) ($email['from'] ?? ''));
        $headers = $this->normalizeHeaders($email['headers'] ?? []);
        $subject = trim((string) ($email['subject'] ?? '')) ?: '(Sin asunto)';
        $textBody = (string) ($email['text'] ?? '');
        $htmlBody = $email['html'] ?? null;

        if ($textBody === '' && is_string($htmlBody)) {
            $textBody = trim(strip_tags($htmlBody));
        }

        $message = DB::transaction(function () use ($email, $from, $headers, $subject, $textBody, $htmlBody): ?MailMessage {
            if (MailMessage::where('provider_id', $this->resendEmailId)->exists()) {
                return null;
            }

            $mailbox = $this->firstAddress($email['to'] ?? []);
            $mailAccount = $mailbox
                ? MailAccount::where('address', strtolower($mailbox))->first()
                : null;

            $thread = $this->resolveThread(
                fromAddress: $from['address'],
                fromName: $from['name'],
                subject: $subject,
                inReplyTo: $headers['in-reply-to'] ?? null,
                mailbox: $mailbox,
                mailAccount: $mailAccount,
            );

            $message = $thread->messages()->create([
                'direction' => 'inbound',
                'provider_id' => $this->resendEmailId,
                'provider_message_id' => $email['message_id'] ?? null,
                'in_reply_to' => $headers['in-reply-to'] ?? null,
                'from_address' => $from['address'],
                'from_name' => $from['name'],
                'to_addresses' => array_values($email['to'] ?? []),
                'cc_addresses' => $email['cc'] ?? null,
                'bcc_addresses' => $email['bcc'] ?? null,
                'text_body' => $textBody,
                'html_body' => $htmlBody,
                'attachments' => $email['attachments'] ?? null,
                'is_read' => false,
                'received_at' => $this->parseDate($email['created_at'] ?? null),
            ]);

            $thread->update([
                'mailbox' => $thread->mailbox ?: $this->firstAddress($email['to'] ?? []),
                'participant_name' => $from['name'],
                'participant_email' => $from['address'],
                'last_direction' => 'inbound',
                'last_preview' => Str::limit($textBody, 180),
                'last_message_at' => $this->parseDate($email['created_at'] ?? null),
                'archived_at' => null,
            ]);

            $this->createAlerts($message, $thread, $subject, $from['name'], $from['address'], $textBody);

            return $message;
        });

        if ($message) {
            $this->storeInboundAttachments($message, $email['attachments'] ?? []);
            app(MailActivityLogger::class)->record('message.received', thread: $message->thread, account: $message->thread->mailAccount, metadata: [
                'from' => $message->from_address,
                'subject' => $message->thread->subject,
            ]);
        }
    }

    private function resolveThread(string $fromAddress, ?string $fromName, string $subject, ?string $inReplyTo, ?string $mailbox, ?MailAccount $mailAccount): MailThread
    {
        if ($inReplyTo) {
            $relatedMessage = MailMessage::where('provider_message_id', $inReplyTo)->first();

            if ($relatedMessage && $relatedMessage->thread->mail_account_id === $mailAccount?->id) {
                return $relatedMessage->thread;
            }
        }

        $normalizedSubject = $this->normalizedSubject($subject);

        return MailThread::query()
            ->where('participant_email', $fromAddress)
            ->where('subject', $normalizedSubject)
            ->where('status', 'open')
            ->when($mailAccount, fn ($query) => $query->where('mail_account_id', $mailAccount->id))
            ->when(! $mailAccount, fn ($query) => $query->whereNull('mail_account_id'))
            ->latest('last_message_at')
            ->first()
            ?? MailThread::create([
                'subject' => $normalizedSubject,
                'mailbox' => $mailbox,
                'mail_account_id' => $mailAccount?->id,
                'participant_name' => $fromName,
                'participant_email' => $fromAddress,
                'last_message_at' => now(),
                'last_direction' => 'inbound',
            ]);
    }

    private function parseAddress(string $value): array
    {
        if (preg_match('/^\s*(.*?)\s*<([^>]+)>\s*$/', $value, $matches)) {
            return [
                'name' => trim($matches[1], " \t\n\r\0\x0B\""),
                'address' => strtolower(trim($matches[2])),
            ];
        }

        return ['name' => null, 'address' => strtolower(trim($value))];
    }

    private function normalizeHeaders(array $headers): array
    {
        $normalized = [];

        foreach ($headers as $name => $value) {
            $normalized[strtolower((string) $name)] = is_array($value) ? implode(', ', $value) : (string) $value;
        }

        return $normalized;
    }

    private function firstAddress(array|string|null $addresses): ?string
    {
        if (is_string($addresses)) {
            return $addresses;
        }

        return $addresses[0] ?? null;
    }

    private function normalizedSubject(string $subject): string
    {
        return trim((string) preg_replace('/^(?:(?:re|fw|fwd)\s*:\s*)+/i', '', $subject)) ?: '(Sin asunto)';
    }

    private function parseDate(?string $value): Carbon
    {
        return $value ? Carbon::parse($value) : now();
    }

    private function createAlerts(MailMessage $message, MailThread $thread, string $subject, ?string $senderName, string $senderAddress, string $preview): void
    {
        $recipients = $thread->mail_account_id
            ? $thread->mailAccount->users()
            : User::query()->where('role', 'admin');

        $recipients
            ->where('mail_in_app_notifications', true)
            ->eachById(function (User $user) use ($message, $thread, $subject, $senderName, $senderAddress, $preview): void {
                MailAlert::firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'mail_message_id' => $message->id,
                    ],
                    [
                        'mail_thread_id' => $thread->id,
                        'type' => 'mail.received',
                        'title' => 'Nuevo correo: '.$subject,
                        'body' => trim(($senderName ?: $senderAddress).': '.Str::limit($preview, 120)),
                        'url' => route('admin.mail.index', [
                            'folder' => 'inbox',
                            'selected' => $thread->id,
                        ], false),
                    ],
                );
            });
    }

    /** @param array<int, array<string, mixed>> $attachments */
    private function storeInboundAttachments(MailMessage $message, array $attachments): void
    {
        foreach ($attachments as $attachment) {
            $attachmentId = $attachment['id'] ?? null;
            if (! is_string($attachmentId) || $attachmentId === '' || $message->files()->where('provider_attachment_id', $attachmentId)->exists()) {
                continue;
            }

            try {
                $details = Resend::emails()->receiving->attachments->get($this->resendEmailId, $attachmentId)->toArray();
                $size = (int) ($details['size'] ?? $attachment['size'] ?? 0);

                if ($size > self::MAX_INBOUND_ATTACHMENT_BYTES) {
                    Log::warning('Inbound email attachment exceeded the local storage limit.', [
                        'email_id' => $this->resendEmailId,
                        'attachment_id' => $attachmentId,
                        'size' => $size,
                    ]);

                    continue;
                }

                $downloadUrl = $details['download_url'] ?? null;
                if (! is_string($downloadUrl) || ! $this->isTrustedResendDownloadUrl($downloadUrl)) {
                    throw new \RuntimeException('Resend returned an invalid attachment download URL.');
                }

                $response = Http::timeout(30)->retry(2, 500)->get($downloadUrl);
                if (! $response->successful()) {
                    throw new \RuntimeException('Unable to download the inbound attachment.');
                }

                $content = $response->body();
                if (strlen($content) > self::MAX_INBOUND_ATTACHMENT_BYTES) {
                    throw new \RuntimeException('Inbound attachment payload exceeded the local storage limit.');
                }

                $filename = $this->safeFilename((string) ($details['filename'] ?? $attachment['filename'] ?? 'adjunto'));
                $extension = pathinfo($filename, PATHINFO_EXTENSION);
                $storedName = (string) Str::uuid().($extension ? '.'.$extension : '');
                $path = 'mail-attachments/inbound/'.$message->id.'/'.$storedName;
                Storage::disk('local')->put($path, $content);

                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                $contentType = $finfo ? finfo_buffer($finfo, $content) : null;
                if ($finfo) {
                    finfo_close($finfo);
                }

                $message->files()->create([
                    'provider_attachment_id' => $attachmentId,
                    'filename' => $filename,
                    'content_type' => $contentType ?: ($details['content_type'] ?? $attachment['content_type'] ?? 'application/octet-stream'),
                    'size' => strlen($content),
                    'content_disposition' => $details['content_disposition'] ?? $attachment['content_disposition'] ?? 'attachment',
                    'content_id' => $details['content_id'] ?? $attachment['content_id'] ?? null,
                    'storage_disk' => 'local',
                    'storage_path' => $path,
                    'checksum' => hash('sha256', $content),
                    'downloaded_at' => now(),
                ]);
            } catch (\Throwable $exception) {
                Log::warning('Unable to store an inbound email attachment.', [
                    'email_id' => $this->resendEmailId,
                    'message_id' => $message->id,
                    'attachment_id' => $attachmentId,
                    'error' => $exception->getMessage(),
                ]);
            }
        }
    }

    private function isTrustedResendDownloadUrl(string $url): bool
    {
        $parts = parse_url($url);
        $host = strtolower((string) ($parts['host'] ?? ''));

        return ($parts['scheme'] ?? null) === 'https'
            && ($host === 'resend.com' || str_ends_with($host, '.resend.com'));
    }

    private function safeFilename(string $filename): string
    {
        $filename = basename(str_replace(['\\', '/', "\r", "\n"], '_', $filename));
        $filename = preg_replace('/[^\pL\pN._() -]+/u', '_', $filename) ?: 'adjunto';

        return Str::limit($filename, 160, '');
    }
}
