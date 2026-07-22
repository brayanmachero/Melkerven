<?php

namespace App\Services;

use App\Models\MailAccount;
use App\Models\MailActivity;
use App\Models\MailDraft;
use App\Models\MailThread;
use App\Models\User;

class MailActivityLogger
{
    /** @param array<string, mixed> $metadata */
    public function record(
        string $action,
        ?User $actor = null,
        ?MailThread $thread = null,
        ?MailDraft $draft = null,
        ?MailAccount $account = null,
        array $metadata = [],
    ): void {
        MailActivity::create([
            'actor_id' => $actor?->id,
            'mail_thread_id' => $thread?->id,
            'mail_draft_id' => $draft?->id,
            'mail_account_id' => $account?->id ?? $thread?->mail_account_id ?? $draft?->mail_account_id,
            'action' => $action,
            'metadata' => $metadata ?: null,
        ]);
    }
}
