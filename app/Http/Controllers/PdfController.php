<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Quote;
use Barryvdh\DomPDF\Facade\Pdf;

class PdfController extends Controller
{
    public function order(Order $order)
    {
        // Allow admin or order owner
        $user = auth()->user();
        if (!$user) abort(403);

        if (!$user->isAdmin() && $order->user_id !== $user->id) {
            abort(403);
        }

        $order->load('items.product', 'user');

        $pdf = Pdf::loadView('pdf.order', compact('order'))
            ->setPaper('letter');

        return $pdf->download("orden-{$order->order_number}.pdf");
    }

    public function quote(Quote $quote)
    {
        $user = auth()->user();
        if (!$user) abort(403);

        if (!$user->isAdmin() && $quote->user_id !== $user->id) {
            abort(403);
        }

        $quote->load('items.product', 'user');

        $pdf = Pdf::loadView('pdf.quote', compact('quote'))
            ->setPaper('letter');

        return $pdf->download("cotizacion-{$quote->id}.pdf");
    }
}
