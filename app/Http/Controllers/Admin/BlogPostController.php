<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Traits\OptimizesImages;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BlogPostController extends Controller
{
    use OptimizesImages;

    public function index()
    {
        return Inertia::render('Admin/Blog/Index', [
            'posts' => BlogPost::with('author')->latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Blog/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'category' => 'required|string|max:50',
            'tags' => 'nullable|array',
            'image' => 'nullable|image|max:2048',
            'is_published' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . rand(1000, 9999);
        $validated['user_id'] = auth()->id();

        if ($request->hasFile('image')) {
            $validated['image_path'] = $this->optimizeAndStore($request->file('image'), 'blog', 1600, 82);
        }

        if ($request->boolean('is_published')) {
            $validated['published_at'] = now();
        }

        BlogPost::create($validated);

        return redirect()->route('admin.blog.index')->with('success', 'Artículo creado.');
    }

    public function edit(BlogPost $post)
    {
        return Inertia::render('Admin/Blog/Edit', [
            'post' => $post,
        ]);
    }

    public function update(Request $request, BlogPost $post)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'category' => 'required|string|max:50',
            'tags' => 'nullable|array',
            'image' => 'nullable|image|max:2048',
            'is_published' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $this->deleteOptimizedImage($post->image_path);
            $validated['image_path'] = $this->optimizeAndStore($request->file('image'), 'blog', 1600, 82);
        }

        if ($request->boolean('is_published') && !$post->published_at) {
            $validated['published_at'] = now();
        }

        $validated['slug'] = Str::slug($validated['title']) . '-' . $post->id;
        $post->update($validated);

        return redirect()->route('admin.blog.index')->with('success', 'Artículo actualizado.');
    }

    public function destroy(BlogPost $post)
    {
        $this->deleteOptimizedImage($post->image_path);
        $post->delete();
        return redirect()->back()->with('success', 'Artículo eliminado.');
    }
}
