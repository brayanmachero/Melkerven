<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Original editorial content for the public resource center.
 * It is intentionally written as guidance, never as copied vendor or competitor text.
 */
class PublicContentSeeder extends Seeder
{
    public function run(): void
    {
        $author = User::query()->where('role', 'admin')->first() ?? User::query()->first();

        if (! $author) {
            $author = User::create([
                'name' => 'Equipo Melkerven',
                'email' => 'editorial@melkerven.net',
                'password' => Hash::make(Str::random(48)),
                'role' => 'admin',
            ]);
        }

        $posts = [
            [
                'title' => 'Checklist para cotizar un servidor empresarial sin sorpresas',
                'slug' => 'checklist-cotizar-servidor-empresarial',
                'category' => 'guias',
                'image_path' => 'images/catalog-server-reference.png',
                'tags' => ['servidores', 'virtualización', 'cotización'],
                'excerpt' => 'Antes de elegir un servidor, reúna la información que realmente define compatibilidad, rendimiento y continuidad operativa.',
                'content' => '<h2>Parta por la carga, no por la marca</h2><p>Una cotización sólida comienza con el uso real: cantidad de máquinas virtuales, bases de datos, aplicaciones, crecimiento esperado y ventana de mantención. Con ese contexto se puede decidir entre densidad, núcleos, memoria, almacenamiento y conectividad.</p><h2>Los seis datos que aceleran la propuesta</h2><ul><li>Aplicaciones y sistema operativo que alojará el servidor.</li><li>Memoria actual y crecimiento previsto.</li><li>Capacidad útil, tipo de discos y necesidad de SSD o NVMe.</li><li>Conectividad de red y velocidad de uplinks.</li><li>Espacio disponible en rack, energía y temperatura.</li><li>Requisito de garantía, soporte o continuidad.</li></ul><h2>Compatibilidad primero</h2><p>Procesadores, DIMM, controladoras, discos y GPU no se deben escoger de manera aislada. La plataforma, el firmware, la fuente de poder y los kits físicos pueden cambiar la viabilidad. Por eso una ficha de catálogo es el inicio de la conversación, no la confirmación final.</p><p>Al enviar estos datos, la comparación de alternativas resulta más rápida y la propuesta queda alineada con el entorno existente.</p>',
            ],
            [
                'title' => 'Capacidad no es lo mismo que rendimiento: cómo dimensionar almacenamiento',
                'slug' => 'dimensionar-almacenamiento-capacidad-rendimiento',
                'category' => 'almacenamiento',
                'image_path' => 'images/catalog-storage-reference.png',
                'tags' => ['storage', 'ssd', 'nas'],
                'excerpt' => 'Una buena decisión de almacenamiento considera IOPS, latencia, protección de datos y compatibilidad, además de terabytes.',
                'content' => '<h2>Defina el perfil de datos</h2><p>Archivos de oficina, máquinas virtuales, respaldos y bases de datos se comportan de forma distinta. Antes de comparar discos o cabinas, identifique cuánto dato se usa hoy, cuánto crece por año y qué porcentaje necesita acceso rápido.</p><h2>Capacidad útil y protección</h2><p>La capacidad publicada no equivale a capacidad usable. RAID, tolerancia a fallas, snapshots, replicación y espacio de reserva influyen en el resultado. El diseño debe calcularse con la política de protección que el negocio realmente requiere.</p><h2>Verifique el entorno físico y lógico</h2><p>En repuestos, no basta con coincidir en capacidad. Interfaz, formato, firmware, caddy, controladora y versión de software pueden ser determinantes. En una cabina nueva también deben definirse red, HBA, protocolos y el plan de respaldo.</p>',
            ],
            [
                'title' => '25G y 100G en data center: preguntas que conviene responder antes de crecer',
                'slug' => '25g-100g-data-center-preguntas-clave',
                'category' => 'redes',
                'image_path' => 'images/catalog-switch-reference.png',
                'tags' => ['networking', 'switching', 'data center'],
                'excerpt' => 'La velocidad del switch es solo una parte de una red de data center: ópticos, licencias, diseño y operación importan por igual.',
                'content' => '<h2>Comience por el tráfico</h2><p>La pregunta no es únicamente cuántos puertos se necesitan. Hay que entender este-oeste, norte-sur, respaldo, replicación, virtualización y posibles cargas de IA. Eso permite definir oversubscription, uplinks y crecimiento sin sobredimensionar.</p><h2>El puerto es un sistema</h2><p>Un puerto de 25G o 100G exige revisar transceptores, DAC, fibra, distancias, compatibilidad y firmware. También pueden existir licencias por capacidad o funcionalidades del sistema operativo de red.</p><h2>Diseñe para operar</h2><p>Una topología sana contempla redundancia, monitoreo, convenciones de cableado, ventanas de cambio y respaldo de configuración. Documentar estos elementos desde la cotización evita que la implementación dependa de supuestos.</p>',
            ],
            [
                'title' => 'Cinco señales de que su infraestructura ya necesita un plan de renovación',
                'slug' => 'senales-renovar-infraestructura-ti',
                'category' => 'operacion',
                'image_path' => 'images/catalog-server-reference.png',
                'tags' => ['renovación', 'operación', 'servidores'],
                'excerpt' => 'Esperar a que un equipo falle no es una estrategia de renovación. Estas señales ayudan a anticipar un proyecto con tiempo.',
                'content' => '<h2>La capacidad dejó de tener margen</h2><p>Si CPU, memoria, almacenamiento o puertos operan continuamente cerca de su límite, el crecimiento se vuelve frágil. Un plan debe mirar consumo actual y una proyección realista de los próximos ciclos.</p><h2>El soporte y los repuestos se vuelven inciertos</h2><p>Fin de soporte, firmware sin actualizaciones y repuestos difíciles de homologar elevan el riesgo. El costo de una detención suele superar el de planificar una transición ordenada.</p><h2>La operación se volvió compleja</h2><p>Cuando múltiples excepciones, adaptadores o equipos fuera de estándar dificultan los cambios, conviene revisar la arquitectura. Renovar también puede simplificar gestión, seguridad, consumo energético y documentación.</p>',
            ],
            [
                'title' => 'UPS para infraestructura TI: cómo estimar autonomía y continuidad',
                'slug' => 'ups-infraestructura-ti-autonomia-continuidad',
                'category' => 'continuidad',
                'image_path' => 'images/catalog-power-reference.png',
                'tags' => ['ups', 'energía', 'continuidad'],
                'excerpt' => 'Un UPS no se elige solo por VA. Potencia real, autonomía, distribución y monitoreo definen si protege la operación.',
                'content' => '<h2>Potencia, autonomía y tipo de carga</h2><p>El primer paso es levantar el consumo real de servidores, switches, almacenamiento y periféricos. A partir de esa carga se puede estimar margen, autonomía y necesidad de baterías externas.</p><h2>Planifique qué debe mantenerse encendido</h2><p>No toda la sala requiere la misma autonomía. Puede ser más eficiente priorizar red, almacenamiento o un conjunto de servicios para lograr un apagado seguro o mantener comunicaciones durante una contingencia.</p><h2>El UPS es parte de la operación</h2><p>La propuesta debe considerar bypass, formato rack o torre, tarjetas de gestión, alertas, mantenimiento de baterías y distribución mediante PDU. Sin monitoreo, la continuidad se descubre demasiado tarde.</p>',
            ],
            [
                'title' => 'Cómo validar un repuesto de servidor antes de comprarlo',
                'slug' => 'validar-repuesto-servidor-antes-de-comprar',
                'category' => 'guias',
                'image_path' => 'images/catalog-components-reference.png',
                'tags' => ['repuestos', 'compatibilidad', 'hardware'],
                'excerpt' => 'Una memoria, disco, NIC o GPU puede parecer equivalente y aun así no ser compatible con el servidor que debe reparar.',
                'content' => '<h2>Identifique el equipo y la pieza actual</h2><p>Modelo de servidor, service tag, part number, versión de BIOS o firmware y fotografías del componente reducen los errores. En almacenamiento, también es importante conocer controladora, caddy y perfil de disco.</p><h2>No confunda formato con homologación</h2><p>Dos componentes pueden compartir interfaz o capacidad y comportarse distinto por firmware, perfiles térmicos, codificación de fabricante o limitaciones de la plataforma. Esto es especialmente relevante en DIMM, SSD, GPU y tarjetas de red.</p><h2>Documente antes de intervenir</h2><p>Registre configuración, seriales, conexiones y versiones antes de cambiar una pieza. Así resulta más fácil volver atrás, comparar resultados y mantener una base técnica para futuras cotizaciones.</p>',
            ],
        ];

        foreach ($posts as $index => $post) {
            BlogPost::updateOrCreate(
                ['slug' => $post['slug']],
                [
                    ...$post,
                    'user_id' => $author->id,
                    'is_published' => true,
                    'published_at' => now()->subDays(18 - ($index * 3)),
                ],
            );
        }
    }
}
