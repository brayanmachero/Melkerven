<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->get('period', '30');
        $startDate = now()->subDays((int) $period);

        // Sales by period
        $salesByDay = Order::where('status', 'paid')
            ->where('created_at', '>=', $startDate)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_amount) as revenue'), DB::raw('COUNT(*) as orders'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Top products
        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'paid')
            ->where('orders.created_at', '>=', $startDate)
            ->select('products.name', DB::raw('SUM(order_items.quantity) as total_sold'), DB::raw('SUM(order_items.price * order_items.quantity) as total_revenue'))
            ->groupBy('products.name')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get();

        // Top clients
        $topClients = Order::where('status', 'paid')
            ->where('created_at', '>=', $startDate)
            ->whereNotNull('user_id')
            ->with('user:id,name,email')
            ->select('user_id', DB::raw('COUNT(*) as orders_count'), DB::raw('SUM(total_amount) as total_spent'))
            ->groupBy('user_id')
            ->orderByDesc('total_spent')
            ->limit(10)
            ->get();

        // Summary stats
        $stats = [
            'total_revenue' => Order::where('status', 'paid')->where('created_at', '>=', $startDate)->sum('total_amount'),
            'total_orders' => Order::where('status', 'paid')->where('created_at', '>=', $startDate)->count(),
            'avg_order_value' => Order::where('status', 'paid')->where('created_at', '>=', $startDate)->avg('total_amount') ?? 0,
            'new_customers' => User::where('role', 'customer')->where('created_at', '>=', $startDate)->count(),
        ];

        // Categories performance
        $categoryStats = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'paid')
            ->where('orders.created_at', '>=', $startDate)
            ->select('categories.name', DB::raw('SUM(order_items.price * order_items.quantity) as revenue'))
            ->groupBy('categories.name')
            ->orderByDesc('revenue')
            ->get();

        return Inertia::render('Admin/Reports', [
            'salesByDay' => $salesByDay,
            'topProducts' => $topProducts,
            'topClients' => $topClients,
            'stats' => $stats,
            'categoryStats' => $categoryStats,
            'period' => $period,
        ]);
    }
}
