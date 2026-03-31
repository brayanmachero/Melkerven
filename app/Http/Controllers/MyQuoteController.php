<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MyQuoteController extends Controller
{
    public function index(Request $request)
    {
        $quotes = Quote::where('user_id', auth()->id())
            ->with('items')
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('MyQuotes/Index', [
            'quotes' => $quotes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:50',
            'message' => 'nullable|string|max:5000',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string|max:500',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $quote = Quote::create([
            'user_id' => auth()->id(),
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'message' => $validated['message'] ?? null,
            'status' => 'pending',
        ]);

        foreach ($validated['items'] as $item) {
            $quote->items()->create([
                'description' => $item['description'],
                'quantity' => $item['quantity'],
            ]);
        }

        return redirect()->route('my-quotes.index')->with('success', 'Su cotización ha sido enviada. Le responderemos a la brevedad.');
    }
}
