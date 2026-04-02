<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SitemapController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $banners = [];
    $featuredProducts = [];
    try {
        if (\Illuminate\Support\Facades\Schema::hasTable('banners')) {
            $banners = \App\Models\Banner::where('is_active', true)->orderBy('sort_order')->get();
        }
        $featuredProducts = \App\Models\Product::where('stock', '>', 0)->latest()->take(8)->get();
    } catch (\Exception $e) {}
    return Inertia::render('Home', [
        'banners' => $banners,
        'featuredProducts' => $featuredProducts,
    ]);
})->name('home');

Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

Route::get('/catalog', [\App\Http\Controllers\CatalogController::class, 'index'])->name('catalog');
Route::get('/catalog/compare', [\App\Http\Controllers\CatalogController::class, 'compare'])->name('compare');
Route::get('/catalog/{product:slug}', [\App\Http\Controllers\CatalogController::class, 'show'])->name('product.show');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');
Route::post('/contact', [\App\Http\Controllers\ContactController::class, 'store'])->middleware('throttle:5,1')->name('contact.store');

// Newsletter
Route::post('/newsletter/subscribe', [\App\Http\Controllers\NewsletterController::class, 'subscribe'])->middleware('throttle:5,1')->name('newsletter.subscribe');
Route::get('/newsletter/unsubscribe/{email}', [\App\Http\Controllers\NewsletterController::class, 'unsubscribe'])->name('newsletter.unsubscribe');

// Stock Notification
Route::post('/stock-notification', [\App\Http\Controllers\StockNotificationController::class, 'store'])->middleware('throttle:5,1')->name('stock.notify');

// FAQ
Route::get('/faq', [\App\Http\Controllers\FaqController::class, 'index'])->name('faq');

// Blog
Route::get('/blog', [\App\Http\Controllers\BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{post:slug}', [\App\Http\Controllers\BlogController::class, 'show'])->name('blog.show');

// Order Tracking (public)
Route::get('/tracking', [\App\Http\Controllers\OrderTrackingController::class, 'index'])->name('tracking');
Route::post('/tracking', [\App\Http\Controllers\OrderTrackingController::class, 'track'])->name('tracking.search');

// MercadoPago Payment Routes (guest checkout allowed)
Route::post('/payment/initiate', [\App\Http\Controllers\MercadoPagoController::class, 'initiate'])->name('payment.initiate');
Route::get('/payment/success/{order}', [\App\Http\Controllers\MercadoPagoController::class, 'success'])->name('mercadopago.success');
Route::get('/payment/failure/{order}', [\App\Http\Controllers\MercadoPagoController::class, 'failure'])->name('mercadopago.failure');
Route::get('/payment/pending/{order}', [\App\Http\Controllers\MercadoPagoController::class, 'pending'])->name('mercadopago.pending');
Route::post('/payment/webhook', [\App\Http\Controllers\MercadoPagoController::class, 'webhook'])->name('mercadopago.webhook');

Route::get('/cart', [\App\Http\Controllers\CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add/{product}', [\App\Http\Controllers\CartController::class, 'add'])->name('cart.add');
Route::patch('/cart/update', [\App\Http\Controllers\CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/remove', [\App\Http\Controllers\CartController::class, 'remove'])->name('cart.remove');
Route::post('/cart/coupon', [\App\Http\Controllers\CartController::class, 'applyCoupon'])->name('cart.coupon');

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class);

    // Orders
    Route::get('/orders/export', [\App\Http\Controllers\Admin\OrderController::class, 'export'])->name('orders.export');
    Route::get('/orders', [\App\Http\Controllers\Admin\OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [\App\Http\Controllers\Admin\OrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/status', [\App\Http\Controllers\Admin\OrderController::class, 'updateStatus'])->name('orders.updateStatus');

    // Products
    Route::get('/products/export-csv', [\App\Http\Controllers\Admin\ProductController::class, 'exportCsv'])->name('products.export-csv');
    Route::post('/products/import-csv', [\App\Http\Controllers\Admin\ProductController::class, 'importCsv'])->name('products.import-csv');
    Route::resource('products', \App\Http\Controllers\Admin\ProductController::class)->names('products');

    // Shipping
    Route::get('/shipping', [\App\Http\Controllers\Admin\ShippingRateController::class, 'index'])->name('shipping.index');
    Route::put('/shipping/{shippingRate}', [\App\Http\Controllers\Admin\ShippingRateController::class, 'update'])->name('shipping.update');

    // Quotes (Admin)
    Route::get('/quotes', [\App\Http\Controllers\Admin\QuoteController::class, 'index'])->name('quotes.index');
    Route::get('/quotes/{quote}', [\App\Http\Controllers\Admin\QuoteController::class, 'show'])->name('quotes.show');
    Route::patch('/quotes/{quote}/status', [\App\Http\Controllers\Admin\QuoteController::class, 'updateStatus'])->name('quotes.updateStatus');

    // Messages (Admin)
    Route::get('/messages', [\App\Http\Controllers\Admin\ContactMessageController::class, 'index'])->name('messages.index');
    Route::get('/messages/{message}', [\App\Http\Controllers\Admin\ContactMessageController::class, 'show'])->name('messages.show');
    Route::post('/messages/{message}/reply', [\App\Http\Controllers\Admin\ContactMessageController::class, 'reply'])->name('messages.reply');

    // Users (Admin)
    Route::get('/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    Route::patch('/users/{user}/role', [\App\Http\Controllers\Admin\UserController::class, 'updateRole'])->name('users.updateRole');

    // Coupons (Admin)
    Route::get('/coupons', [\App\Http\Controllers\Admin\CouponController::class, 'index'])->name('coupons.index');
    Route::post('/coupons', [\App\Http\Controllers\Admin\CouponController::class, 'store'])->name('coupons.store');
    Route::patch('/coupons/{coupon}', [\App\Http\Controllers\Admin\CouponController::class, 'update'])->name('coupons.update');
    Route::delete('/coupons/{coupon}', [\App\Http\Controllers\Admin\CouponController::class, 'destroy'])->name('coupons.destroy');

    // Blog (Admin)
    Route::get('/blog', [\App\Http\Controllers\Admin\BlogPostController::class, 'index'])->name('blog.index');
    Route::get('/blog/create', [\App\Http\Controllers\Admin\BlogPostController::class, 'create'])->name('blog.create');
    Route::post('/blog', [\App\Http\Controllers\Admin\BlogPostController::class, 'store'])->name('blog.store');
    Route::get('/blog/{post}/edit', [\App\Http\Controllers\Admin\BlogPostController::class, 'edit'])->name('blog.edit');
    Route::put('/blog/{post}', [\App\Http\Controllers\Admin\BlogPostController::class, 'update'])->name('blog.update');
    Route::delete('/blog/{post}', [\App\Http\Controllers\Admin\BlogPostController::class, 'destroy'])->name('blog.destroy');

    // Banners (Admin)
    Route::get('/banners', [\App\Http\Controllers\Admin\BannerController::class, 'index'])->name('banners.index');
    Route::post('/banners', [\App\Http\Controllers\Admin\BannerController::class, 'store'])->name('banners.store');
    Route::put('/banners/{banner}', [\App\Http\Controllers\Admin\BannerController::class, 'update'])->name('banners.update');
    Route::delete('/banners/{banner}', [\App\Http\Controllers\Admin\BannerController::class, 'destroy'])->name('banners.destroy');

    // Returns (Admin)
    Route::get('/returns', [\App\Http\Controllers\Admin\ReturnController::class, 'index'])->name('returns.index');
    Route::patch('/returns/{returnRequest}/status', [\App\Http\Controllers\Admin\ReturnController::class, 'updateStatus'])->name('returns.updateStatus');

    // Reports (Admin)
    Route::get('/reports', [\App\Http\Controllers\Admin\ReportController::class, 'index'])->name('reports.index');

    // Facturación Electrónica (Admin)
    Route::get('/dte', [\App\Http\Controllers\Admin\DteController::class, 'index'])->name('dte.index');

    // Newsletter (Admin)
    Route::get('/newsletter', [\App\Http\Controllers\Admin\NewsletterController::class, 'index'])->name('newsletter.index');
    Route::post('/newsletter/send', [\App\Http\Controllers\Admin\NewsletterController::class, 'send'])->name('newsletter.send');
    Route::delete('/newsletter/{subscriber}', [\App\Http\Controllers\Admin\NewsletterController::class, 'destroy'])->name('newsletter.destroy');

    // Notifications API (Admin polling)
    Route::get('/notifications', function () {
        return response()->json([
            'new_orders' => \App\Models\Order::where('status', 'pending')->where('created_at', '>=', now()->subHours(24))->count(),
            'new_quotes' => \App\Models\Quote::where('status', 'pending')->where('created_at', '>=', now()->subHours(24))->count(),
            'new_messages' => \App\Models\ContactMessage::whereNull('admin_reply')->count(),
            'low_stock' => \App\Models\Product::where('stock', '>', 0)->where('stock', '<=', 5)->count(),
        ]);
    })->name('notifications');
});

// Dashboard - redirects admin to admin dashboard
Route::get('/dashboard', function () {
    if (auth()->user()->isAdmin()) {
        return redirect()->route('admin.dashboard');
    }

    $user = auth()->user();
    $recentOrders = \App\Models\Order::where('user_id', $user->id)->orderByDesc('created_at')->take(5)->get();
    $recentQuotes = \App\Models\Quote::where('user_id', $user->id)->orderByDesc('created_at')->take(5)->get();
    $stats = [
        'orders_count' => \App\Models\Order::where('user_id', $user->id)->count(),
        'quotes_count' => \App\Models\Quote::where('user_id', $user->id)->count(),
        'total_spent' => \App\Models\Order::where('user_id', $user->id)->where('status', 'paid')->sum('total_amount'),
    ];

    return Inertia::render('Dashboard', [
        'recentOrders' => $recentOrders,
        'recentQuotes' => $recentQuotes,
        'stats' => $stats,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// Authenticated User Routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/two-factor', [ProfileController::class, 'toggleTwoFactor'])->name('profile.two-factor');
    Route::delete('/profile/sessions', [ProfileController::class, 'destroyOtherSessions'])->name('profile.sessions.destroy');

    // My Orders
    Route::get('/my-orders', [\App\Http\Controllers\MyOrderController::class, 'index'])->name('my-orders.index');
    Route::get('/my-orders/{order}', [\App\Http\Controllers\MyOrderController::class, 'show'])->name('my-orders.show');

    // My Quotes
    Route::get('/my-quotes', [\App\Http\Controllers\MyQuoteController::class, 'index'])->name('my-quotes.index');
    Route::post('/my-quotes', [\App\Http\Controllers\MyQuoteController::class, 'store'])->name('my-quotes.store');

    // PDF Downloads
    Route::get('/pdf/order/{order}', [\App\Http\Controllers\PdfController::class, 'order'])->name('pdf.order');
    Route::get('/pdf/quote/{quote}', [\App\Http\Controllers\PdfController::class, 'quote'])->name('pdf.quote');

    // Wishlist
    Route::get('/wishlist', [\App\Http\Controllers\WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/wishlist/{product}', [\App\Http\Controllers\WishlistController::class, 'toggle'])->name('wishlist.toggle');
    Route::delete('/wishlist/{product}', [\App\Http\Controllers\WishlistController::class, 'remove'])->name('wishlist.remove');

    // Reviews
    Route::post('/reviews/{product}', [\App\Http\Controllers\ReviewController::class, 'store'])->name('reviews.store');

    // Return Requests (Client)
    Route::get('/returns', [\App\Http\Controllers\ReturnRequestController::class, 'index'])->name('returns.index');
    Route::get('/returns/create', [\App\Http\Controllers\ReturnRequestController::class, 'create'])->name('returns.create');
    Route::post('/returns', [\App\Http\Controllers\ReturnRequestController::class, 'store'])->name('returns.store');
});

require __DIR__ . '/auth.php';
