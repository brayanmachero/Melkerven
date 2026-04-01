<x-mail::message>
# Respuesta a su Consulta

Estimado(a) **{{ $contactMessage->name }}**,

Gracias por comunicarse con Melkerven. A continuación nuestra respuesta a su consulta:

**Su mensaje original:**
> {{ $contactMessage->message }}

---

**Nuestra respuesta:**

{{ $contactMessage->admin_reply }}

---

Si necesita información adicional, no dude en responder a este correo o contactarnos directamente.

<x-mail::button :url="config('app.url') . '/contact'">
Contactar Nuevamente
</x-mail::button>

Atentamente,<br>
**Melkerven High-Tech Supply**
</x-mail::message>
