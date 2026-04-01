<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index()
    {
        $products = Product::where('is_active', true)->select('slug', 'updated_at')->get();
        $categories = Category::select('slug', 'updated_at')->get();

        $content = view('sitemap', compact('products', 'categories'))->render();

        return response($content, 200)->header('Content-Type', 'text/xml');
    }
}
