<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = BlogPost::with('author')->published()->latest('published_at');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', $search)->orWhere('excerpt', 'like', $search);
            });
        }

        return Inertia::render('Blog/Index', [
            'posts' => $query->paginate(9)->withQueryString(),
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    public function show(BlogPost $post)
    {
        if (!$post->is_published && !auth()->user()?->isAdmin()) {
            abort(404);
        }

        $relatedPosts = BlogPost::published()
            ->where('id', '!=', $post->id)
            ->where('category', $post->category)
            ->latest('published_at')
            ->limit(3)
            ->get();

        return Inertia::render('Blog/Show', [
            'post' => $post->load('author'),
            'relatedPosts' => $relatedPosts,
        ]);
    }
}
