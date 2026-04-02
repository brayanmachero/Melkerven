<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background: #0b1120; color: #e2e8f0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 40px; }
        .logo { text-align: center; margin-bottom: 30px; }
        h1 { color: #0ea5e9; font-size: 24px; margin-bottom: 10px; }
        .item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .btn { display: inline-block; background: #0ea5e9; color: #fff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; margin-top: 20px; }
        .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="{{ asset('images/logo-light.png') }}" alt="Melkerven" style="height: 40px;">
        </div>
        <h1>¡No olvides tu carrito!</h1>
        <p>Hola {{ $abandonedCart->user->name }},</p>
        <p>Notamos que dejaste productos en tu carrito. Aquí tienes un recordatorio:</p>

        @foreach($abandonedCart->cart_items as $item)
            <div class="item">
                <span>{{ $item['name'] }} (x{{ $item['quantity'] }})</span>
                <span>${{ number_format($item['price'] * $item['quantity'], 0, ',', '.') }}</span>
            </div>
        @endforeach

        <div style="text-align: center;">
            <a href="{{ url('/cart') }}" class="btn">Completar mi Compra</a>
        </div>

        <div class="footer">
            <p>Melkerven - Servers, Networking & Storage Hardware</p>
        </div>
    </div>
</body>
</html>
