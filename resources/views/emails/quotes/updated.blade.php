<x-mail::message>
    # Actualización de Solicitud de Precio #COT-{{ str_pad($quote->id, 5, '0', STR_PAD_LEFT) }}

    Estimado(a) **{{ $quote->customer_name }}**,

    Le informamos que el estado de su solicitud de hardware crítico ha sido actualizado por nuestra división de
    operaciones a:

    **<span style="color: #0ea5e9; font-size: 1.25rem;">{{ strtoupper($quote->status) }}</span>**

    @if($quote->status === 'quoted')
        Nuestros ingenieros han valorizado los componentes solicitados. Por favor, revise el detalle para poder proceder con
        la adquisición.
    @elseif($quote->status === 'accepted')
        Su solicitud ha sido aceptada y comenzaremos con los procesos de suministro correspondientes.
    @elseif($quote->status === 'reviewing')
        Nuestro equipo técnico está buscando activamente los mejores proveedores para sus componentes críticos.
    @endif

    <x-mail::button :url="config('app.url') . '/my-quotes'">
        Acceder a mi Portal
    </x-mail::button>

    Gracias por confiar en infraestructura de nivel industrial con nosotros.

    Atentamente,<br>
    **Melkerven High-Tech Supply**
</x-mail::message>