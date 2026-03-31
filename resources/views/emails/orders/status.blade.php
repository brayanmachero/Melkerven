<x-mail::message>
    # Actualización de Adquisición #ORD-{{ str_pad($order->id, 5, '0', STR_PAD_LEFT) }}

    Estimado(a) **{{ $order->customer_name }}**,

    Le informamos que el estado de su orden en Melkerven ha sido actualizado.

    Estado Actual: **<span style="color: #0ea5e9; font-size: 1.25rem;">{{ strtoupper($order->status) }}</span>**

    @if($order->status === 'shipped')
        Su pedido de hardware crítico ha sido despachado a la dirección: **{{ $order->shipping_address }},
        {{ $order->shipping_commune }}**. Pronto recibirá información adicional del transportista para realizar el
        seguimiento de su entrega.
    @elseif($order->status === 'delivered')
        Su pedido ha sido notificado como **Entregado**. Esperamos que los componentes suministrados excedan sus
        expectativas operativas.
    @elseif($order->status === 'failed')
        Lamentamos informarle que hemos detectado un problema con el suministro o el pago de su orden. Nuestro soporte
        técnico lo contactará a la brevedad.
    @endif

    <x-mail::button :url="config('app.url') . '/my-orders/' . $order->id">
        Ver Detalles de la Orden
    </x-mail::button>

    Para cualquier consulta logística o técnica, no dude en contactar a nuestro equipo de soporte especializado.

    Atentamente,<br>
    **Melkerven High-Tech Supply**
</x-mail::message>