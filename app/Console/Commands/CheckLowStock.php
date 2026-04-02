<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckLowStock extends Command
{
    protected $signature = 'stock:check-low {--threshold=5}';
    protected $description = 'Check for products with low stock and notify admins';

    public function handle()
    {
        $threshold = (int) $this->option('threshold');

        $lowStockProducts = Product::where('is_active', true)
            ->where('stock', '>', 0)
            ->where('stock', '<=', $threshold)
            ->get();

        if ($lowStockProducts->isEmpty()) {
            $this->info('No hay productos con stock bajo.');
            return;
        }

        $this->warn("Se encontraron {$lowStockProducts->count()} productos con stock bajo:");

        foreach ($lowStockProducts as $product) {
            $this->line("  - {$product->name}: {$product->stock} unidades");
            Log::warning("Stock bajo: {$product->name} ({$product->stock} uds)");
        }

        // Create activity log
        \App\Models\ActivityLog::create([
            'user_id' => null,
            'action' => 'low_stock_alert',
            'description' => "{$lowStockProducts->count()} productos con stock bajo (≤{$threshold} uds)",
            'model_type' => 'Product',
            'model_id' => null,
        ]);
    }
}
