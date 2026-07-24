<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

/**
 * A small, non-stock catalog to make technical quotations easier to start.
 *
 * Product details are condensed from official manufacturer data sheets. Each
 * record is explicitly quotable: it must never be interpreted as local stock.
 */
class ReferenceCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $categories = collect([
            ['name' => 'Servidores empresariales', 'slug' => 'servidores-empresariales', 'description' => 'Plataformas rack para cómputo, virtualización y cargas críticas.'],
            ['name' => 'Redes y conectividad', 'slug' => 'redes-conectividad', 'description' => 'Switching, enlaces y componentes de red para entornos empresariales.'],
            ['name' => 'Almacenamiento empresarial', 'slug' => 'almacenamiento-empresarial', 'description' => 'Unidades y componentes de capacidad para infraestructura crítica.'],
        ])->mapWithKeys(function (array $category) {
            $record = Category::updateOrCreate(['slug' => $category['slug']], $category);

            return [$category['slug'] => $record];
        });

        $products = [
            [
                'category' => 'servidores-empresariales',
                'name' => 'Dell PowerEdge R760',
                'slug' => 'dell-poweredge-r760',
                'description' => 'Servidor rack de dos sockets orientado a virtualización y crecimiento de infraestructura. La configuración final se define según procesador, memoria, discos y conectividad requeridos.',
                'specifications' => [
                    ['label' => 'Marca', 'value' => 'Dell Technologies'],
                    ['label' => 'Serie / modelo', 'value' => 'PowerEdge R760'],
                    ['label' => 'Formato', 'value' => 'Rack 2U'],
                    ['label' => 'Memoria', 'value' => '32 ranuras DDR5; hasta 8 TB según configuración'],
                    ['label' => 'Código de referencia', 'value' => 'POWEREDGE-R760'],
                    ['label' => 'Estado comercial', 'value' => 'Cotización y compatibilidad por confirmar'],
                ],
            ],
            [
                'category' => 'servidores-empresariales',
                'name' => 'Lenovo ThinkSystem SR650 V3',
                'slug' => 'lenovo-thinksystem-sr650-v3',
                'description' => 'Servidor rack configurable para virtualización, bases de datos y aplicaciones empresariales, con alternativas de almacenamiento, expansión y aceleración.',
                'specifications' => [
                    ['label' => 'Marca', 'value' => 'Lenovo'],
                    ['label' => 'Serie / modelo', 'value' => 'ThinkSystem SR650 V3'],
                    ['label' => 'Formato', 'value' => 'Rack 2U, dos sockets'],
                    ['label' => 'Procesamiento', 'value' => 'Hasta 2 Intel Xeon Scalable 4ª/5ª Gen; hasta 64 núcleos por socket'],
                    ['label' => 'Memoria', 'value' => 'Hasta 32 DIMM DDR5'],
                    ['label' => 'Código de referencia', 'value' => '7D75 / 7D76 / 7D77'],
                    ['label' => 'Estado comercial', 'value' => 'Cotización y compatibilidad por confirmar'],
                ],
            ],
            [
                'category' => 'servidores-empresariales',
                'name' => 'HPE ProLiant DL380 Gen11',
                'slug' => 'hpe-proliant-dl380-gen11',
                'description' => 'Plataforma rack escalable para cargas híbridas, consolidación y servicios de empresa. Se cotiza con la configuración de CPU, memoria, discos y soporte adecuada para cada proyecto.',
                'specifications' => [
                    ['label' => 'Marca', 'value' => 'HPE'],
                    ['label' => 'Serie / modelo', 'value' => 'ProLiant DL380 Gen11'],
                    ['label' => 'Formato', 'value' => 'Rack 2U, dos procesadores'],
                    ['label' => 'Procesamiento', 'value' => 'Intel Xeon Scalable 4ª/5ª Gen; hasta 64 núcleos'],
                    ['label' => 'Uso de referencia', 'value' => 'Cloud híbrida, virtualización y cargas empresariales'],
                    ['label' => 'Código de referencia', 'value' => 'DL380-G11'],
                    ['label' => 'Estado comercial', 'value' => 'Cotización y compatibilidad por confirmar'],
                ],
            ],
            [
                'category' => 'redes-conectividad',
                'name' => 'Cisco Nexus 93180YC-FX3',
                'slug' => 'cisco-nexus-93180yc-fx3',
                'description' => 'Switch de data center para diseñar o ampliar fabric de alta velocidad. La licencia, ópticos, soporte y compatibilidad deben definirse junto con la arquitectura de red.',
                'specifications' => [
                    ['label' => 'Marca', 'value' => 'Cisco'],
                    ['label' => 'Serie / modelo', 'value' => 'Nexus 93180YC-FX3'],
                    ['label' => 'Formato', 'value' => 'Switch 1RU'],
                    ['label' => 'Puertos downlink', 'value' => '48 × 1/10/25 Gb SFP28'],
                    ['label' => 'Puertos uplink', 'value' => '6 × 40/100 Gb QSFP28'],
                    ['label' => 'Código de parte', 'value' => 'N9K-C93180YC-FX3'],
                    ['label' => 'Estado comercial', 'value' => 'Cotización, licencias y ópticos por confirmar'],
                ],
            ],
            [
                'category' => 'redes-conectividad',
                'name' => 'Cisco Nexus 93108TC-FX3',
                'slug' => 'cisco-nexus-93108tc-fx3',
                'description' => 'Switch de data center con conectividad cobre para escenarios de agregación y migración de velocidades. La propuesta se construye con las licencias y transceptores aplicables.',
                'specifications' => [
                    ['label' => 'Marca', 'value' => 'Cisco'],
                    ['label' => 'Serie / modelo', 'value' => 'Nexus 93108TC-FX3'],
                    ['label' => 'Formato', 'value' => 'Switch 1RU'],
                    ['label' => 'Puertos downlink', 'value' => '48 × 100M/1/10G BASE-T'],
                    ['label' => 'Puertos uplink', 'value' => '6 × 40/100 Gb QSFP28'],
                    ['label' => 'Código de parte', 'value' => 'N9K-C93108TC-FX3'],
                    ['label' => 'Estado comercial', 'value' => 'Cotización, licencias y ópticos por confirmar'],
                ],
            ],
            [
                'category' => 'almacenamiento-empresarial',
                'name' => 'Seagate Exos X20 20 TB SATA',
                'slug' => 'seagate-exos-x20-20tb-sata-st20000nm007d',
                'description' => 'Disco duro empresarial para capacidad de almacenamiento y reemplazo de unidades en plataformas compatibles. Validar interfaz, firmware, caddy y controladora antes de cotizar.',
                'specifications' => [
                    ['label' => 'Marca', 'value' => 'Seagate'],
                    ['label' => 'Serie / modelo', 'value' => 'Exos X20 20 TB SATA'],
                    ['label' => 'Capacidad', 'value' => '20 TB'],
                    ['label' => 'Interfaz', 'value' => 'SATA 6 Gb/s'],
                    ['label' => 'Velocidad', 'value' => '7.200 RPM'],
                    ['label' => 'Código de parte', 'value' => 'ST20000NM007D'],
                    ['label' => 'Estado comercial', 'value' => 'Cotización y compatibilidad por confirmar'],
                ],
            ],
        ];

        foreach ($products as $product) {
            $category = $categories[$product['category']];
            unset($product['category']);

            Product::updateOrCreate(
                ['slug' => $product['slug']],
                [
                    ...$product,
                    'category_id' => $category->id,
                    'price' => 0,
                    'stock' => 0,
                    'is_quotable' => true,
                    'is_active' => true,
                    'warranty' => 'A definir en cotización',
                ],
            );
        }
    }
}
