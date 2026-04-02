<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Order;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $user = $request->user();

        // Check if already reviewed
        $exists = Review::where('product_id', $validated['product_id'])
            ->where('user_id', $user->id)
            ->exists();

        if ($exists) {
            return back()->with('error', 'Ya has dejado una reseña para este producto.');
        }

        // Check if user bought the product
        $hasPurchased = Order::where('user_id', $user->id)
            ->where('status', 'paid')
            ->whereHas('items', function ($q) use ($validated) {
                $q->where('product_id', $validated['product_id']);
            })
            ->exists();

        Review::create([
            'product_id' => $validated['product_id'],
            'user_id' => $user->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'is_approved' => $hasPurchased, // Auto-approve verified purchases
        ]);

        return back()->with('success', $hasPurchased
            ? '¡Gracias por tu reseña!'
            : 'Tu reseña ha sido enviada y será revisada por nuestro equipo.');
    }
}
