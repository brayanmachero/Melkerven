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
            'volume_prices' => 'nullable|array',
            'volume_prices.*.min_quantity' => 'required|integer|min:1',
            'volume_prices.*.max_quantity' => 'nullable|integer|min:1',
            'volume_prices.*.price' => 'required|numeric|min:0',
            'variants' => 'nullable|array',
            'variants.*.name' => 'required|string|max:255',
            'variants.*.sku' => 'nullable|string|max:100',
            'variants.*.price_adjustment' => 'required|numeric',
            'variants.*.stock' => 'required|integer|min:0',
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

        $volumePrices = $validated['volume_prices'] ?? [];
        $variants = $validated['variants'] ?? [];
        unset($validated['volume_prices'], $validated['variants']);

        $product = Product::create($validated);

        foreach ($volumePrices as $tier) {
            $product->volumePrices()->create($tier);
        }
        foreach ($variants as $variant) {
            $product->variants()->create($variant);
        }

        \App\Models\ActivityLog::log('product.created', "Producto creado: {$product->name}", $product);

        return redirect()->route('admin.products.index')->with('success', 'Producto creado correctamente.');
    }

    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product->load('volumePrices'),
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
            'volume_prices' => 'nullable|array',
            'volume_prices.*.min_quantity' => 'required|integer|min:1',
            'volume_prices.*.max_quantity' => 'nullable|integer|min:1',
            'volume_prices.*.price' => 'required|numeric|min:0',
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

        $volumePrices = $validated['volume_prices'] ?? [];
        unset($validated['volume_prices']);

        $product->update($validated);

        $product->volumePrices()->delete();
        foreach ($volumePrices as $tier) {
            $product->volumePrices()->create($tier);
        }

        \App\Models\ActivityLog::log('product.updated', "Producto actualizado: {$product->name}", $product);

        return redirect()->route('admin.products.index')->with('success', 'Producto actualizado.');
    }

    public function destroy(Product $product)
    {
        \App\Models\ActivityLog::log('product.deleted', "Producto eliminado: {$product->name}", $product);
        $product->delete();
        return redirect()->back()->with('success', 'Producto eliminado.');
    }

    public function exportCsv()
    {
        $products = Product::with('category')->get();

        $callback = function () use ($products) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Activo', 'Cotizable', 'Garantía', 'Descripción']);

            foreach ($products as $product) {
                fputcsv($file, [
                    $product->id,
                    $product->name,
                    $product->category?->name ?? '',
                    $product->price,
                    $product->stock,
                    $product->is_active ? 'Sí' : 'No',
                    $product->is_quotable ? 'Sí' : 'No',
                    $product->warranty ?? '',
                    strip_tags($product->description),
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="productos_' . date('Y-m-d') . '.csv"',
        ]);
    }

    public function importCsv(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        $file = $request->file('csv_file');
        $handle = fopen($file->getRealPath(), 'r');
        $header = fgetcsv($handle); // Skip header row

        $imported = 0;
        $errors = [];

        while (($row = fgetcsv($handle)) !== false) {
            try {
                $categoryName = $row[1] ?? null;
                $category = $categoryName ? Category::firstOrCreate(['name' => $categoryName], ['slug' => Str::slug($categoryName)]) : null;

                Product::updateOrCreate(
                    ['name' => $row[0]],
                    [
                        'slug' => Str::slug($row[0]) . '-' . rand(1000, 9999),
                        'category_id' => $category?->id,
                        'price' => (float) ($row[2] ?? 0),
                        'stock' => (int) ($row[3] ?? 0),
                        'description' => $row[4] ?? '',
                        'is_active' => true,
                    ]
                );
                $imported++;
            } catch (\Exception $e) {
                $errors[] = "Fila " . ($imported + count($errors) + 2) . ": " . $e->getMessage();
            }
        }
        fclose($handle);

        \App\Models\ActivityLog::log('products.imported', "Importación CSV: {$imported} productos importados");

        $message = "{$imported} productos importados correctamente.";
        if (count($errors) > 0) {
            $message .= " " . count($errors) . " errores encontrados.";
        }

        return redirect()->route('admin.products.index')->with('success', $message);
    }
}
