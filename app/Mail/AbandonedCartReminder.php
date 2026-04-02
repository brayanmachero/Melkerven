<?php

namespace App\Mail;

use App\Models\AbandonedCart;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AbandonedCartReminder extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public AbandonedCart $abandonedCart)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Tienes productos esperándote en Melkerven',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.abandoned-cart',
        );
    }
}
