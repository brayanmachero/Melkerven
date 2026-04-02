<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'specifications',
        'warranty',
        'price',
        'stock',
        'is_quotable',
        'is_active',
        'image_path',
        'images'
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return $this->image_path ? asset('storage/' . $this->image_path) : null;
    }

    protected $casts = [
        'is_quotable' => 'boolean',
        'is_active' => 'boolean',
        'images' => 'json',
        'specifications' => 'json',
        'price' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function volumePrices()
    {
        return $this->hasMany(VolumePrice::class)->orderBy('min_quantity');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class)->orderBy('name');
    }

    public function getPriceForQuantity($quantity)
    {
        $volumePrice = $this->volumePrices()
            ->where('min_quantity', '<=', $quantity)
            ->where(function ($q) use ($quantity) {
                $q->whereNull('max_quantity')->orWhere('max_quantity', '>=', $quantity);
            })
            ->orderBy('min_quantity', 'desc')
            ->first();

        return $volumePrice ? $volumePrice->price : $this->price;
    }
}
