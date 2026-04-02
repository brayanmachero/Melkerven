<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AbandonedCart extends Model
{
    protected $fillable = ['user_id', 'cart_items', 'email_sent', 'last_activity_at'];

    protected $casts = [
        'cart_items' => 'json',
        'email_sent' => 'boolean',
        'last_activity_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
