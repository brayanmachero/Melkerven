<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingRate extends Model
{
    protected $fillable = [
        'region_name',
        'base_cost',
        'allow_shipping',
        'estimated_days'
    ];

    protected $casts = [
        'allow_shipping' => 'boolean',
        'base_cost' => 'decimal:2',
    ];
}
