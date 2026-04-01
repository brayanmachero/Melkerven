<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Orden #{{ $order->order_number }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; color: #1e293b; line-height: 1.5; }
        .header { background: #0b1120; color: white; padding: 30px 40px; display: flex; justify-content: space-between; }
        .header h1 { font-size: 24px; font-weight: 300; letter-spacing: 2px; }
        .header .order-num { font-size: 11px; opacity: 0.7; text-transform: uppercase; letter-spacing: 3px; margin-top: 4px; }
        .logo-text { font-size: 20px; font-weight: 700; letter-spacing: 4px; color: #0ea5e9; }
        .content { padding: 40px; }
        .info-grid { display: table; width: 100%; margin-bottom: 30px; }
        .info-col { display: table-cell; width: 50%; vertical-align: top; }
        .info-label { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; font-weight: 700; margin-bottom: 6px; }
        .info-value { font-size: 12px; color: #1e293b; margin-bottom: 4px; }
        table.items { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        table.items th { background: #f1f5f9; font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; font-weight: 700; padding: 10px 12px; text-align: left; border-bottom: 2px solid #e2e8f0; }
        table.items td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 11px; }
        table.items tr:last-child td { border-bottom: 2px solid #e2e8f0; }
        .totals { text-align: right; margin-top: 20px; }
        .totals .row { display: block; margin-bottom: 6px; }
        .totals .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; }
        .totals .value { font-size: 13px; font-weight: 600; color: #1e293b; }
        .totals .total-final { font-size: 18px; color: #0ea5e9; font-weight: 700; border-top: 2px solid #0ea5e9; padding-top: 8px; margin-top: 8px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 9px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; }
        .status { display: inline-block; padding: 3px 10px; border-radius: 4px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .status-paid { background: #dcfce7; color: #16a34a; }
        .status-pending { background: #fef3c7; color: #d97706; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="logo-text">MELKERVEN</div>
            <div style="font-size: 8px; opacity: 0.5; letter-spacing: 2px; text-transform: uppercase;">Servers, Networking & Storage Hardware</div>
        </div>
        <div style="text-align: right;">
            <h1>ORDEN DE COMPRA</h1>
            <div class="order-num">#{{ $order->order_number }}</div>
        </div>
    </div>

    <div class="content">
        <div class="info-grid">
            <div class="info-col">
                <div class="info-label">Datos del Cliente</div>
                <div class="info-value"><strong>{{ $order->user?->name ?? $order->guest_name ?? 'Invitado' }}</strong></div>
                <div class="info-value">{{ $order->user?->email ?? $order->guest_email ?? '-' }}</div>
                @if($order->guest_phone)
                    <div class="info-value">Tel: {{ $order->guest_phone }}</div>
                @endif
            </div>
            <div class="info-col" style="text-align: right;">
                <div class="info-label">Información de la Orden</div>
                <div class="info-value">Fecha: {{ $order->created_at->format('d/m/Y H:i') }}</div>
                <div class="info-value">Estado: <span class="status {{ $order->payment_status === 'paid' ? 'status-paid' : 'status-pending' }}">{{ $order->payment_status }}</span></div>
                @if($order->document_type)
                    <div class="info-value">Documento: {{ $order->document_type === 'boleta' ? 'Boleta' : 'Factura' }}</div>
                @endif
            </div>
        </div>

        @if($order->shipping_address)
        <div style="margin-bottom: 25px;">
            <div class="info-label">Dirección de Envío</div>
            <div class="info-value">{{ $order->shipping_address }}</div>
            @if($order->shipping_region)
                <div class="info-value">{{ $order->shipping_region }}</div>
            @endif
        </div>
        @endif

        <table class="items">
            <thead>
                <tr>
                    <th style="width: 50%">Producto</th>
                    <th>Cantidad</th>
                    <th style="text-align: right;">Precio Unit.</th>
                    <th style="text-align: right;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>{{ $item->product?->name ?? $item->product_name ?? 'Producto' }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td style="text-align: right;">${{ number_format($item->price, 0, ',', '.') }}</td>
                    <td style="text-align: right;">${{ number_format($item->subtotal, 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals">
            <div class="row">
                <span class="label">Subtotal: </span>
                <span class="value">${{ number_format($order->subtotal, 0, ',', '.') }}</span>
            </div>
            @if($order->shipping_cost > 0)
            <div class="row">
                <span class="label">Envío: </span>
                <span class="value">${{ number_format($order->shipping_cost, 0, ',', '.') }}</span>
            </div>
            @endif
            <div class="row">
                <span class="label">Total: </span>
                <span class="total-final">${{ number_format($order->total, 0, ',', '.') }} CLP</span>
            </div>
        </div>

        <div class="footer">
            Melkerven Chile &bull; Servers, Networking & Storage Hardware<br>
            Este documento es un comprobante de su orden de compra.
        </div>
    </div>
</body>
</html>
