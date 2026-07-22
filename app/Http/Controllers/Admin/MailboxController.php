<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MailAlert;
use App\Models\MailAccount;
use App\Models\MailActivity;
use App\Models\MailAttachment;
use App\Models\MailDraft;
use App\Models\MailDraftAttachment;
use App\Models\MailMessage;
use App\Models\MailThread;
use App\Services\MailActivityLogger;
use App\Services\MailboxAccess;
use App\Support\EmailSignatureSanitizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Resend\Laravel\Facades\Resend;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class MailboxController extends Controller
{
    private const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

    public function index(Request $request): Response
    {
        $folder = $request->string('folder', 'inbox')->value();

        if (! in_array($folder, ['inbox', 'sent', 'archived', 'trash'], true)) {
            $folder = 'inbox';
        }

        $selectedThread = null;
        $selectedId = $request->integer('selected');

        if ($selectedId > 0) {
            $selectedThread = MailThread::withTrashed()->findOrFail($selectedId);
            abort_unless(app(MailboxAccess::class)->canReadThread($request->user(), $selectedThread), 403);
            $selectedThread->messages()
                ->where('direction', 'inbound')
                ->where('is_read', false)
                ->update(['is_read' => true]);
            $selectedThread->load([
                'assignedTo:id,name',
                'messages' => fn ($query) => $query->with(['sentBy:id,name', 'files'])->orderBy('created_at'),
            ]);
        }

        $mailAccountIds = $request->user()->mailAccounts()->pluck('mail_accounts.id');

        $visibleThreads = MailThread::query()
            ->where(function ($query) use ($mailAccountIds) {
                $query->whereNull('mail_account_id')
                    ->orWhereIn('mail_account_id', $mailAccountIds);
            });

        $threads = ($folder === 'trash' ? (clone $visibleThreads)->onlyTrashed() : clone $visibleThreads)
            ->with('assignedTo:id,name')
            ->withCount([
                'messages as unread_count' => fn ($query) => $query
                    ->where('direction', 'inbound')
                    ->where('is_read', false),
                'messages as message_count',
            ])
            ->when($folder === 'inbox', fn ($query) => $query->whereNull('archived_at'))
            ->when($folder === 'sent', fn ($query) => $query
                ->whereNull('archived_at')
                ->whereHas('messages', fn ($messages) => $messages->where('direction', 'outbound')))
            ->when($folder === 'archived', fn ($query) => $query->whereNotNull('archived_at'))
            ->when($folder === 'trash', fn ($query) => $query)
            ->orderByDesc('last_message_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Mail/Index', [
            'folder' => $folder,
            'threads' => $threads,
            'counts' => [
                'inbox' => MailMessage::where('direction', 'inbound')
                    ->where('is_read', false)
                    ->whereIn('mail_thread_id', (clone $visibleThreads)->select('id'))
                    ->count(),
                'sent' => MailMessage::where('direction', 'outbound')
                    ->whereIn('mail_thread_id', (clone $visibleThreads)->select('id'))
                    ->count(),
                'archived' => (clone $visibleThreads)->whereNotNull('archived_at')->count(),
                'trash' => (clone $visibleThreads)->onlyTrashed()->count(),
                'drafts' => MailDraft::where('user_id', $request->user()->id)->count(),
            ],
            'selectedThread' => $selectedThread,
            'selectedDraft' => $request->integer('draft') > 0
                ? MailDraft::query()
                    ->where('user_id', $request->user()->id)
                    ->with('files')
                    ->findOrFail($request->integer('draft'))
                : null,
            'mailAccounts' => $request->user()
                ->mailAccounts()
                ->where('mail_accounts.is_active', true)
                ->orderBy('mail_accounts.address')
                ->get(['mail_accounts.id', 'mail_accounts.address', 'mail_accounts.display_name', 'mail_accounts.is_shared']),
            'preferences' => $this->preferences($request),
        ]);
    }

    public function show(MailThread $thread): Response
    {
        abort_unless(app(MailboxAccess::class)->canReadThread(request()->user(), $thread), 403);

        $thread->messages()
            ->where('direction', 'inbound')
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $thread->load([
            'assignedTo:id,name',
            'messages' => fn ($query) => $query->with(['sentBy:id,name', 'files'])->orderBy('created_at'),
        ]);

        return Inertia::render('Admin/Mail/Show', [
            'thread' => $thread,
        ]);
    }

    public function send(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'thread_id' => ['nullable', 'integer', 'exists:mail_threads,id'],
            'draft_id' => ['nullable', 'integer', 'exists:mail_drafts,id'],
            'mail_account_id' => ['nullable', 'integer', 'exists:mail_accounts,id'],
            'to' => ['required', 'email:rfc,dns', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:50000'],
            'attachments' => ['nullable', 'array', 'max:8'],
            'attachments.*' => [
                'file',
                'max:10240',
                'mimetypes:application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,text/csv,image/jpeg,image/png,image/webp',
            ],
        ]);

        /** @var array<int, UploadedFile> $uploadedFiles */
        $uploadedFiles = array_values(array_filter($request->file('attachments', [])));
        $draft = isset($data['draft_id'])
            ? MailDraft::query()->where('user_id', $request->user()->id)->with('files')->findOrFail($data['draft_id'])
            : null;
        $draftFiles = $draft?->files ?? collect();
        $this->assertAttachmentTotalSize($uploadedFiles, $draftFiles->sum('size'));

        if (! config('resend.api_key')) {
            throw ValidationException::withMessages([
                'mailbox' => 'Configura RESEND_API_KEY antes de enviar correos desde la bandeja.',
            ]);
        }

        $thread = isset($data['thread_id'])
            ? MailThread::findOrFail($data['thread_id'])
            : null;

        if ($thread) {
            abort_unless(app(MailboxAccess::class)->canReadThread($request->user(), $thread), 403);
        }

        if ($thread?->mail_account_id && isset($data['mail_account_id']) && (int) $data['mail_account_id'] !== $thread->mail_account_id) {
            throw ValidationException::withMessages([
                'mail_account_id' => 'Las respuestas deben enviarse desde el mismo buzón que recibió la conversación.',
            ]);
        }

        $mailAccount = $thread?->mailAccount
            ?? (isset($data['mail_account_id']) ? MailAccount::findOrFail($data['mail_account_id']) : null);

        if ($mailAccount && ! app(MailboxAccess::class)->canUseAccount($request->user(), $mailAccount, sending: true)) {
            abort(403);
        }

        $fromAddress = $mailAccount?->address ?: (string) config('mail.from.address');
        $fromName = $mailAccount?->display_name ?: (string) config('mail.from.name');

        if ($fromAddress === '' || $fromAddress === 'hello@example.com') {
            throw ValidationException::withMessages([
                'mailbox' => 'Configura MAIL_FROM_ADDRESS con una dirección verificada en Resend.',
            ]);
        }

        $lastInbound = $thread?->messages()
            ->where('direction', 'inbound')
            ->latest('created_at')
            ->first();

        $headers = [];
        if ($lastInbound?->provider_message_id) {
            $headers['In-Reply-To'] = $lastInbound->provider_message_id;
            $headers['References'] = $lastInbound->provider_message_id;
        }

        $signatureHtml = EmailSignatureSanitizer::sanitize($request->user()->mail_signature_html);
        $signatureText = $request->user()->mail_signature_text ?: EmailSignatureSanitizer::toPlainText($signatureHtml);
        $textBody = $data['body'].($signatureText ? "\n\n--\n".$signatureText : '');
        $htmlBody = '<div>'.nl2br(e($data['body'])).'</div>'
            .($signatureHtml ? '<hr style="border:0;border-top:1px solid #e5e7eb;margin:24px 0"><div>'.$signatureHtml.'</div>' : '');
        $attachmentMetadata = [
            ...$draftFiles->map(fn (MailDraftAttachment $file) => [
                'filename' => $file->filename,
                'content_type' => $file->content_type,
                'size' => $file->size,
            ])->all(),
            ...array_map(fn (UploadedFile $file) => [
                'filename' => $this->safeFilename($file->getClientOriginalName()),
                'content_type' => $file->getMimeType(),
                'size' => $file->getSize(),
            ], $uploadedFiles),
        ];
        $resendAttachments = [
            ...$draftFiles->map(fn (MailDraftAttachment $file) => [
                'filename' => $file->filename,
                'content' => base64_encode($this->draftAttachmentContent($file)),
            ])->all(),
            ...array_map(fn (UploadedFile $file) => [
                'filename' => $this->safeFilename($file->getClientOriginalName()),
                'content' => base64_encode((string) file_get_contents($file->getRealPath())),
            ], $uploadedFiles),
        ];

        try {
            $sentEmail = Resend::emails()->send([
                'from' => sprintf('%s <%s>', $fromName, $fromAddress),
                'to' => $data['to'],
                'subject' => $data['subject'],
                'text' => $textBody,
                'html' => $htmlBody,
                'headers' => $headers,
                'attachments' => $resendAttachments,
            ]);
        } catch (\Throwable $exception) {
            Log::error('Unable to send mailbox email through Resend.', [
                'to' => $data['to'],
                'error' => $exception->getMessage(),
            ]);

            throw ValidationException::withMessages([
                'mailbox' => 'No fue posible enviar el correo. Revisa la configuración de Resend e inténtalo nuevamente.',
            ]);
        }

        $thread ??= MailThread::create([
            'subject' => $this->normalizedSubject($data['subject']),
            'mailbox' => $fromAddress,
            'mail_account_id' => $mailAccount?->id,
            'participant_email' => strtolower($data['to']),
            'last_message_at' => now(),
            'last_direction' => 'outbound',
        ]);

        $message = $thread->messages()->create([
            'sent_by' => $request->user()->id,
            'direction' => 'outbound',
            'provider_id' => $sentEmail->id,
            'in_reply_to' => $lastInbound?->provider_message_id,
            'from_address' => $fromAddress,
            'from_name' => $fromName,
            'to_addresses' => [$data['to']],
            'text_body' => $textBody,
            'html_body' => $htmlBody,
            'attachments' => $attachmentMetadata,
            'is_read' => true,
            'sent_at' => now(),
        ]);

        $thread->update([
            'participant_email' => strtolower($data['to']),
            'last_direction' => 'outbound',
            'last_preview' => Str::limit($data['body'], 180),
            'last_message_at' => now(),
        ]);

        $this->storeUploadedAttachments($message, $uploadedFiles);
        $this->transferDraftAttachments($message, $draftFiles);
        $this->discardDraft($draft);
        app(MailActivityLogger::class)->record('message.sent', $request->user(), $thread, null, $mailAccount, [
            'to' => strtolower($data['to']),
            'subject' => $data['subject'],
        ]);

        return redirect()
            ->route('admin.mail.show', $thread)
            ->with('success', 'Correo enviado correctamente.');
    }

    public function drafts(Request $request): Response
    {
        return Inertia::render('Admin/Mail/Drafts', [
            'drafts' => MailDraft::query()
                ->where('user_id', $request->user()->id)
                ->with(['mailAccount:id,address,display_name', 'files'])
                ->latest('updated_at')
                ->paginate(20),
        ]);
    }

    public function saveDraft(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'draft_id' => ['nullable', 'integer', 'exists:mail_drafts,id'],
            'mail_account_id' => ['nullable', 'integer', 'exists:mail_accounts,id'],
            'to' => ['nullable', 'email:rfc', 'max:255'],
            'subject' => ['nullable', 'string', 'max:255'],
            'body' => ['nullable', 'string', 'max:50000'],
            'attachments' => ['nullable', 'array', 'max:8'],
            'attachments.*' => [
                'file',
                'max:10240',
                'mimetypes:application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,text/csv,image/jpeg,image/png,image/webp',
            ],
        ]);

        $draft = isset($data['draft_id'])
            ? MailDraft::query()->where('user_id', $request->user()->id)->with('files')->findOrFail($data['draft_id'])
            : new MailDraft(['user_id' => $request->user()->id]);
        $mailAccount = isset($data['mail_account_id']) ? MailAccount::findOrFail($data['mail_account_id']) : null;

        if ($mailAccount) {
            abort_unless(app(MailboxAccess::class)->canUseAccount($request->user(), $mailAccount, sending: true), 403);
        }

        /** @var array<int, UploadedFile> $uploadedFiles */
        $uploadedFiles = array_values(array_filter($request->file('attachments', [])));
        $this->assertAttachmentTotalSize($uploadedFiles, $draft->exists ? $draft->files->sum('size') : 0);

        $draft->fill([
            'mail_account_id' => $mailAccount?->id,
            'to_address' => $data['to'] ? strtolower($data['to']) : null,
            'subject' => $data['subject'] ?: null,
            'body' => $data['body'] ?: null,
        ])->save();
        $this->storeDraftAttachments($draft, $uploadedFiles);

        app(MailActivityLogger::class)->record('draft.saved', $request->user(), null, $draft, $mailAccount, [
            'subject' => $draft->subject,
        ]);

        return redirect()
            ->route('admin.mail.drafts')
            ->with('success', 'Borrador guardado de forma privada.');
    }

    public function destroyDraft(Request $request, MailDraft $draft): RedirectResponse
    {
        abort_unless($draft->user_id === $request->user()->id, 403);

        app(MailActivityLogger::class)->record('draft.discarded', $request->user(), null, $draft, $draft->mailAccount, [
            'subject' => $draft->subject,
        ]);
        $this->discardDraft($draft->load('files'));

        return back()->with('success', 'Borrador eliminado.');
    }

    public function downloadDraftAttachment(Request $request, MailDraftAttachment $attachment)
    {
        abort_unless($attachment->draft->user_id === $request->user()->id, 403);
        abort_unless(Storage::disk($attachment->storage_disk)->exists($attachment->storage_path), 404);

        return Storage::disk($attachment->storage_disk)->download(
            $attachment->storage_path,
            $this->safeFilename($attachment->filename),
            ['X-Content-Type-Options' => 'nosniff'],
        );
    }

    public function files(Request $request): Response
    {
        $mailAccountIds = $request->user()->mailAccounts()->pluck('mail_accounts.id');
        $visibleThreads = MailThread::withTrashed()->where(function ($query) use ($mailAccountIds) {
            $query->whereNull('mail_account_id')->orWhereIn('mail_account_id', $mailAccountIds);
        });

        return Inertia::render('Admin/Mail/Files', [
            'files' => MailAttachment::query()
                ->whereHas('message', fn ($query) => $query->whereIn('mail_thread_id', (clone $visibleThreads)->select('id')))
                ->with(['message.thread:id,subject,mailbox,deleted_at'])
                ->latest()
                ->paginate(30),
        ]);
    }

    public function history(Request $request): Response
    {
        $mailAccountIds = $request->user()->mailAccounts()->pluck('mail_accounts.id');

        return Inertia::render('Admin/Mail/History', [
            'activities' => MailActivity::query()
                ->where(function ($query) use ($request, $mailAccountIds) {
                    $query->where('actor_id', $request->user()->id)
                        ->orWhereNull('mail_account_id')
                        ->orWhereIn('mail_account_id', $mailAccountIds);
                })
                ->with(['actor:id,name', 'thread:id,subject,deleted_at', 'mailAccount:id,address,display_name'])
                ->latest()
                ->paginate(40),
        ]);
    }

    public function archive(Request $request, MailThread $thread): RedirectResponse
    {
        abort_unless(app(MailboxAccess::class)->canReadThread($request->user(), $thread), 403);

        $data = $request->validate([
            'archived' => ['required', 'boolean'],
        ]);

        $thread->update([
            'archived_at' => $data['archived'] ? now() : null,
        ]);
        app(MailActivityLogger::class)->record(
            $data['archived'] ? 'thread.archived' : 'thread.unarchived',
            $request->user(),
            $thread,
            metadata: ['subject' => $thread->subject],
        );

        return back()->with('success', $data['archived'] ? 'Conversación archivada.' : 'Conversación restaurada.');
    }

    public function trash(Request $request, MailThread $thread): RedirectResponse
    {
        abort_unless(app(MailboxAccess::class)->canReadThread($request->user(), $thread), 403);

        app(MailActivityLogger::class)->record('thread.trashed', $request->user(), $thread, metadata: [
            'subject' => $thread->subject,
        ]);
        $thread->delete();

        return redirect()
            ->route('admin.mail.index', ['folder' => 'trash', 'selected' => $thread->id])
            ->with('success', 'Conversación movida a la papelera.');
    }

    public function restore(Request $request, int $thread): RedirectResponse
    {
        $trashedThread = MailThread::onlyTrashed()->findOrFail($thread);
        abort_unless(app(MailboxAccess::class)->canReadThread($request->user(), $trashedThread), 403);

        $trashedThread->restore();
        $trashedThread->update(['archived_at' => null]);
        app(MailActivityLogger::class)->record('thread.restored', $request->user(), $trashedThread, metadata: [
            'subject' => $trashedThread->subject,
        ]);

        return redirect()
            ->route('admin.mail.index', ['folder' => 'inbox', 'selected' => $trashedThread->id])
            ->with('success', 'Conversación restaurada de la papelera.');
    }

    public function purge(Request $request, int $thread): RedirectResponse
    {
        $trashedThread = MailThread::onlyTrashed()->with('messages.files')->findOrFail($thread);
        abort_unless(app(MailboxAccess::class)->canReadThread($request->user(), $trashedThread), 403);

        app(MailActivityLogger::class)->record('thread.purged', $request->user(), $trashedThread, metadata: [
            'subject' => $trashedThread->subject,
        ]);
        foreach ($trashedThread->messages as $message) {
            foreach ($message->files as $attachment) {
                if ($attachment->storage_path) {
                    Storage::disk($attachment->storage_disk)->delete($attachment->storage_path);
                }
            }
        }
        $trashedThread->forceDelete();

        return redirect()
            ->route('admin.mail.index', ['folder' => 'trash'])
            ->with('success', 'Conversación eliminada definitivamente.');
    }

    public function downloadAttachment(Request $request, MailAttachment $attachment)
    {
        $this->authorizeAttachmentAccess($request, $attachment);

        abort_unless($attachment->storage_path && Storage::disk($attachment->storage_disk)->exists($attachment->storage_path), 404);

        return Storage::disk($attachment->storage_disk)->download(
            $attachment->storage_path,
            $this->safeFilename($attachment->filename),
            ['X-Content-Type-Options' => 'nosniff'],
        );
    }

    public function inlineAttachment(Request $request, MailAttachment $attachment)
    {
        $this->authorizeAttachmentAccess($request, $attachment);

        abort_unless($attachment->is_previewable, 404);
        abort_unless($attachment->storage_path && Storage::disk($attachment->storage_disk)->exists($attachment->storage_path), 404);

        return Storage::disk($attachment->storage_disk)->response(
            $attachment->storage_path,
            $this->safeFilename($attachment->filename),
            [
                'Content-Type' => $attachment->content_type ?: 'application/octet-stream',
                'Content-Disposition' => 'inline; filename="'.$this->safeFilename($attachment->filename).'"',
                'Cache-Control' => 'private, max-age=3600',
                'X-Content-Type-Options' => 'nosniff',
            ],
        );
    }

    public function settings(Request $request): Response
    {
        return Inertia::render('Admin/Mail/Settings', [
            'preferences' => $this->preferences($request),
        ]);
    }

    public function updateSettings(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'mail_signature_html' => ['nullable', 'string', 'max:30000'],
            'mail_in_app_notifications' => ['required', 'boolean'],
            'mail_desktop_notifications' => ['required', 'boolean'],
            'mail_sound_notifications' => ['required', 'boolean'],
        ]);

        $signatureHtml = EmailSignatureSanitizer::sanitize($data['mail_signature_html'] ?? null);

        $request->user()->update([
            'mail_signature_html' => $signatureHtml,
            'mail_signature_text' => EmailSignatureSanitizer::toPlainText($signatureHtml),
            'mail_in_app_notifications' => $data['mail_in_app_notifications'],
            'mail_desktop_notifications' => $data['mail_desktop_notifications'],
            'mail_sound_notifications' => $data['mail_sound_notifications'],
        ]);

        return back()->with('success', 'Preferencias de correo guardadas.');
    }

    public function alerts(Request $request): JsonResponse
    {
        $alerts = $request->user()
            ->mailAlerts()
            ->latest()
            ->take(6)
            ->get(['id', 'title', 'body', 'url', 'read_at', 'created_at']);

        return response()->json([
            'unread_count' => $request->user()->mailAlerts()->whereNull('read_at')->count(),
            'alerts' => $alerts,
        ]);
    }

    public function markAlertRead(Request $request, MailAlert $alert): JsonResponse
    {
        abort_unless($alert->user_id === $request->user()->id, 403);

        $alert->update(['read_at' => $alert->read_at ?: now()]);

        return response()->json(['ok' => true]);
    }

    public function markAllAlertsRead(Request $request): JsonResponse
    {
        $request->user()->mailAlerts()->whereNull('read_at')->update(['read_at' => now()]);

        return response()->json(['ok' => true]);
    }

    private function normalizedSubject(string $subject): string
    {
        return trim((string) preg_replace('/^(?:(?:re|fw|fwd)\s*:\s*)+/i', '', $subject)) ?: '(Sin asunto)';
    }

    private function preferences(Request $request): array
    {
        $user = $request->user();

        return [
            'mail_signature_html' => $user->mail_signature_html,
            'mail_signature_text' => $user->mail_signature_text,
            'mail_in_app_notifications' => (bool) $user->mail_in_app_notifications,
            'mail_desktop_notifications' => (bool) $user->mail_desktop_notifications,
            'mail_sound_notifications' => (bool) $user->mail_sound_notifications,
        ];
    }

    /** @param array<int, UploadedFile> $files */
    private function assertAttachmentTotalSize(array $files, int $existingBytes = 0): void
    {
        $total = $existingBytes + array_sum(array_map(fn (UploadedFile $file) => (int) $file->getSize(), $files));

        if ($total > 25 * 1024 * 1024) {
            throw ValidationException::withMessages([
                'attachments' => 'El total de archivos no puede superar 25 MB.',
            ]);
        }
    }

    /** @param array<int, UploadedFile> $files */
    private function storeUploadedAttachments(MailMessage $message, array $files): void
    {
        foreach ($files as $file) {
            $filename = $this->safeFilename($file->getClientOriginalName());
            $extension = pathinfo($filename, PATHINFO_EXTENSION);
            $storedName = (string) Str::uuid().($extension ? '.'.$extension : '');
            $path = Storage::disk('local')->putFileAs('mail-attachments/outbound/'.$message->id, $file, $storedName);

            $message->files()->create([
                'filename' => $filename,
                'content_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'content_disposition' => 'attachment',
                'storage_disk' => 'local',
                'storage_path' => $path,
                'checksum' => hash_file('sha256', $file->getRealPath()),
                'downloaded_at' => now(),
            ]);
        }
    }

    /** @param array<int, UploadedFile> $files */
    private function storeDraftAttachments(MailDraft $draft, array $files): void
    {
        foreach ($files as $file) {
            $filename = $this->safeFilename($file->getClientOriginalName());
            $extension = pathinfo($filename, PATHINFO_EXTENSION);
            $path = Storage::disk('local')->putFileAs(
                'mail-attachments/drafts/'.$draft->id,
                $file,
                Str::uuid().($extension ? '.'.$extension : ''),
            );

            $draft->files()->create([
                'filename' => $filename,
                'content_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'storage_disk' => 'local',
                'storage_path' => $path,
                'checksum' => hash_file('sha256', $file->getRealPath()),
            ]);
        }
    }

    private function draftAttachmentContent(MailDraftAttachment $attachment): string
    {
        if (! Storage::disk($attachment->storage_disk)->exists($attachment->storage_path)) {
            throw ValidationException::withMessages([
                'attachments' => "El adjunto {$attachment->filename} del borrador ya no está disponible.",
            ]);
        }

        return Storage::disk($attachment->storage_disk)->get($attachment->storage_path);
    }

    /** @param \Illuminate\Support\Collection<int, MailDraftAttachment> $attachments */
    private function transferDraftAttachments(MailMessage $message, $attachments): void
    {
        foreach ($attachments as $attachment) {
            $content = $this->draftAttachmentContent($attachment);
            $extension = pathinfo($attachment->filename, PATHINFO_EXTENSION);
            $path = 'mail-attachments/outbound/'.$message->id.'/'.Str::uuid().($extension ? '.'.$extension : '');
            Storage::disk('local')->put($path, $content);

            $message->files()->create([
                'filename' => $attachment->filename,
                'content_type' => $attachment->content_type,
                'size' => $attachment->size,
                'content_disposition' => 'attachment',
                'storage_disk' => 'local',
                'storage_path' => $path,
                'checksum' => $attachment->checksum,
                'downloaded_at' => now(),
            ]);
        }
    }

    private function discardDraft(?MailDraft $draft): void
    {
        if (! $draft) {
            return;
        }

        $draft->files()->each(function (MailDraftAttachment $attachment): void {
            Storage::disk($attachment->storage_disk)->delete($attachment->storage_path);
        });
        $draft->delete();
    }

    private function authorizeAttachmentAccess(Request $request, MailAttachment $attachment): void
    {
        abort_unless($attachment->message()->exists(), 404);
        abort_unless(app(MailboxAccess::class)->canReadThread($request->user(), $attachment->message->thread), 403);
    }

    private function safeFilename(string $filename): string
    {
        $filename = basename(str_replace(['\\', '/', "\r", "\n"], '_', $filename));
        $filename = preg_replace('/[^\pL\pN._() -]+/u', '_', $filename) ?: 'adjunto';

        return Str::limit($filename, 160, '');
    }
}
