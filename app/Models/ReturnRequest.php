<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReturnRequest extends Model
{
    protected $fillable = [
        'user_id', 'order_id', 'order_item_id', 'type',
        'status', 'reason', 'admin_notes', 'tracking_number',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function getStatusLabelAttribute()
    {
        return match ($this->status) {
            'pending' => 'Pendiente',
            'approved' => 'Aprobada',
            'rejected' => 'Rechazada',
            'in_process' => 'En Proceso',
            'completed' => 'Completada',
            default => $this->status,
        };
    }
}
