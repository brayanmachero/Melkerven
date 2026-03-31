<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\QuoteStatusUpdated;
use Inertia\Inertia;

class QuoteController extends Controller
{
    public function index()
    {
        $quotes = Quote::with(['user', 'items'])
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('Admin/Quotes/Index', [
            'quotes' => $quotes,
        ]);
    }

    public function show(Quote $quote)
    {
        $quote->load(['user', 'items']);

        return Inertia::render('Admin/Quotes/Show', [
            'quote' => $quote,
        ]);
    }

    public function updateStatus(Request $request, Quote $quote)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,reviewing,quoted,accepted,rejected',
        ]);

        $oldStatus = $quote->status;
        $quote->update(['status' => $validated['status']]);

        if ($oldStatus !== $validated['status']) {
            try {
                Mail::to($quote->customer_email)->send(new QuoteStatusUpdated($quote));
            } catch (\Exception $e) {
                logger()->error('Error enviando correo de cotización: ' . $e->getMessage());
            }
        }

        return back()->with('success', 'Estado de cotización actualizado.');
    }
}
