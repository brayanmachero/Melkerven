<?php

namespace App\Console\Commands;

use App\Models\MailAccount;
use App\Services\MailboxImapSynchronizer;
use Illuminate\Console\Command;
use Throwable;

class SyncMailboxImap extends Command
{
    protected $signature = 'mailbox:imap-sync {mailbox : ID o dirección del buzón}';

    protected $description = 'Importa de forma segura la carpeta INBOX de un buzón IMAP';

    public function handle(MailboxImapSynchronizer $sync): int
    {
        $identifier = (string) $this->argument('mailbox');
        $account = MailAccount::query()->whereKey($identifier)->orWhere('address', $identifier)->first();

        if (! $account) {
            $this->components->error('No se encontró el buzón indicado.');

            return self::FAILURE;
        }

        if (! $account->usesImap()) {
            $this->components->warn('Este buzón recibe por Resend; no hay nada que sincronizar desde IMAP.');

            return self::SUCCESS;
        }

        try {
            $count = $sync->synchronizeInbox($account);
            $this->components->info("Sincronización terminada: {$count} mensajes nuevos importados.");

            return self::SUCCESS;
        } catch (Throwable $exception) {
            report($exception);
            $this->components->error('La sincronización IMAP falló. Revisa el detalle registrado para este buzón.');

            return self::FAILURE;
        }
    }
}
