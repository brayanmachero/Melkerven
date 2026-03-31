<x-mail::message>
    # Confirmación de Orden #ORD-{{ str_pad($order->id, 5, '0', STR_PAD_LEFT) }}

    Estimado(a) **{{ $order->customer_name }}**,

    Le informamos que su pago ha sido procesado exitosamente. Hemos reservado su hardware y estamos preparando el
    despacho a la dirección: **{{ $order->shipping_address }}, {{ $order->shipping_commune }}**.

    <x-mail::panel>
        ### Resumen de la Transacción:
        - **Monto Total:** ${{ number_format($order->total_amount, 0, ',', '.') }}
        - **Tipo de Documento:** {{ strtoupper($order->document_type) }}
        - **Fecha:** {{ $order->created_at->format('d/m/Y H:i') }}
    </x-mail::panel>

    ### Ítems Adquiridos:
    @foreach($order->items as $item)
        - **{{ $item->product_name }}** (x{{ $item->quantity }}) - ${{ number_format($item->price, 0, ',', '.') }} c/u
    @endforeach

    <x-mail::button :url="config('app.url') . '/my-orders/' . $order->id">
        Ver Estado del Pedido
    </x-mail::button>

    Si tiene dudas técnicas, responda a este correo o contacte a nuestra división de soporte.

    Atentamente,<br>
    **Melkerven High-Tech Supply**
</x-mail::message>