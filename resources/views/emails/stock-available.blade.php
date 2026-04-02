<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background: #0b1120; color: #e2e8f0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 40px; }
        .logo { text-align: center; margin-bottom: 30px; }
        h1 { color: #0ea5e9; font-size: 24px; margin-bottom: 10px; }
        .product-card { background: #0f172a; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
        .product-name { font-size: 18px; font-weight: bold; color: #fff; margin-bottom: 8px; }
        .product-price { font-size: 24px; color: #0ea5e9; font-weight: bold; }
        .btn { display: inline-block; background: #0ea5e9; color: #fff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; margin-top: 16px; }
        .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="{{ asset('images/logo-light.png') }}" alt="Melkerven" style="height: 40px;">
        </div>
        <h1>¡Producto disponible!</h1>
        <p>Te informamos que el producto que estabas esperando ya tiene stock disponible:</p>

        <div class="product-card">
            @if($product->image)
                <img src="{{ asset('storage/' . $product->image) }}" alt="{{ $product->name }}" style="max-height: 120px; margin-bottom: 12px; border-radius: 8px;">
            @endif
            <div class="product-name">{{ $product->name }}</div>
            @if(!$product->is_quotable)
                <div class="product-price">${{ number_format($product->price, 0, ',', '.') }}</div>
            @endif
            <div style="color: #22c55e; font-size: 14px; margin-top: 8px;">✓ {{ $product->stock }} unidades disponibles</div>
        </div>

        <div style="text-align: center;">
            <a href="{{ url('/catalog/' . $product->slug) }}" class="btn">Ver Producto</a>
        </div>

        <div class="footer">
            <p>Recibiste este email porque te suscribiste a una notificación de stock en Melkerven.</p>
            <p>Melkerven - Servers, Networking & Storage Hardware</p>
        </div>
    </div>
</body>
</html>
