<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background: #0b1120; color: #e2e8f0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 40px; }
        .logo { text-align: center; margin-bottom: 30px; }
        h1 { color: #f59e0b; font-size: 24px; margin-bottom: 10px; }
        .product-row { display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .stock-badge { background: #ef4444; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: bold; }
        .btn { display: inline-block; background: #0ea5e9; color: #fff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; margin-top: 20px; }
        .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="{{ asset('images/logo-light.png') }}" alt="Melkerven" style="height: 40px;">
        </div>
        <h1>⚠️ Alerta de Stock Bajo</h1>
        <p>Los siguientes productos tienen stock bajo y requieren atención:</p>

        <div style="background: #0f172a; border-radius: 12px; overflow: hidden; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; padding: 12px 16px; background: rgba(255,255,255,0.05); font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; font-weight: bold;">
                <span>Producto</span>
                <span>Stock</span>
            </div>
            @foreach($products as $product)
                <div class="product-row">
                    <span style="color: #fff; font-size: 14px;">{{ $product->name }}</span>
                    <span class="stock-badge">{{ $product->stock }} uds</span>
                </div>
            @endforeach
        </div>

        <div style="text-align: center;">
            <a href="{{ url('/admin/products') }}" class="btn">Gestionar Productos</a>
        </div>

        <div class="footer">
            <p>Este es un email automático del sistema de alertas de Melkerven.</p>
        </div>
    </div>
</body>
</html>
