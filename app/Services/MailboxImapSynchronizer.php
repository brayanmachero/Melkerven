<?php

namespace App\Services;

use App\Models\MailAccount;
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
use Webklex\PHPIMAP\Folder;
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
                $result = $this->importMessage($account, $remoteMessage, $inbox->path, 'inbox');
                $imported += $result['imported'] ? 1 : 0;
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

    /**
     * Prepares a resumable archive import. Folder paths are stored before any
     * message is read so a later IMAP rename cannot silently change the scope.
     */
    public function prepareHistoryImport(MailAccount $account): void
    {
        if (! $account->is_active || ! $account->usesImap()) {
            throw new RuntimeException('Configura y activa IMAP antes de iniciar la migración histórica.');
        }

        $client = $this->imap->make($account);

        try {
            $client->connect();
            $folders = $this->historyFolders($client->getFolders(false)->all());

            if ($folders === []) {
                throw new RuntimeException('No se detectaron carpetas IMAP que se puedan importar.');
            }

            $account->update([
                'history_import_status' => 'running',
                'history_import_folders' => $folders,
                'history_import_folder_index' => 0,
                'history_import_page' => 1,
                'history_imported_messages' => 0,
                'history_imported_attachments' => 0,
                'history_import_started_at' => now(),
                'history_import_completed_at' => null,
                'history_import_error' => null,
                'last_sync_error' => null,
            ]);
        } finally {
            if ($client->isConnected()) {
                $client->disconnect();
            }
        }
    }

    /**
     * Imports one bounded page and returns true when a follow-up job is needed.
     * This keeps large mailboxes safe for the shared server and makes retries idempotent.
     */
    public function importNextHistoryPage(MailAccount $account): bool
    {
        if ($account->history_import_status === 'completed') {
            return false;
        }

        if (blank($account->history_import_folders)) {
            $this->prepareHistoryImport($account);
            $account->refresh();
        }

        $folders = $account->history_import_folders ?? [];
        $index = $account->history_import_folder_index;

        if (! isset($folders[$index])) {
            $this->completeHistoryImport($account);

            return false;
        }

        $descriptor = $folders[$index];
        $client = $this->imap->make($account);

        try {
            $client->connect();
            $folder = $client->getFolderByPath((string) $descriptor['path'], false, true);

            if (! $folder) {
                return $this->advanceHistoryFolder($account, $folders, 'La carpeta '.$descriptor['path'].' ya no existe en el proveedor.');
            }

            $chunkSize = max(10, min((int) config('mailbox.sync.history_chunk_size'), 250));
            $messages = $folder->messages()
                ->limit($chunkSize, max(1, $account->history_import_page))
                ->setFetchBody(true)
                ->get();

            $importedMessages = 0;
            $importedAttachments = 0;

            foreach ($messages as $remoteMessage) {
                $result = $this->importMessage($account, $remoteMessage, $folder->path, (string) $descriptor['type']);
                $importedMessages += $result['imported'] ? 1 : 0;
                $importedAttachments += $result['attachments'];
            }

            $account->increment('history_imported_messages', $importedMessages);
            $account->increment('history_imported_attachments', $importedAttachments);
            $account->update(['history_import_error' => null]);

            if ($messages->count() >= $chunkSize) {
                $account->increment('history_import_page');

                return true;
            }

            return $this->advanceHistoryFolder($account, $folders);
        } finally {
            if ($client->isConnected()) {
                $client->disconnect();
            }
        }
    }

    /** @param array<int, Folder> $folders
     *  @return array<int, array{path: string, type: string}>
     */
    public function historyFolders(array $folders): array
    {
        $result = [];

        foreach ($folders as $folder) {
            if (! $folder instanceof Folder || $folder->no_select) {
                continue;
            }

            $result[] = [
                'path' => $folder->path,
                'type' => $this->folderType($folder->path),
            ];
        }

        usort($result, fn (array $left, array $right) => $this->folderPriority($left['type']) <=> $this->folderPriority($right['type']));

        return array_values(array_unique($result, SORT_REGULAR));
    }

    public function folderType(string $path): string
    {
        $name = Str::lower($path);

        return match (true) {
            str_contains($name, 'inbox') => 'inbox',
            (bool) preg_match('/sent|enviad|outbox|gesendet/u', $name) => 'sent',
            (bool) preg_match('/draft|borrador/u', $name) => 'draft',
            (bool) preg_match('/trash|papelera|deleted/u', $name) => 'trash',
            (bool) preg_match('/spam|junk|correo no deseado/u', $name) => 'spam',
            (bool) preg_match('/archive|archivad|all mail/u', $name) => 'archive',
            default => 'other',
        };
    }

    /** @param array<int, array{path: string, type: string}> $folders */
    private function advanceHistoryFolder(MailAccount $account, array $folders, ?string $notice = null): bool
    {
        $nextIndex = $account->history_import_folder_index + 1;

        if (! isset($folders[$nextIndex])) {
            $this->completeHistoryImport($account, $notice);

            return false;
        }

        $account->update([
            'history_import_folder_index' => $nextIndex,
            'history_import_page' => 1,
            'history_import_error' => $notice,
        ]);

        return true;
    }

    private function completeHistoryImport(MailAccount $account, ?string $notice = null): void
    {
        $account->update([
            'history_import_status' => 'completed',
            'history_import_completed_at' => now(),
            'history_import_error' => $notice,
        ]);
    }

    /** @return array{imported: bool, attachments: int} */
    private function importMessage(MailAccount $account, Message $remoteMessage, string $sourceFolder, string $sourceFolderType): array
    {
        $uid = (string) $remoteMessage->getUid();
        $providerId = 'imap:'.$account->id.':'.sha1($sourceFolder).':'.$uid;

        if (MailMessage::where('provider_id', $providerId)->exists()) {
            return ['imported' => false, 'attachments' => 0];
        }

        $from = $this->firstAddress($remoteMessage->getFrom()->first());
        $to = $this->addresses($remoteMessage->getTo()->all());
        $cc = $this->addresses($remoteMessage->getCc()->all());
        $bcc = $this->addresses($remoteMessage->getBcc()->all());
        $subject = trim((string) $remoteMessage->getSubject()) ?: '(Sin asunto)';
        $inReplyTo = trim((string) $remoteMessage->getInReplyTo()) ?: null;
        $providerMessageId = trim((string) $remoteMessage->getMessageId()) ?: null;

        if ($providerMessageId && MailMessage::query()
            ->where('provider_message_id', $providerMessageId)
            ->whereHas('thread', fn ($query) => $query->where('mail_account_id', $account->id))
            ->exists()) {
            return ['imported' => false, 'attachments' => 0];
        }

        $textBody = $remoteMessage->getTextBody();
        $htmlBody = $remoteMessage->getHTMLBody() ?: null;

        if ($textBody === '' && $htmlBody) {
            $textBody = trim(strip_tags($htmlBody));
        }

        $occurredAt = $this->messageDate($remoteMessage);
        $direction = $this->direction($account, $from['address'], $sourceFolderType);
        $participant = $this->participant($account, $from, $to, $direction);
        $metadata = $this->attachmentMetadata($remoteMessage);

        $message = DB::transaction(function () use ($account, $providerId, $providerMessageId, $inReplyTo, $from, $to, $cc, $bcc, $subject, $textBody, $htmlBody, $metadata, $occurredAt, $direction, $participant, $sourceFolder, $sourceFolderType): ?MailMessage {
            if (MailMessage::where('provider_id', $providerId)->exists()) {
                return null;
            }

            $thread = $this->resolveThread($account, $participant, $subject, $inReplyTo);
            $message = $thread->messages()->create([
                'direction' => $direction,
                'provider_id' => $providerId,
                'provider_message_id' => $providerMessageId,
                'source_folder' => $sourceFolder,
                'source_folder_type' => $sourceFolderType,
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
                'sent_at' => in_array($direction, ['outbound', 'draft'], true) ? $occurredAt : null,
                'received_at' => $direction === 'inbound' ? $occurredAt : null,
            ]);

            if (! $thread->last_message_at || $occurredAt->greaterThanOrEqualTo($thread->last_message_at)) {
                $thread->update([
                    'mailbox' => $account->address,
                    'mail_account_id' => $account->id,
                    'participant_name' => $participant['name'],
                    'participant_email' => $participant['address'],
                    'last_direction' => $direction,
                    'last_preview' => Str::limit($textBody, 180),
                    'last_message_at' => $occurredAt,
                    'archived_at' => null,
                ]);
            }

            if ($sourceFolderType === 'trash' && $thread->messages()->count() === 1) {
                $thread->delete();
            }

            return $message;
        });

        if (! $message) {
            return ['imported' => false, 'attachments' => 0];
        }

        $attachments = 0;
        foreach ($remoteMessage->getAttachments() as $attachment) {
            $attachments += $this->storeAttachment($message, $attachment) ? 1 : 0;
        }

        return ['imported' => true, 'attachments' => $attachments];
    }

    /** @return array<int, array{id: string, filename: string, content_type: string|null, size: int, content_disposition: string|null}> */
    private function attachmentMetadata(Message $remoteMessage): array
    {
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

        return $metadata;
    }

    /** @param array{name: ?string, address: string} $from
     *  @param array<int, string> $to
     *  @return array{name: ?string, address: string}
     */
    private function participant(MailAccount $account, array $from, array $to, string $direction): array
    {
        if (in_array($direction, ['outbound', 'draft'], true)) {
            $recipient = collect($to)->first(fn (string $address) => strtolower($address) !== strtolower($account->address));

            return ['name' => null, 'address' => $recipient ?: $account->address];
        }

        return $from;
    }

    private function direction(MailAccount $account, string $fromAddress, string $sourceFolderType): string
    {
        if ($sourceFolderType === 'draft') {
            return 'draft';
        }

        if ($sourceFolderType === 'sent' || strtolower($fromAddress) === strtolower($account->address)) {
            return 'outbound';
        }

        return 'inbound';
    }

    /** @param array{name: ?string, address: string} $participant */
    private function resolveThread(MailAccount $account, array $participant, string $subject, ?string $inReplyTo): MailThread
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
            ->where('participant_email', $participant['address'])
            ->where('subject', $normalizedSubject)
            ->where('status', 'open')
            ->latest('last_message_at')
            ->first()
            ?? MailThread::create([
                'subject' => $normalizedSubject,
                'mailbox' => $account->address,
                'mail_account_id' => $account->id,
                'participant_name' => $participant['name'],
                'participant_email' => $participant['address'],
                'last_message_at' => now(),
                'last_direction' => 'inbound',
            ]);
    }

    private function storeAttachment(MailMessage $message, Attachment $attachment): bool
    {
        $content = (string) $attachment->getContent();
        $attachmentId = (string) $attachment->getId();

        if ($attachmentId === '' || $message->files()->where('provider_attachment_id', $attachmentId)->exists()) {
            return false;
        }

        if (strlen($content) > config('mailbox.sync.max_attachment_bytes')) {
            return false;
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

        return true;
    }

    private function folderPriority(string $type): int
    {
        return match ($type) {
            'inbox' => 0,
            'sent' => 1,
            'draft' => 2,
            'archive' => 3,
            'trash' => 4,
            'spam' => 5,
            default => 6,
        };
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
};
