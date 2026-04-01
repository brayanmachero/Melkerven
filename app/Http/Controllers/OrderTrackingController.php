<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderTrackingController extends Controller
{
    public function index()
    {
        return Inertia::render('OrderTracking');
    }

    public function track(Request $request)
    {
        $request->validate([
            'buy_order' => 'required|string|max:50',
            'email' => 'required|email|max:255',
        ]);

        $order = Order::where('buy_order', $request->buy_order)
            ->where('customer_email', $request->email)
            ->with('items')
            ->first();

        if (!$order) {
            return back()->with('error', 'No se encontró una orden con esos datos. Verifique el número de orden y el email.');
        }

        return Inertia::render('OrderTracking', [
            'order' => $order,
        ]);
    }
}
