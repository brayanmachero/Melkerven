<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->where('is_active', true);

        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('search') && $request->search) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', $searchTerm)
                    ->orWhere('description', 'like', $searchTerm);
            });
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->filled('in_stock')) {
            $query->where('stock', '>', 0);
        }

        $sortField = $request->input('sort', 'created_at');
        $sortDir = $request->input('dir', 'desc');
        $allowedSorts = ['created_at', 'price', 'name', 'stock'];
        if (!in_array($sortField, $allowedSorts)) $sortField = 'created_at';
        if (!in_array($sortDir, ['asc', 'desc'])) $sortDir = 'desc';
        $query->orderBy($sortField, $sortDir);

        return Inertia::render('Catalog', [
            'products' => $query->paginate(12)->withQueryString(),
            'categories' => Category::all(),
            'filters' => $request->only(['category', 'search', 'sort', 'dir', 'min_price', 'max_price', 'in_stock']),
            'wishlistIds' => auth()->check() ? (function() { try { return Wishlist::where('user_id', auth()->id())->pluck('product_id')->toArray(); } catch (\Exception $e) { return []; } })() : [],
        ]);
    }

    public function show(Product $product)
    {
        if (!$product->is_active && !auth()->user()?->isAdmin()) {
            abort(404);
        }

        $relatedProducts = Product::with('category')
            ->where('is_active', true)
            ->where('id', '!=', $product->id)
            ->where(function ($q) use ($product) {
                $q->where('category_id', $product->category_id);
            })
            ->inRandomOrder()
            ->limit(4)
            ->get();

        $productRelations = ['category'];
        try {
            $product->load('volumePrices');
            $productRelations[] = 'volumePrices';
        } catch (\Exception $e) {}

        $reviews = [];
        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('reviews')) {
                $reviews = \App\Models\Review::with('user')
                    ->where('product_id', $product->id)
                    ->where('is_approved', true)
                    ->latest()
                    ->get();
            }
        } catch (\Exception $e) {}

        return Inertia::render('ProductShow', [
            'product' => $product->load('category'),
            'relatedProducts' => $relatedProducts,
            'reviews' => $reviews,
        ]);
    }

    public function compare(Request $request)
    {
        $ids = collect(explode(',', $request->input('ids', '')))
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->take(4)
            ->toArray();

        $products = Product::with('category')
            ->whereIn('id', $ids)
            ->where('is_active', true)
            ->get();

        return Inertia::render('Compare', [
            'products' => $products,
        ]);
    }
}
