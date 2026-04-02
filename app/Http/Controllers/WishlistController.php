<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function index()
    {
        $wishlistItems = Wishlist::with('product.category')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Client/Wishlist', [
            'wishlistItems' => $wishlistItems,
        ]);
    }

    public function toggle(Product $product)
    {
        $existing = Wishlist::where('user_id', auth()->id())
            ->where('product_id', $product->id)
            ->first();

        if ($existing) {
            $existing->delete();
            return back()->with('success', 'Producto removido de favoritos.');
        }

        Wishlist::create([
            'user_id' => auth()->id(),
            'product_id' => $product->id,
        ]);

        return back()->with('success', 'Producto agregado a favoritos.');
    }

    public function remove(Product $product)
    {
        Wishlist::where('user_id', auth()->id())
            ->where('product_id', $product->id)
            ->delete();

        return back()->with('success', 'Producto removido de favoritos.');
    }
}
