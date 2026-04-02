<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class LowStockAlert extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Collection $products)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "⚠️ Alerta: {$this->products->count()} productos con stock bajo",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.low-stock-alert',
        );
    }
}
