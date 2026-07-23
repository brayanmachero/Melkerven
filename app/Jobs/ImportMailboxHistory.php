<?php

namespace App\Jobs;

use App\Models\MailAccount;
use App\Services\MailboxImapSynchronizer;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

class ImportMailboxHistory implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $timeout = 270;

    public int $backoff = 10;

    public function __construct(public readonly int $mailAccountId)
    {
    }

    public function handle(MailboxImapSynchronizer $sync): void
    {
        $account = MailAccount::find($this->mailAccountId);

        if (! $account || $account->history_import_status === 'completed') {
            return;
        }

        $hasMore = $sync->importNextHistoryPage($account);

        if ($hasMore) {
            self::dispatch($account->id)->delay(now()->addSeconds(2));
        }
    }

    public function failed(Throwable $exception): void
    {
        MailAccount::whereKey($this->mailAccountId)->update([
            'history_import_status' => 'failed',
            'history_import_error' => $exception->getMessage(),
        ]);
    }
}
