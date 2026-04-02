<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = [
            [
                'category' => 'Compras y Pedidos',
                'items' => [
                    [
                        'question' => '¿Cómo puedo realizar una compra?',
                        'answer' => 'Navega por nuestro catálogo, agrega los productos al carrito y procede al checkout. Puedes comprar como invitado o creando una cuenta para hacer seguimiento de tus pedidos.',
                    ],
                    [
                        'question' => '¿Cuáles son los métodos de pago disponibles?',
                        'answer' => 'Aceptamos pagos a través de MercadoPago, que incluye tarjetas de crédito, débito y transferencia bancaria.',
                    ],
                    [
                        'question' => '¿Puedo solicitar una cotización antes de comprar?',
                        'answer' => 'Sí, puedes solicitar cotizaciones desde tu panel de cliente para pedidos especiales o volúmenes grandes.',
                    ],
                    [
                        'question' => '¿Ofrecen descuentos por volumen?',
                        'answer' => 'Sí, muchos de nuestros productos tienen precios escalonados por cantidad. Puedes ver los tiers de precios en la página de cada producto.',
                    ],
                ],
            ],
            [
                'category' => 'Envíos y Logística',
                'items' => [
                    [
                        'question' => '¿A qué regiones realizan envíos?',
                        'answer' => 'Realizamos envíos a todo Chile. Las tarifas varían según la región y se calculan automáticamente en el checkout.',
                    ],
                    [
                        'question' => '¿Cuánto demora el envío?',
                        'answer' => 'Los envíos dentro de la Región Metropolitana toman 1-3 días hábiles. Para regiones, entre 3-7 días hábiles dependiendo de la ubicación.',
                    ],
                    [
                        'question' => '¿Cómo puedo rastrear mi pedido?',
                        'answer' => 'Puedes rastrear tu pedido usando el número de orden en nuestra página de Seguimiento, o desde tu panel de cliente si tienes cuenta.',
                    ],
                ],
            ],
            [
                'category' => 'Garantía y Devoluciones',
                'items' => [
                    [
                        'question' => '¿Qué garantía tienen los productos?',
                        'answer' => 'Todos nuestros productos incluyen garantía. El período varía según el producto y se indica en la ficha técnica de cada uno.',
                    ],
                    [
                        'question' => '¿Cómo solicito una devolución o garantía?',
                        'answer' => 'Desde tu panel de cliente, ve a "Mis Pedidos" y selecciona "Solicitar Devolución". Nuestro equipo revisará tu solicitud en 24-48 horas hábiles.',
                    ],
                    [
                        'question' => '¿Cuál es la política de devoluciones?',
                        'answer' => 'Aceptamos devoluciones dentro de los 10 días desde la recepción del producto, siempre que esté en su empaque original y sin uso.',
                    ],
                ],
            ],
            [
                'category' => 'Cuenta y Soporte',
                'items' => [
                    [
                        'question' => '¿Necesito una cuenta para comprar?',
                        'answer' => 'No, puedes comprar como invitado. Sin embargo, con una cuenta puedes rastrear pedidos, solicitar cotizaciones y acceder a tu historial de compras.',
                    ],
                    [
                        'question' => '¿Cómo contacto al soporte técnico?',
                        'answer' => 'Puedes contactarnos a través de WhatsApp, el formulario de contacto en nuestra web, o escribiéndonos directamente a nuestro email.',
                    ],
                    [
                        'question' => '¿Ofrecen asesoría técnica?',
                        'answer' => 'Sí, nuestro equipo técnico puede asesorarte en la selección de equipos y componentes según tus necesidades específicas.',
                    ],
                ],
            ],
        ];

        return Inertia::render('Faq', ['faqs' => $faqs]);
    }
}
