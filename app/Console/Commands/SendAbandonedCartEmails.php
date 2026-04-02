<?php

namespace App\Console\Commands;

use App\Mail\AbandonedCartReminder;
use App\Models\AbandonedCart;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendAbandonedCartEmails extends Command
{
    protected $signature = 'cart:send-abandoned-emails';
    protected $description = 'Send reminder emails for abandoned carts older than 2 hours';

    public function handle()
    {
        $carts = AbandonedCart::with('user')
            ->where('email_sent', false)
            ->where('last_activity_at', '<', now()->subHours(2))
            ->get();

        $count = 0;
        foreach ($carts as $cart) {
            if ($cart->user && $cart->user->email) {
                Mail::to($cart->user->email)->send(new AbandonedCartReminder($cart));
                $cart->update(['email_sent' => true]);
                $count++;
            }
        }

        $this->info("Sent {$count} abandoned cart emails.");
    }
}
