<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\Quote;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'products_count' => Product::count(),
                'categories_count' => Category::count(),
                'orders_count' => Order::count(),
                'quotes_count' => Quote::count(),
                'messages_count' => \App\Models\ContactMessage::count(),
                'users_count' => \App\Models\User::count(),
            ]
        ]);
    }
}
