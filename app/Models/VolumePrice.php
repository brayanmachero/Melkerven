<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VolumePrice extends Model
{
    protected $fillable = ['product_id', 'min_quantity', 'max_quantity', 'price'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
