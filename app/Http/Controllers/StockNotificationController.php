<?php

namespace App\Http\Controllers;

use App\Models\StockNotification;
use Illuminate\Http\Request;

class StockNotificationController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'email' => 'required|email|max:255',
        ]);

        StockNotification::firstOrCreate([
            'product_id' => $request->product_id,
            'email' => $request->email,
        ]);

        return back()->with('success', 'Te notificaremos cuando haya stock disponible.');
    }
}
