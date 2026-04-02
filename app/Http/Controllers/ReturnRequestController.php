<?php

namespace App\Http\Controllers;

use App\Models\ReturnRequest;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReturnRequestController extends Controller
{
    public function index(Request $request)
    {
        $returns = ReturnRequest::where('user_id', $request->user()->id)
            ->with(['order', 'orderItem'])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Client/Returns/Index', [
            'returns' => $returns,
        ]);
    }

    public function create(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->where('status', 'paid')
            ->with('items.product')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Client/Returns/Create', [
            'orders' => $orders,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'order_item_id' => 'nullable|exists:order_items,id',
            'type' => 'required|in:return,warranty',
            'reason' => 'required|string|max:2000',
        ]);

        // Verify the order belongs to this user
        $order = Order::where('id', $validated['order_id'])
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        ReturnRequest::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => 'pending',
        ]);

        return redirect()->route('returns.index')
            ->with('success', 'Solicitud enviada. Te notificaremos cuando sea revisada.');
    }
}
