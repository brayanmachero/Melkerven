<?php

namespace App\Console\Commands;

use App\Models\MailAccount;
use App\Services\MailboxImapClientFactory;
use Illuminate\Console\Command;
use Throwable;

class TestMailboxImapConnection extends Command
{
    protected $signature = 'mailbox:imap-test {mailbox : ID o dirección del buzón}';

    protected $description = 'Comprueba una conexión IMAP sin importar ni modificar mensajes';

    public function handle(MailboxImapClientFactory $imap): int
    {
        $identifier = (string) $this->argument('mailbox');
        $account = MailAccount::query()
            ->whereKey($identifier)
            ->orWhere('address', $identifier)
            ->first();

        if (! $account) {
            $this->components->error('No se encontró el buzón indicado.');

            return self::FAILURE;
        }

        if (! $account->is_active) {
            $this->components->error('El buzón está desactivado.');

            return self::FAILURE;
        }

        try {
            $folders = $imap->test($account);
            $this->components->info(sprintf('Conexión IMAP correcta para %s.', $account->address));
            $this->table(['Carpetas disponibles'], array_map(fn (string $folder) => [$folder], $folders));

            return self::SUCCESS;
        } catch (Throwable $exception) {
            report($exception);
            $account->update(['last_sync_error' => $exception->getMessage()]);
            $this->components->error('No fue posible conectar por IMAP. Revisa host, puerto, TLS y credenciales.');

            return self::FAILURE;
        }
    }
}
