<?php

namespace App\Services;

use App\Models\MailAccount;
use App\Models\MailAttachment;
use App\Models\MailMessage;
use App\Models\MailThread;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;
use Webklex\PHPIMAP\Address;
use Webklex\PHPIMAP\Attachment;
use Webklex\PHPIMAP\Message;

class MailboxImapSynchronizer
{
    public function __construct(private readonly MailboxImapClientFactory $imap)
    {
    }

    /**
     * Imports only INBOX. It reads with IMAP PEEK and never marks remote mail as read.
     */
    public function synchronizeInbox(MailAccount $account): int
    {
        if (! $account->is_active) {
            throw new RuntimeException('El buzón está desactivado.');
        }

        if (! $account->usesImap()) {
            throw new RuntimeException('Este buzón recibe mediante Resend y no requiere sincronización IMAP.');
        }

        $client = $this->imap->make($account);
        $imported = 0;

        try {
            $client->connect();
            $inbox = $client->getFolder('INBOX');

            if (! $inbox) {
                throw new RuntimeException('El servidor IMAP no expone una carpeta INBOX.');
            }

            $since = $account->last_synced_at
                ? $account->last_synced_at->copy()->subDay()
                : now()->subDays(config('mailbox.sync.initial_days'));

            $messages = $inbox->messages()
                ->whereSince($since)
                ->limit(config('mailbox.sync.max_messages_per_run'))
                ->setFetchBody(true)
                ->get();

            foreach ($messages as $remoteMessage) {
                if ($this->importMessage($account, $remoteMessage)) {
                    $imported++;
                }
            }

            $account->update([
                'last_synced_at' => now(),
                'last_sync_error' => null,
            ]);

            return $imported;
        } catch (Throwable $exception) {
            $account->update(['last_sync_error' => $exception->getMessage()]);

            throw $exception;
        } finally {
            if ($client->isConnected()) {
                $client->disconnect();
            }
        }
    }

    private function importMessage(MailAccount $account, Message $remoteMessage): bool
    {
        $uid = (string) $remoteMessage->getUid();
        $providerId = 'imap:'.$account->id.':INBOX:'.$uid;

        if (MailMessage::where('provider_id', $providerId)->exists()) {
            return false;
        }

        $from = $this->firstAddress($remoteMessage->getFrom()->first());
        $to = $this->addresses($remoteMessage->getTo()->all());
        $cc = $this->addresses($remoteMessage->getCc()->all());
        $bcc = $this->addresses($remoteMessage->getBcc()->all());
        $subject = trim((string) $remoteMessage->getSubject()) ?: '(Sin asunto)';
        $inReplyTo = trim((string) $remoteMessage->getInReplyTo()) ?: null;
        $providerMessageId = trim((string) $remoteMessage->getMessageId()) ?: null;
        $textBody = $remoteMessage->getTextBody();
        $htmlBody = $remoteMessage->getHTMLBody() ?: null;

        if ($textBody === '' && $htmlBody) {
            $textBody = trim(strip_tags($htmlBody));
        }

        $receivedAt = $this->messageDate($remoteMessage);
        $metadata = [];

        foreach ($remoteMessage->getAttachments() as $attachment) {
            $metadata[] = [
                'id' => (string) $attachment->getId(),
                'filename' => $this->safeFilename((string) $attachment->getName()),
                'content_type' => $attachment->getMimeType(),
                'size' => (int) $attachment->getSize(),
                'content_disposition' => $attachment->getDisposition(),
            ];
        }

        $message = DB::transaction(function () use ($account, $providerId, $providerMessageId, $inReplyTo, $from, $to, $cc, $bcc, $subject, $textBody, $htmlBody, $metadata, $receivedAt, $remoteMessage): ?MailMessage {
            if (MailMessage::where('provider_id', $providerId)->exists()) {
                return null;
            }

            $thread = $this->resolveThread($account, $from['address'], $from['name'], $subject, $inReplyTo);
            $message = $thread->messages()->create([
                'direction' => 'inbound',
                'provider_id' => $providerId,
                'provider_message_id' => $providerMessageId,
                'in_reply_to' => $inReplyTo,
                'from_address' => $from['address'],
                'from_name' => $from['name'],
                'to_addresses' => $to ?: [$account->address],
                'cc_addresses' => $cc ?: null,
                'bcc_addresses' => $bcc ?: null,
                'text_body' => $textBody,
                'html_body' => $htmlBody,
                'attachments' => $metadata ?: null,
                'is_read' => $remoteMessage->hasFlag('seen'),
                'received_at' => $receivedAt,
            ]);

            $thread->update([
                'mailbox' => $account->address,
                'mail_account_id' => $account->id,
                'participant_name' => $from['name'],
                'participant_email' => $from['address'],
                'last_direction' => 'inbound',
                'last_preview' => Str::limit($textBody, 180),
                'last_message_at' => $receivedAt,
                'archived_at' => null,
            ]);

            return $message;
        });

        if (! $message) {
            return false;
        }

        foreach ($remoteMessage->getAttachments() as $attachment) {
            $this->storeAttachment($message, $attachment);
        }

        return true;
    }

    private function resolveThread(MailAccount $account, string $fromAddress, ?string $fromName, string $subject, ?string $inReplyTo): MailThread
    {
        if ($inReplyTo) {
            $replyThread = MailMessage::query()
                ->where('provider_message_id', $inReplyTo)
                ->whereHas('thread', fn ($query) => $query->where('mail_account_id', $account->id))
                ->latest('id')
                ->first()
                ?->thread;

            if ($replyThread) {
                return $replyThread;
            }
        }

        $normalizedSubject = trim((string) preg_replace('/^(?:(?:re|fw|fwd)\s*:\s*)+/i', '', $subject)) ?: '(Sin asunto)';

        return MailThread::query()
            ->where('mail_account_id', $account->id)
            ->where('participant_email', $fromAddress)
            ->where('subject', $normalizedSubject)
            ->where('status', 'open')
            ->latest('last_message_at')
            ->first()
            ?? MailThread::create([
                'subject' => $normalizedSubject,
                'mailbox' => $account->address,
                'mail_account_id' => $account->id,
                'participant_name' => $fromName,
                'participant_email' => $fromAddress,
                'last_message_at' => now(),
                'last_direction' => 'inbound',
            ]);
    }

    private function storeAttachment(MailMessage $message, Attachment $attachment): void
    {
        $content = (string) $attachment->getContent();
        $attachmentId = (string) $attachment->getId();

        if ($attachmentId === '' || $message->files()->where('provider_attachment_id', $attachmentId)->exists()) {
            return;
        }

        if (strlen($content) > config('mailbox.sync.max_attachment_bytes')) {
            return;
        }

        $filename = $this->safeFilename((string) $attachment->getName());
        $extension = pathinfo($filename, PATHINFO_EXTENSION);
        $path = 'mail-attachments/imap/'.$message->id.'/'.Str::uuid().($extension ? '.'.$extension : '');
        Storage::disk('local')->put($path, $content);

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $contentType = $finfo ? finfo_buffer($finfo, $content) : null;
        if ($finfo) {
            finfo_close($finfo);
        }

        $message->files()->create([
            'provider_attachment_id' => $attachmentId,
            'filename' => $filename,
            'content_type' => $contentType ?: $attachment->getMimeType() ?: 'application/octet-stream',
            'size' => strlen($content),
            'content_disposition' => $attachment->getDisposition() ?: 'attachment',
            'content_id' => $attachment->getId() ?: null,
            'storage_disk' => 'local',
            'storage_path' => $path,
            'checksum' => hash('sha256', $content),
            'downloaded_at' => now(),
        ]);
    }

    /** @param array<int, mixed> $addresses */
    private function addresses(array $addresses): array
    {
        return array_values(array_filter(array_map(
            fn ($address) => $address instanceof Address ? strtolower($address->mail) : null,
            $addresses,
        )));
    }

    /** @return array{name: ?string, address: string} */
    private function firstAddress(mixed $address): array
    {
        if ($address instanceof Address && $address->mail !== '') {
            return [
                'name' => $address->personal ?: null,
                'address' => strtolower($address->mail),
            ];
        }

        return ['name' => null, 'address' => 'desconocido@invalid.local'];
    }

    private function messageDate(Message $message): Carbon
    {
        try {
            return $message->getDate()->toDate();
        } catch (Throwable) {
            return now();
        }
    }

    private function safeFilename(string $filename): string
    {
        $filename = basename(str_replace(['\\', '/', "\r", "\n"], '_', $filename));
        $filename = preg_replace('/[^\pL\pN._() -]+/u', '_', $filename) ?: 'adjunto';

        return Str::limit($filename, 160, '');
    }
}
