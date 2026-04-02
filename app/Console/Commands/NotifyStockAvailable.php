<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Models\StockNotification;
use App\Mail\StockAvailable;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class NotifyStockAvailable extends Command
{
    protected $signature = 'stock:notify-available';
    protected $description = 'Notify users when a product they subscribed to is back in stock';

    public function handle()
    {
        if (!Schema::hasTable('stock_notifications')) {
            $this->info('Tabla stock_notifications no existe aún.');
            return;
        }

        $notifications = StockNotification::where('notified', false)
            ->with('product')
            ->get();

        if ($notifications->isEmpty()) {
            $this->info('No hay notificaciones pendientes.');
            return;
        }

        $sent = 0;
        foreach ($notifications as $notification) {
            if ($notification->product && $notification->product->stock > 0) {
                try {
                    Mail::to($notification->email)->send(new StockAvailable($notification->product));
                    $notification->update(['notified' => true]);
                    $sent++;
                } catch (\Exception $e) {
                    Log::error("Error notificando stock a {$notification->email}: " . $e->getMessage());
                }
            }
        }

        $this->info("Se enviaron {$sent} notificaciones de stock disponible.");
    }
}
