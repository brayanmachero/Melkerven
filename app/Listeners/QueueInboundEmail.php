<?php

namespace App\Listeners;

use App\Jobs\ProcessInboundEmail;
use Illuminate\Support\Facades\Log;
use Resend\Laravel\Events\EmailReceived;

class QueueInboundEmail
{
    public function handle(EmailReceived $event): void
    {
        $emailId = data_get($event->payload, 'data.email_id');

        if (! is_string($emailId) || $emailId === '') {
            Log::warning('Resend inbound email webhook without an email identifier.', [
                'payload' => $event->payload,
            ]);

            return;
        }

        ProcessInboundEmail::dispatch($emailId);
    }
}
