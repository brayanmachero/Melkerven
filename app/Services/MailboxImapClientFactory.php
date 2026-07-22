<?php

namespace App\Services;

use App\Models\MailAccount;
use LogicException;
use Webklex\PHPIMAP\Client;
use Webklex\PHPIMAP\ClientManager;

class MailboxImapClientFactory
{
    public function __construct(private readonly ClientManager $clients)
    {
    }

    /**
     * @return array<string, mixed>
     */
    public function configuration(MailAccount $account): array
    {
        if (! $account->hasIncomingConfiguration()) {
            throw new LogicException('El buzón no tiene una conexión IMAP completa.');
        }

        return [
            'host' => $account->incoming_host,
            'port' => $account->incoming_port,
            'protocol' => $account->incoming_protocol,
            'encryption' => $account->incoming_encryption,
            'validate_cert' => $account->incoming_validate_certificate,
            'username' => $account->incoming_username,
            'password' => $account->incoming_password,
            'authentication' => null,
            'timeout' => 30,
        ];
    }

    public function make(MailAccount $account): Client
    {
        return $this->clients->make($this->configuration($account));
    }

    /** @return array<int, string> */
    public function test(MailAccount $account): array
    {
        $client = $this->make($account);

        try {
            $client->connect();

            return $client->getFolders()->map(fn ($folder) => $folder->path)->values()->all();
        } finally {
            if ($client->isConnected()) {
                $client->disconnect();
            }
        }
    }
}
