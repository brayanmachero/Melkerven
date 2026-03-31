<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ShippingRate;

class ShippingRateSeeder extends Seeder
{
    public function run(): void
    {
        $regions = [
            ['name' => 'Arica y Parinacota', 'cost' => 8500, 'days' => 5],
            ['name' => 'Tarapacá', 'cost' => 8500, 'days' => 5],
            ['name' => 'Antofagasta', 'cost' => 7500, 'days' => 4],
            ['name' => 'Atacama', 'cost' => 6500, 'days' => 3],
            ['name' => 'Coquimbo', 'cost' => 5500, 'days' => 2],
            ['name' => 'Valparaíso', 'cost' => 4500, 'days' => 1],
            ['name' => 'Metropolitana de Santiago', 'cost' => 3500, 'days' => 1],
            ['name' => "O'Higgins", 'cost' => 4500, 'days' => 2],
            ['name' => 'Maule', 'cost' => 4500, 'days' => 2],
            ['name' => 'Ñuble', 'cost' => 5500, 'days' => 3],
            ['name' => 'Biobío', 'cost' => 5500, 'days' => 3],
            ['name' => 'Araucanía', 'cost' => 6500, 'days' => 3],
            ['name' => 'Los Ríos', 'cost' => 6500, 'days' => 4],
            ['name' => 'Los Lagos', 'cost' => 7500, 'days' => 4],
            ['name' => 'Aysén', 'cost' => 9500, 'days' => 7],
            ['name' => 'Magallanes', 'cost' => 9500, 'days' => 7],
        ];

        foreach ($regions as $region) {
            ShippingRate::updateOrCreate(
                ['region_name' => $region['name']],
                [
                    'base_cost' => $region['cost'],
                    'estimated_days' => $region['days'],
                    'allow_shipping' => true
                ]
            );
        }
    }
}
