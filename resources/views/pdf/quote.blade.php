<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Cotización #{{ $quote->id }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; color: #1e293b; line-height: 1.5; }
        .header { background: #0b1120; color: white; padding: 30px 40px; }
        .logo-text { font-size: 20px; font-weight: 700; letter-spacing: 4px; color: #0ea5e9; display: inline-block; }
        .header h1 { font-size: 24px; font-weight: 300; letter-spacing: 2px; float: right; margin-top: 5px; }
        .header::after { content: ''; display: table; clear: both; }
        .content { padding: 40px; }
        .info-grid { display: table; width: 100%; margin-bottom: 30px; }
        .info-col { display: table-cell; width: 50%; vertical-align: top; }
        .info-label { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; font-weight: 700; margin-bottom: 6px; }
        .info-value { font-size: 12px; color: #1e293b; margin-bottom: 4px; }
        table.items { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        table.items th { background: #f1f5f9; font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; font-weight: 700; padding: 10px 12px; text-align: left; border-bottom: 2px solid #e2e8f0; }
        table.items td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 11px; }
        .status { display: inline-block; padding: 3px 10px; border-radius: 4px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 9px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; }
        .note { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin-top: 20px; font-size: 11px; color: #475569; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-text">MELKERVEN</div>
        <h1>COTIZACIÓN</h1>
        <div style="clear: both; font-size: 8px; opacity: 0.5; letter-spacing: 2px; text-transform: uppercase;">Servers, Networking & Storage Hardware</div>
    </div>

    <div class="content">
        <div class="info-grid">
            <div class="info-col">
                <div class="info-label">Solicitante</div>
                <div class="info-value"><strong>{{ $quote->user?->name ?? 'Cliente' }}</strong></div>
                <div class="info-value">{{ $quote->user?->email ?? '-' }}</div>
            </div>
            <div class="info-col" style="text-align: right;">
                <div class="info-label">Detalles</div>
                <div class="info-value">Cotización #{{ $quote->id }}</div>
                <div class="info-value">Fecha: {{ $quote->created_at->format('d/m/Y') }}</div>
                <div class="info-value">Estado: {{ ucfirst($quote->status) }}</div>
            </div>
        </div>

        <table class="items">
            <thead>
                <tr>
                    <th style="width: 60%">Producto / Descripción</th>
                    <th>Cantidad</th>
                    @if($quote->items->contains(fn($i) => $i->price > 0))
                    <th style="text-align: right;">Precio Ref.</th>
                    @endif
                </tr>
            </thead>
            <tbody>
                @foreach($quote->items as $item)
                <tr>
                    <td>{{ $item->product?->name ?? $item->description ?? 'Item' }}</td>
                    <td>{{ $item->quantity }}</td>
                    @if($quote->items->contains(fn($i) => $i->price > 0))
                    <td style="text-align: right;">{{ $item->price > 0 ? '$' . number_format($item->price, 0, ',', '.') : 'A cotizar' }}</td>
                    @endif
                </tr>
                @endforeach
            </tbody>
        </table>

        @if($quote->notes)
        <div class="note">
            <div class="info-label" style="margin-bottom: 8px;">Notas del Cliente</div>
            {{ $quote->notes }}
        </div>
        @endif

        @if($quote->admin_notes)
        <div class="note" style="margin-top: 15px;">
            <div class="info-label" style="margin-bottom: 8px;">Respuesta de Melkerven</div>
            {{ $quote->admin_notes }}
        </div>
        @endif

        <div class="footer">
            Melkerven Chile &bull; Servers, Networking & Storage Hardware<br>
            Esta cotización es un documento referencial. Sujeto a confirmación y disponibilidad.
        </div>
    </div>
</body>
</html>
