<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BannerController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Banners/Index', [
            'banners' => Banner::orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'button_text' => 'nullable|string|max:100',
            'button_url' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:4096',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('banners', 'public');
        }
        unset($validated['image']);

        Banner::create($validated);

        return back()->with('success', 'Banner creado exitosamente.');
    }

    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'button_text' => 'nullable|string|max:100',
            'button_url' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:4096',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('banners', 'public');
        }
        unset($validated['image']);

        $banner->update($validated);

        return back()->with('success', 'Banner actualizado.');
    }

    public function destroy(Banner $banner)
    {
        $banner->delete();
        return back()->with('success', 'Banner eliminado.');
    }
}
