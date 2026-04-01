<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\Quote;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Monthly sales for last 6 months
        $monthlySales = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', now()->subMonths(6))
            ->select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
                DB::raw('SUM(total) as revenue'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Top selling products
        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.payment_status', 'paid')
            ->select('products.name', DB::raw('SUM(order_items.quantity) as total_sold'), DB::raw('SUM(order_items.subtotal) as total_revenue'))
            ->groupBy('products.name')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        // Recent orders
        $recentOrders = Order::with('user')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($o) => [
                'id' => $o->id,
                'order_number' => $o->order_number,
                'customer' => $o->user?->name ?? $o->guest_name ?? 'Invitado',
                'total' => $o->total,
                'status' => $o->status,
                'payment_status' => $o->payment_status,
                'created_at' => $o->created_at->diffForHumans(),
            ]);

        // Recent activity
        $recentActivity = \App\Models\ActivityLog::with('user')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'user' => $a->user?->name ?? 'Sistema',
                'action' => $a->action,
                'description' => $a->description,
                'created_at' => $a->created_at->diffForHumans(),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'products_count' => Product::count(),
                'categories_count' => Category::count(),
                'orders_count' => Order::count(),
                'quotes_count' => Quote::count(),
                'messages_count' => \App\Models\ContactMessage::count(),
                'users_count' => \App\Models\User::count(),
                'revenue' => Order::where('payment_status', 'paid')->sum('total'),
                'pending_orders' => Order::where('status', 'pending')->count(),
            ],
            'monthlySales' => $monthlySales,
            'topProducts' => $topProducts,
            'recentOrders' => $recentOrders,
            'recentActivity' => $recentActivity,
        ]);
    }
}
