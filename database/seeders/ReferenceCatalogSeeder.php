<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

/**
 * Curated quotation references. These are not local stock or published prices.
 * Descriptions are original summaries based on manufacturer product families.
 */
class ReferenceCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $categories = collect([
            ['name' => 'Servidores empresariales', 'slug' => 'servidores-empresariales', 'description' => 'Plataformas rack para cómputo, virtualización y cargas críticas.'],
            ['name' => 'Redes y conectividad', 'slug' => 'redes-conectividad', 'description' => 'Switching, enlaces y componentes de red para entornos empresariales.'],
            ['name' => 'Almacenamiento empresarial', 'slug' => 'almacenamiento-empresarial', 'description' => 'Unidades, cabinas y NAS para capacidad y rendimiento.'],
            ['name' => 'Componentes y repuestos', 'slug' => 'componentes-y-repuestos', 'description' => 'Memoria, procesadores, aceleración, controladoras y adaptadores de red.'],
            ['name' => 'Energía y continuidad', 'slug' => 'energia-y-continuidad', 'description' => 'UPS, distribución y protección eléctrica para infraestructura TI.'],
            ['name' => 'Racks y organización', 'slug' => 'racks-y-organizacion', 'description' => 'Gabinetes, organización y capacidad física para salas técnicas.'],
        ])->mapWithKeys(function (array $category) {
            $record = Category::updateOrCreate(['slug' => $category['slug']], $category);

            return [$category['slug'] => $record];
        });

        $products = [];
        $add = static function (
            string $category,
            string $name,
            string $slug,
            string $image,
            string $description,
            string $brand,
            string $model,
            string $format,
            string $detail,
            string $reference,
        ) use (&$products): void {
            $products[] = compact('category', 'name', 'slug', 'image', 'description', 'brand', 'model', 'format', 'detail', 'reference');
        };

        // Servidores empresariales
        $add('servidores-empresariales', 'Dell PowerEdge R660', 'dell-poweredge-r660', 'images/catalog-server-reference.png', 'Servidor rack compacto para virtualización, bases de datos y plataformas de alta densidad. La propuesta se define con CPU, memoria, discos y red requeridos.', 'Dell Technologies', 'PowerEdge R660', 'Rack 1U, dos sockets', 'Familia Intel Xeon Scalable y memoria DDR5 según configuración', 'POWEREDGE-R660');
        $add('servidores-empresariales', 'Dell PowerEdge R760', 'dell-poweredge-r760', 'images/catalog-server-reference.png', 'Servidor rack de dos sockets orientado a virtualización y crecimiento de infraestructura. La configuración final se define según procesador, memoria, discos y conectividad requeridos.', 'Dell Technologies', 'PowerEdge R760', 'Rack 2U, dos sockets', '32 ranuras DDR5; almacenamiento y aceleración configurables', 'POWEREDGE-R760');
        $add('servidores-empresariales', 'Dell PowerEdge R7625', 'dell-poweredge-r7625', 'images/catalog-server-reference.png', 'Plataforma rack para cargas intensivas, virtualización y escenarios de cómputo con procesadores AMD EPYC.', 'Dell Technologies', 'PowerEdge R7625', 'Rack 2U, dos sockets', 'Arquitectura AMD EPYC 9004 y opciones NVMe según chasis', 'POWEREDGE-R7625');
        $add('servidores-empresariales', 'HPE ProLiant DL360 Gen11', 'hpe-proliant-dl360-gen11', 'images/catalog-server-reference.png', 'Servidor 1U para consolidar servicios, virtualización y aplicaciones con densidad de rack controlada.', 'HPE', 'ProLiant DL360 Gen11', 'Rack 1U, dos procesadores', 'Memoria DDR5, NVMe y conectividad según configuración', 'DL360-G11');
        $add('servidores-empresariales', 'HPE ProLiant DL380 Gen11', 'hpe-proliant-dl380-gen11', 'images/catalog-server-reference.png', 'Plataforma rack escalable para cargas híbridas, consolidación y servicios de empresa. Se cotiza con la configuración de CPU, memoria, discos y soporte adecuada para cada proyecto.', 'HPE', 'ProLiant DL380 Gen11', 'Rack 2U, dos procesadores', 'Opciones de almacenamiento, expansión y aceleración para entornos híbridos', 'DL380-G11');
        $add('servidores-empresariales', 'HPE ProLiant DL385 Gen11', 'hpe-proliant-dl385-gen11', 'images/catalog-server-reference.png', 'Servidor rack basado en AMD EPYC para proyectos que requieren núcleos, capacidad de memoria y expansión flexible.', 'HPE', 'ProLiant DL385 Gen11', 'Rack 2U, dos procesadores', 'Arquitectura AMD EPYC con perfiles de almacenamiento configurables', 'DL385-G11');
        $add('servidores-empresariales', 'Lenovo ThinkSystem SR630 V3', 'lenovo-thinksystem-sr630-v3', 'images/catalog-server-reference.png', 'Servidor 1U de propósito general para virtualización, servicios de aplicación y consolidación en rack.', 'Lenovo', 'ThinkSystem SR630 V3', 'Rack 1U, dos sockets', 'Plataforma Intel Xeon Scalable 4ª/5ª generación según configuración', '7D72 / 7D73 / 7D74');
        $add('servidores-empresariales', 'Lenovo ThinkSystem SR650 V3', 'lenovo-thinksystem-sr650-v3', 'images/catalog-server-reference.png', 'Servidor rack configurable para virtualización, bases de datos y aplicaciones empresariales, con alternativas de almacenamiento, expansión y aceleración.', 'Lenovo', 'ThinkSystem SR650 V3', 'Rack 2U, dos sockets', 'Hasta 32 DIMM DDR5 y opciones de HBA, RAID y GPU', '7D75 / 7D76 / 7D77');
        $add('servidores-empresariales', 'Lenovo ThinkSystem SR655 V3', 'lenovo-thinksystem-sr655-v3', 'images/catalog-server-reference.png', 'Servidor rack de un socket diseñado para equilibrar cómputo AMD EPYC, capacidad y eficiencia de infraestructura.', 'Lenovo', 'ThinkSystem SR655 V3', 'Rack 2U, un socket', 'Arquitectura AMD EPYC y almacenamiento de alta capacidad según chasis', 'SR655-V3');

        // Redes y conectividad
        $add('redes-conectividad', 'Cisco Nexus 93180YC-FX3', 'cisco-nexus-93180yc-fx3', 'images/catalog-switch-reference.png', 'Switch de data center para diseñar o ampliar fabric de alta velocidad. La licencia, ópticos, soporte y compatibilidad deben definirse junto con la arquitectura de red.', 'Cisco', 'Nexus 93180YC-FX3', 'Switch 1RU', '48 × 1/10/25 Gb SFP28 y 6 × 40/100 Gb QSFP28', 'N9K-C93180YC-FX3');
        $add('redes-conectividad', 'Cisco Nexus 93108TC-FX3', 'cisco-nexus-93108tc-fx3', 'images/catalog-switch-reference.png', 'Switch de data center con conectividad cobre para escenarios de agregación y migración de velocidades.', 'Cisco', 'Nexus 93108TC-FX3', 'Switch 1RU', '48 × 100M/1/10G BASE-T y 6 × 40/100 Gb QSFP28', 'N9K-C93108TC-FX3');
        $add('redes-conectividad', 'Cisco Catalyst 9300X 48HX', 'cisco-catalyst-9300x-48hx', 'images/catalog-switch-reference.png', 'Switch de acceso empresarial para campus, oficinas y redes con alimentación PoE de alta capacidad.', 'Cisco', 'Catalyst 9300X 48HX', 'Switch de acceso apilable', '48 puertos multigigabit y perfiles PoE según licencia y fuente', 'C9300X-48HX');
        $add('redes-conectividad', 'Cisco Catalyst 9200L 48P 4X', 'cisco-catalyst-9200l-48p-4x', 'images/catalog-switch-reference.png', 'Switch de acceso administrable para redes empresariales con puertos cobre, PoE y uplinks de fibra.', 'Cisco', 'Catalyst 9200L 48P 4X', 'Switch de acceso', '48 puertos Gigabit PoE+ y 4 uplinks 10G SFP+', 'C9200L-48P-4X');
        $add('redes-conectividad', 'Aruba CX 6200F 48G PoE 4SFP+', 'aruba-cx-6200f-48g-poe-4sfp', 'images/catalog-switch-reference.png', 'Switch de acceso para campus con administración centralizada y opciones de alimentación por Ethernet.', 'HPE Aruba Networking', 'CX 6200F 48G PoE 4SFP+', 'Switch de acceso', '48 puertos 1G PoE y 4 uplinks SFP+ 10G', 'JL727A');
        $add('redes-conectividad', 'Aruba CX 6300M 48G PoE', 'aruba-cx-6300m-48g-poe', 'images/catalog-switch-reference.png', 'Equipo de acceso y agregación para redes empresariales que requieren crecimiento, apilamiento y PoE.', 'HPE Aruba Networking', 'CX 6300M 48G PoE', 'Switch de acceso apilable', '48 puertos 1G PoE y uplinks de alta velocidad según variante', 'CX-6300M-48G-POE');
        $add('redes-conectividad', 'Ubiquiti UniFi Switch Pro 48', 'ubiquiti-unifi-switch-pro-48', 'images/catalog-switch-reference.png', 'Switch administrable para oficinas, sucursales y proyectos que utilizan el ecosistema UniFi.', 'Ubiquiti', 'UniFi Switch Pro 48', 'Switch 1RU', '48 puertos Gigabit y uplinks SFP+ 10G', 'USW-PRO-48');

        // Almacenamiento empresarial
        $add('almacenamiento-empresarial', 'Seagate Exos X20 20 TB SATA', 'seagate-exos-x20-20tb-sata-st20000nm007d', 'images/catalog-storage-reference.png', 'Disco duro empresarial para capacidad de almacenamiento y reemplazo de unidades en plataformas compatibles. Validar interfaz, firmware, caddy y controladora antes de cotizar.', 'Seagate', 'Exos X20 20 TB SATA', 'HDD 3.5 pulgadas', '20 TB, SATA 6 Gb/s y 7.200 RPM', 'ST20000NM007D');
        $add('almacenamiento-empresarial', 'Seagate Exos X24 24 TB SATA', 'seagate-exos-x24-24tb-sata', 'images/catalog-storage-reference.png', 'Unidad de alta capacidad para cabinas, servidores y plataformas de almacenamiento compatibles.', 'Seagate', 'Exos X24 24 TB SATA', 'HDD 3.5 pulgadas', '24 TB para cargas empresariales; confirmar firmware y compatibilidad', 'ST24000NM002H');
        $add('almacenamiento-empresarial', 'Samsung PM9A3 3.84 TB NVMe', 'samsung-pm9a3-384tb-nvme', 'images/catalog-storage-reference.png', 'SSD NVMe orientado a servidores y almacenamiento definido por software con requerimientos de baja latencia.', 'Samsung', 'PM9A3 3.84 TB', 'SSD U.2 NVMe', 'Capacidad 3.84 TB; formato y firmware según SKU', 'MZQL23T8HCLS-00A07');
        $add('almacenamiento-empresarial', 'Micron 7450 PRO 3.84 TB NVMe', 'micron-7450-pro-384tb-nvme', 'images/catalog-storage-reference.png', 'SSD de centro de datos para plataformas NVMe que requieren rendimiento consistente y perfiles empresariales.', 'Micron', '7450 PRO 3.84 TB', 'SSD U.3 NVMe', 'Capacidad 3.84 TB; confirmar factor de forma, firmware y endurance', 'MTFDKCC3T8TFR-1BC1ZABYY');
        $add('almacenamiento-empresarial', 'HPE MSA 2060 SAN', 'hpe-msa-2060-san', 'images/catalog-storage-reference.png', 'Cabina de almacenamiento para proyectos de virtualización, consolidación y crecimiento de capacidad compartida.', 'HPE', 'MSA 2060', 'Cabina SAN', 'Configuración con controladoras, discos, HBA y soporte por definir', 'MSA-2060');
        $add('almacenamiento-empresarial', 'Synology SA6400', 'synology-sa6400', 'images/catalog-storage-reference.png', 'Servidor NAS/SAN para centralizar almacenamiento, respaldo y servicios de archivo en entornos empresariales.', 'Synology', 'SA6400', 'NAS rack 2U', 'Arquitectura escalable; discos, red y memoria se definen por proyecto', 'SA6400');
        $add('almacenamiento-empresarial', 'QNAP TS-h1886XU-RP', 'qnap-ts-h1886xu-rp', 'images/catalog-storage-reference.png', 'NAS rack para proyectos de almacenamiento unificado, respaldo y virtualización ligera.', 'QNAP', 'TS-h1886XU-RP', 'NAS rack 2U', 'Bahías híbridas y conectividad configurable según configuración', 'TS-H1886XU-RP');
        $add('almacenamiento-empresarial', 'Broadcom MegaRAID 9560-16i', 'broadcom-megaraid-9560-16i', 'images/catalog-storage-reference.png', 'Controladora RAID para servidores que requieren validar discos, caché, cableado y compatibilidad de plataforma.', 'Broadcom', 'MegaRAID 9560-16i', 'Controladora RAID PCIe', '16 puertos internos; confirmar kit, cableado y firmware', '05-50077-00');

        // Componentes y repuestos
        $add('componentes-y-repuestos', 'Intel Xeon Gold 6454S', 'intel-xeon-gold-6454s', 'images/catalog-components-reference.png', 'Procesador para servidores Intel Xeon Scalable. La factibilidad depende de socket, firmware, disipación y homologación del fabricante.', 'Intel', 'Xeon Gold 6454S', 'CPU para servidor', 'Familia Xeon Scalable; validar plataforma y revisión de BIOS', 'XEON-GOLD-6454S');
        $add('componentes-y-repuestos', 'AMD EPYC 9354P', 'amd-epyc-9354p', 'images/catalog-components-reference.png', 'Procesador para servidor de un socket orientado a cómputo, virtualización y capacidad de memoria.', 'AMD', 'EPYC 9354P', 'CPU para servidor', 'Serie EPYC 9004; validar socket, memoria y perfil térmico', 'EPYC-9354P');
        $add('componentes-y-repuestos', 'Samsung DDR5 ECC RDIMM 64 GB', 'samsung-ddr5-ecc-rdimm-64gb', 'images/catalog-components-reference.png', 'Módulo de memoria para servidor. Debe confirmarse velocidad, organización, compatibilidad de plataforma y población de canales.', 'Samsung', 'DDR5 ECC RDIMM 64 GB', 'Memoria de servidor', '64 GB ECC Registered DDR5; validar frecuencia y part number', 'M321R8GA0BB0-CQK');
        $add('componentes-y-repuestos', 'Kingston Server Premier DDR5 ECC RDIMM 64 GB', 'kingston-server-premier-ddr5-ecc-rdimm-64gb', 'images/catalog-components-reference.png', 'Memoria ECC para ampliaciones o reemplazos de servidores compatibles.', 'Kingston', 'Server Premier DDR5 ECC RDIMM 64 GB', 'Memoria de servidor', '64 GB ECC Registered DDR5; confirmar perfil y homologación', 'KSM48R40BD4KM-64HM');
        $add('componentes-y-repuestos', 'NVIDIA L40S 48 GB', 'nvidia-l40s-48gb', 'images/catalog-components-reference.png', 'Acelerador profesional para IA, visualización y cargas de cómputo. Requiere validar consumo, rieles, firmware y licenciamiento.', 'NVIDIA', 'L40S 48 GB', 'GPU para data center', '48 GB de memoria; confirmar servidor certificado y perfil térmico', 'L40S');
        $add('componentes-y-repuestos', 'NVIDIA A16 64 GB', 'nvidia-a16-64gb', 'images/catalog-components-reference.png', 'GPU para densidad de escritorios virtuales y cargas gráficas empresariales.', 'NVIDIA', 'A16 64 GB', 'GPU para data center', '64 GB de memoria; validar virtualización, servidor y licencia', 'A16');
        $add('componentes-y-repuestos', 'NVIDIA ConnectX-6 Dx 25 GbE', 'nvidia-connectx-6-dx-25gbe', 'images/catalog-components-reference.png', 'Adaptador de red para servidores y almacenamiento, sujeto a validación de ópticos, DAC, firmware y sistema operativo.', 'NVIDIA Networking', 'ConnectX-6 Dx 25 GbE', 'NIC PCIe dual port', 'Enlaces 25 GbE; confirmar interfaz física y perfil de bracket', 'MCX623106AN-CDAT');
        $add('componentes-y-repuestos', 'Broadcom 57414 25 GbE', 'broadcom-57414-25gbe', 'images/catalog-components-reference.png', 'Adaptador Ethernet para servidores con necesidades de conectividad 10/25 GbE.', 'Broadcom', 'NetXtreme-E 57414', 'NIC PCIe dual port', 'Adaptador 10/25 GbE; validar ópticos, driver y plataforma', 'BCM957414A4142CC');

        // Energía y continuidad
        $add('energia-y-continuidad', 'APC Smart-UPS SRT 3000VA', 'apc-smart-ups-srt-3000va', 'images/catalog-power-reference.png', 'UPS online para continuidad eléctrica de servidores, red y almacenamiento. La autonomía se define con carga y baterías requeridas.', 'APC by Schneider Electric', 'Smart-UPS SRT 3000VA', 'UPS online rack/tower', '3 kVA; validar tensión, autonomía, tarjetas de gestión y formato', 'SRT3000XLI');
        $add('energia-y-continuidad', 'APC Smart-UPS SRT 6000VA', 'apc-smart-ups-srt-6000va', 'images/catalog-power-reference.png', 'UPS online de mayor capacidad para salas técnicas y cargas críticas de infraestructura.', 'APC by Schneider Electric', 'Smart-UPS SRT 6000VA', 'UPS online rack/tower', '6 kVA; validar bypass, autonomía, entrada y distribución', 'SRT6KXLI');
        $add('energia-y-continuidad', 'Eaton 9PX 3000i RT2U', 'eaton-9px-3000i-rt2u', 'images/catalog-power-reference.png', 'UPS online para rack con monitoreo y opciones de extensión de baterías.', 'Eaton', '9PX 3000i RT2U', 'UPS online 2U', '3 kVA; confirmar tensión, autonomía y accesorios de gestión', '9PX3000IRT2U');
        $add('energia-y-continuidad', 'APC Rack PDU 2G Metered', 'apc-rack-pdu-2g-metered', 'images/catalog-power-reference.png', 'Distribución eléctrica para rack con medición y formatos de enchufe que deben definirse según el proyecto.', 'APC by Schneider Electric', 'Rack PDU 2G Metered', 'PDU para rack', 'Confirmar voltaje, conectores, longitud y montaje vertical u horizontal', 'AP8853');

        // Racks y organización
        $add('racks-y-organizacion', 'APC NetShelter SX 42U', 'apc-netshelter-sx-42u', 'images/catalog-rack-reference.png', 'Gabinete de rack para servidores, red y organización de cableado en salas técnicas.', 'APC by Schneider Electric', 'NetShelter SX 42U', 'Rack 42U', 'Confirmar profundidad, puertas, ventilación, PDU y accesorios', 'AR3100');
        $add('racks-y-organizacion', 'Tripp Lite SmartRack 42U', 'tripp-lite-smartrack-42u', 'images/catalog-rack-reference.png', 'Rack cerrado de alta capacidad para infraestructura TI y cableado estructurado.', 'Tripp Lite by Eaton', 'SmartRack 42U', 'Rack 42U', 'Validar profundidad, carga, ventilación y kits de organización', 'SR42UB');
        $add('racks-y-organizacion', 'APC NetShelter SX 48U', 'apc-netshelter-sx-48u', 'images/catalog-rack-reference.png', 'Gabinete de mayor altura para consolidar infraestructura y distribución de energía en un mismo punto.', 'APC by Schneider Electric', 'NetShelter SX 48U', 'Rack 48U', 'Confirmar profundidad, capacidad de carga y accesorios de sala', 'AR3300');

        foreach ($products as $product) {
            $category = $categories[$product['category']];

            Product::updateOrCreate(
                ['slug' => $product['slug']],
                [
                    'category_id' => $category->id,
                    'name' => $product['name'],
                    'description' => $product['description'],
                    'image_path' => $product['image'],
                    'specifications' => [
                        ['label' => 'Marca', 'value' => $product['brand']],
                        ['label' => 'Serie / modelo', 'value' => $product['model']],
                        ['label' => 'Formato / tipo', 'value' => $product['format']],
                        ['label' => 'Referencia técnica', 'value' => $product['detail']],
                        ['label' => 'Código de referencia', 'value' => $product['reference']],
                        ['label' => 'Estado comercial', 'value' => 'Imagen y ficha referencial; cotización y compatibilidad por confirmar'],
                    ],
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
