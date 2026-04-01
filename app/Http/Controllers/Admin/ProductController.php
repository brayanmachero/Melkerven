<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->latest();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        if ($request->has('is_active') && $request->input('is_active') !== '') {
            $query->where('is_active', $request->boolean('is_active'));
        }

        return Inertia::render('Admin/Products/Index', [
            'products' => $query->get(),
            'categories' => Category::all(),
            'filters' => $request->only(['search', 'category_id', 'is_active']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Create', [
            'categories' => Category::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
            'additional_images' => 'nullable|array|max:5',
            'additional_images.*' => 'image|max:2048',
            'is_active' => 'boolean',
            'is_quotable' => 'boolean',
            'warranty' => 'nullable|string|max:50',
            'specifications' => 'nullable|array',
            'specifications.*.label' => 'required|string|max:100',
            'specifications.*.value' => 'required|string|max:255',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image_path'] = $path;
        }

        // Handle additional gallery images
        if ($request->hasFile('additional_images')) {
            $imagePaths = [];
            foreach ($request->file('additional_images') as $img) {
                $imagePaths[] = $img->store('products', 'public');
            }
            $validated['images'] = $imagePaths;
        }

        $validated['slug'] = Str::slug($validated['name']) . '-' . rand(1000, 9999);

        $product = Product::create($validated);

        \App\Models\ActivityLog::log('product.created', "Producto creado: {$product->name}", $product);

        return redirect()->route('admin.products.index')->with('success', 'Producto creado correctamente.');
    }

    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => Category::all()
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
            'additional_images' => 'nullable|array|max:5',
            'additional_images.*' => 'image|max:2048',
            'remove_gallery_images' => 'nullable|array',
            'is_active' => 'boolean',
            'is_quotable' => 'boolean',
            'warranty' => 'nullable|string|max:50',
            'specifications' => 'nullable|array',
            'specifications.*.label' => 'required|string|max:100',
            'specifications.*.value' => 'required|string|max:255',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image_path) {
                Storage::disk('public')->delete($product->image_path);
            }
            $path = $request->file('image')->store('products', 'public');
            $validated['image_path'] = $path;
        }

        // Handle gallery images
        $existingImages = $product->images ?? [];
        if ($request->remove_gallery_images) {
            foreach ($request->remove_gallery_images as $removeImg) {
                Storage::disk('public')->delete($removeImg);
                $existingImages = array_values(array_filter($existingImages, fn($i) => $i !== $removeImg));
            }
        }
        if ($request->hasFile('additional_images')) {
            foreach ($request->file('additional_images') as $img) {
                $existingImages[] = $img->store('products', 'public');
            }
        }
        $validated['images'] = $existingImages;

        $validated['slug'] = Str::slug($validated['name']) . '-' . $product->id;

        $product->update($validated);

        \App\Models\ActivityLog::log('product.updated', "Producto actualizado: {$product->name}", $product);

        return redirect()->route('admin.products.index')->with('success', 'Producto actualizado.');
    }

    public function destroy(Product $product)
    {
        \App\Models\ActivityLog::log('product.deleted', "Producto eliminado: {$product->name}", $product);
        $product->delete();
        return redirect()->back()->with('success', 'Producto eliminado.');
    }
}
