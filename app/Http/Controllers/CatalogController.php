<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
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

        return Inertia::render('Catalog', [
            'products' => $query->latest()->paginate(12)->withQueryString(),
            'categories' => Category::all(),
            'filters' => $request->only(['category', 'search'])
        ]);
    }

    public function show(Product $product)
    {
        if (!$product->is_active && !auth()->user()?->isAdmin()) {
            abort(404);
        }

        return Inertia::render('ProductShow', [
            'product' => $product->load('category')
        ]);
    }
}
