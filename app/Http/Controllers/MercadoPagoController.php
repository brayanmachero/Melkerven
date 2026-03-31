<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Mail\OrderPaid;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Exceptions\MPApiException;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class MercadoPagoController extends Controller
{
    public function __construct()
    {
        MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));
    }

    public function initiate(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_rut' => 'required|string|max:15',
            'shipping_rate_id' => 'required|integer',
            'shipping_commune' => 'required|string|max:255',
            'shipping_address' => 'required|string|max:255',
            'document_type' => 'required|in:boleta,factura',
            'business_name' => 'required_if:document_type,factura|nullable|string|max:255',
            'business_rut' => 'required_if:document_type,factura|nullable|string|max:15',
            'business_giro' => 'required_if:document_type,factura|nullable|string|max:255',
            'business_address' => 'required_if:document_type,factura|nullable|string|max:255',
            'create_account' => 'nullable|boolean',
            'password' => 'required_if:create_account,true|nullable|string|min:8|confirmed',
        ]);

        // Auto-register user if requested and not already logged in
        if (!auth()->check() && $request->boolean('create_account') && $request->filled('password')) {
            // Check if email already exists
            $existingUser = User::where('email', $request->customer_email)->first();
            if ($existingUser) {
                return back()->withErrors(['customer_email' => 'Este email ya tiene una cuenta registrada. Inicia sesión o usa otro email.']);
            }

            $user = User::create([
                'name' => $request->customer_name,
                'email' => $request->customer_email,
                'password' => Hash::make($request->password),
                'phone' => $request->customer_phone,
                'rut' => $request->customer_rut,
            ]);
            Auth::login($user);
        }

        $cart = session()->get('cart', []);
        if (empty($cart)) {
            return back()->with('error', 'El carrito está vacío.');
        }

        // Validate stock availability
        foreach ($cart as $item) {
            $product = Product::find($item['id']);
            if (!$product || $product->stock < $item['quantity']) {
                return back()->with('error', "Stock insuficiente para '{$item['name']}'. Disponible: " . ($product->stock ?? 0));
            }
        }

        // Calculate totals
        $netAmount = 0;
        foreach ($cart as $item) {
            $netAmount += $item['price'] * $item['quantity'];
        }
        $taxAmount = round($netAmount * 0.19);
        $shippingRate = \App\Models\ShippingRate::find($request->shipping_rate_id);
        $shippingAmount = $shippingRate ? (int) $shippingRate->base_cost : 0;
        $totalAmount = $netAmount + $taxAmount + $shippingAmount;

        $buyOrder = 'ORD-' . time() . '-' . random_int(100, 999);

        // Create Order
        $order = Order::create([
            'user_id' => auth()->id(),
            'status' => 'pending',
            'document_type' => $request->document_type,
            'net_amount' => $netAmount,
            'tax_amount' => $taxAmount,
            'shipping_amount' => $shippingAmount,
            'total_amount' => $totalAmount,
            'customer_name' => $request->customer_name,
            'customer_rut' => $request->customer_rut,
            'customer_email' => $request->customer_email,
            'customer_phone' => $request->customer_phone,
            'shipping_rate_id' => $request->shipping_rate_id,
            'shipping_commune' => $request->shipping_commune,
            'shipping_address' => $request->shipping_address,
            'business_name' => $request->business_name,
            'business_rut' => $request->business_rut,
            'business_giro' => $request->business_giro,
            'business_address' => $request->business_address,
            'buy_order' => $buyOrder,
        ]);

        foreach ($cart as $item) {
            $order->items()->create([
                'product_id' => $item['id'],
                'product_name' => $item['name'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        }

        // Build MercadoPago preference items
        $mpItems = [];
        foreach ($cart as $item) {
            $mpItems[] = [
                'title' => $item['name'],
                'quantity' => (int) $item['quantity'],
                'unit_price' => (float) $item['price'],
                'currency_id' => 'CLP',
            ];
        }

        // Add IVA as separate item
        $mpItems[] = [
            'title' => 'IVA (19%)',
            'quantity' => 1,
            'unit_price' => (float) $taxAmount,
            'currency_id' => 'CLP',
        ];

        // Add shipping as separate item if applicable
        if ($shippingAmount > 0) {
            $mpItems[] = [
                'title' => 'Envío - ' . ($shippingRate->region_name ?? 'Despacho'),
                'quantity' => 1,
                'unit_price' => (float) $shippingAmount,
                'currency_id' => 'CLP',
            ];
        }

        try {
            $client = new PreferenceClient();

            $preference = $client->create([
                'items' => $mpItems,
                'back_urls' => [
                    'success' => route('mercadopago.success', ['order' => $order->id]),
                    'failure' => route('mercadopago.failure', ['order' => $order->id]),
                    'pending' => route('mercadopago.pending', ['order' => $order->id]),
                ],
                'external_reference' => $order->buy_order,
                'payer' => [
                    'first_name' => explode(' ', trim($request->customer_name))[0],
                    'last_name' => implode(' ', array_slice(explode(' ', trim($request->customer_name)), 1)) ?: '-',
                    'email' => $request->customer_email,
                ],
                'statement_descriptor' => 'MELKERVEN',
            ]);

            $order->update(['webpay_token' => $preference->id]);

            // Redirect to MercadoPago checkout
            $checkoutUrl = config('services.mercadopago.sandbox')
                ? $preference->sandbox_init_point
                : $preference->init_point;

            return Inertia::location($checkoutUrl);
        } catch (MPApiException $e) {
            $apiResponse = $e->getApiResponse();
            $statusCode = $apiResponse->getStatusCode();
            $content = $apiResponse->getContent(); // returns array
            logger()->error('MercadoPago API error', [
                'status_code' => $statusCode,
                'response' => $content,
                'message' => $e->getMessage(),
            ]);
            $errorMsg = isset($content['message']) ? $content['message'] : json_encode($content);
            return back()->with('error', "Error MercadoPago [{$statusCode}]: {$errorMsg}");
        } catch (\Exception $e) {
            logger()->error('MercadoPago general error: ' . $e->getMessage() . ' | ' . get_class($e));
            return back()->with('error', 'Error al iniciar el pago: ' . $e->getMessage());
        }
    }

    public function success(Request $request, Order $order)
    {
        // Verify the payment belongs to this order
        $paymentId = $request->input('payment_id');
        $status = $request->input('status');
        $externalReference = $request->input('external_reference');

        if ($externalReference !== $order->buy_order) {
            return redirect()->route('cart.index')->with('error', 'Referencia de pago inválida.');
        }

        if ($status === 'approved' && $order->status !== 'paid') {
            $order->update([
                'status' => 'paid',
                'payment_id' => $paymentId,
            ]);

            // Reduce stock
            foreach ($order->items as $item) {
                if ($item->product_id) {
                    Product::where('id', $item->product_id)
                        ->where('stock', '>=', $item->quantity)
                        ->decrement('stock', $item->quantity);
                }
            }

            // Send confirmation email
            try {
                Mail::to($order->customer_email)->send(new OrderPaid($order));
            } catch (\Exception $e) {
                logger()->error('Error sending order email: ' . $e->getMessage());
            }

            session()->forget('cart');
            return redirect()->route('catalog')->with('success', '¡Pago realizado con éxito! Orden #' . $order->id);
        }

        return redirect()->route('cart.index')->with('error', 'El pago no fue aprobado.');
    }

    public function failure(Request $request, Order $order)
    {
        if ($order->status === 'pending') {
            $order->update(['status' => 'failed']);
        }

        return redirect()->route('cart.index')->with('error', 'El pago fue rechazado o cancelado.');
    }

    public function pending(Request $request, Order $order)
    {
        $paymentId = $request->input('payment_id');
        $order->update(['payment_id' => $paymentId]);

        return redirect()->route('catalog')->with('success', 'Tu pago está pendiente de confirmación. Orden #' . $order->id);
    }

    public function webhook(Request $request)
    {
        // Verify webhook signature if configured
        $secret = config('services.mercadopago.webhook_secret');
        if ($secret) {
            $xSignature = $request->header('x-signature');
            $xRequestId = $request->header('x-request-id');
            if ($xSignature) {
                $parts = [];
                foreach (explode(',', $xSignature) as $part) {
                    $kv = explode('=', trim($part), 2);
                    if (count($kv) === 2) {
                        $parts[$kv[0]] = $kv[1];
                    }
                }
                $ts = $parts['ts'] ?? '';
                $hash = $parts['v1'] ?? '';
                $dataId = $request->input('data.id', '');
                $manifest = "id:{$dataId};request-id:{$xRequestId};ts:{$ts};";
                $computedHash = hash_hmac('sha256', $manifest, $secret);
                if (!hash_equals($computedHash, $hash)) {
                    return response()->json(['error' => 'Invalid signature'], 403);
                }
            }
        }

        $type = $request->input('type');

        if ($type === 'payment') {
            $paymentId = $request->input('data.id');

            try {
                $paymentClient = new \MercadoPago\Client\Payment\PaymentClient();
                $payment = $paymentClient->get($paymentId);

                $order = Order::where('buy_order', $payment->external_reference)->first();
                if (!$order) {
                    return response()->json(['status' => 'order_not_found'], 200);
                }

                if ($payment->status === 'approved' && $order->status !== 'paid') {
                    $order->update([
                        'status' => 'paid',
                        'payment_id' => (string) $paymentId,
                    ]);

                    foreach ($order->items as $item) {
                        if ($item->product_id) {
                            Product::where('id', $item->product_id)
                                ->where('stock', '>=', $item->quantity)
                                ->decrement('stock', $item->quantity);
                        }
                    }

                    try {
                        Mail::to($order->customer_email)->send(new OrderPaid($order));
                    } catch (\Exception $e) {
                        logger()->error('Webhook email error: ' . $e->getMessage());
                    }
                } elseif (in_array($payment->status, ['rejected', 'cancelled'])) {
                    if ($order->status === 'pending') {
                        $order->update(['status' => 'failed']);
                    }
                }
            } catch (\Exception $e) {
                logger()->error('Webhook processing error: ' . $e->getMessage());
            }
        }

        return response()->json(['status' => 'ok'], 200);
    }
}
