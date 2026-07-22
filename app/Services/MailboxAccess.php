<?php

namespace App\Services;

use App\Models\MailAccount;
use App\Models\MailThread;
use App\Models\User;

class MailboxAccess
{
    public function canReadThread(User $user, MailThread $thread): bool
    {
        if (! $user->isAdmin()) {
            return false;
        }

        if (! $thread->mail_account_id) {
            return true;
        }

        return $user->mailAccounts()->whereKey($thread->mail_account_id)->exists();
    }

    public function canUseAccount(User $user, MailAccount $account, bool $sending = false): bool
    {
        if (! $user->isAdmin() || ! $account->is_active) {
            return false;
        }

        $membership = $user->mailAccounts()->whereKey($account)->first();

        return $membership !== null && (! $sending || $membership->pivot->can_send);
    }
}
