<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'status',
        'document_type',
        'net_amount',
        'tax_amount',
        'shipping_amount',
        'total_amount',
        'customer_name',
        'customer_rut',
        'customer_email',
        'customer_phone',
        'shipping_rate_id',
        'shipping_commune',
        'shipping_address',
        'business_name',
        'business_rut',
        'business_giro',
        'business_address',
        'buy_order',
        'webpay_token',
        'payment_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
