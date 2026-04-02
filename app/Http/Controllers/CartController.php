<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ShippingRate;
use App\Models\AbandonedCart;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cart = session()->get('cart', []);
        $shippingRates = ShippingRate::where('allow_shipping', true)->get();

        // Sync cart prices with DB and check stock
        $warnings = [];
        foreach ($cart as $id => &$item) {
            $product = Product::find($id);
            if (!$product || !$product->is_active) {
                unset($cart[$id]);
                $warnings[] = "'{$item['name']}' ya no está disponible.";
                continue;
            }
            $item['price'] = $product->price;
            $item['image'] = $product->image_url;
            $item['stock'] = $product->stock;
            if ($item['quantity'] > $product->stock) {
                $item['quantity'] = max($product->stock, 1);
                $warnings[] = "Se ajustó la cantidad de '{$item['name']}' al stock disponible ({$product->stock}).";
            }
        }
        unset($item);
        session()->put('cart', $cart);

        $subtotal = 0;
        foreach ($cart as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }

        return Inertia::render('Cart', [
            'cart' => $cart,
            'subtotal' => $subtotal,
            'shippingRates' => $shippingRates,
            'warnings' => $warnings,
        ]);
    }

    public function add(Request $request, Product $product)
    {
        if ($product->is_quotable || $product->price == 0) {
            return redirect()->back()->with('error', 'Este producto requiere cotización directa.');
        }

        if (!$product->is_active) {
            return redirect()->back()->with('error', 'Este producto no está disponible.');
        }

        $quantity = max(1, (int) $request->input('quantity', 1));
        $cart = session()->get('cart', []);
        $currentInCart = isset($cart[$product->id]) ? $cart[$product->id]['quantity'] : 0;

        if (($currentInCart + $quantity) > $product->stock) {
            return redirect()->back()->with('error', "Stock insuficiente. Disponible: {$product->stock}, en carrito: {$currentInCart}.");
        }

        if (isset($cart[$product->id])) {
            $cart[$product->id]['quantity'] += $quantity;
        } else {
            $cart[$product->id] = [
                "id" => $product->id,
                "name" => $product->name,
                "quantity" => $quantity,
                "price" => $product->price,
                "image" => $product->image_url,
                "slug" => $product->slug,
                "stock" => $product->stock,
            ];
        }

        session()->put('cart', $cart);

        // Track abandoned cart for logged-in users
        if (auth()->check()) {
            try {
                AbandonedCart::updateOrCreate(
                    ['user_id' => auth()->id()],
                    ['cart_items' => array_values($cart), 'last_activity_at' => now(), 'email_sent' => false]
                );
            } catch (\Exception $e) {}
        }

        return redirect()->back()->with('success', 'Producto añadido al carrito.');
    }

    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = session()->get('cart', []);
        $id = $request->id;

        if (!isset($cart[$id])) {
            return redirect()->back()->with('error', 'Producto no encontrado en el carrito.');
        }

        $product = Product::find($id);
        if ($product && $request->quantity > $product->stock) {
            return redirect()->back()->with('error', "Stock máximo disponible: {$product->stock}.");
        }

        $cart[$id]["quantity"] = $request->quantity;
        session()->put('cart', $cart);
        return redirect()->back()->with('success', 'Carrito actualizado.');
    }

    public function remove(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
        ]);

        $cart = session()->get('cart', []);
        if (isset($cart[$request->id])) {
            unset($cart[$request->id]);
            session()->put('cart', $cart);
        }
        return redirect()->back()->with('success', 'Producto removido del carrito.');
    }

    public function applyCoupon(Request $request)
    {
        $request->validate(['code' => 'required|string', 'subtotal' => 'required|numeric']);

        try {
            $coupon = \App\Models\Coupon::where('code', strtoupper($request->code))
                ->where('is_active', true)
                ->first();
        } catch (\Exception $e) {
            return response()->json(['valid' => false, 'message' => 'Sistema de cupones no disponible.']);
        }

        if (!$coupon) {
            return response()->json(['valid' => false, 'message' => 'Cupón no encontrado o inactivo.']);
        }

        if ($coupon->expires_at && $coupon->expires_at->isPast()) {
            return response()->json(['valid' => false, 'message' => 'Este cupón ha expirado.']);
        }

        if ($coupon->max_uses && $coupon->used_count >= $coupon->max_uses) {
            return response()->json(['valid' => false, 'message' => 'Este cupón ha alcanzado su límite de usos.']);
        }

        if ($coupon->min_amount && $request->subtotal < $coupon->min_amount) {
            return response()->json([
                'valid' => false,
                'message' => 'Compra mínima de $' . number_format($coupon->min_amount, 0, ',', '.') . ' requerida.',
            ]);
        }

        $discount = $coupon->type === 'percentage'
            ? round($request->subtotal * ($coupon->value / 100))
            : min($coupon->value, $request->subtotal);

        return response()->json([
            'valid' => true,
            'code' => $coupon->code,
            'type' => $coupon->type,
            'value' => $coupon->value,
            'discount' => $discount,
        ]);
    }
}
