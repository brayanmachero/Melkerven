<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class BlogPost extends Model
{
    protected $fillable = [
        'user_id', 'title', 'slug', 'excerpt', 'content',
        'image_path', 'category', 'tags', 'is_published', 'published_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'tags' => 'json',
        'published_at' => 'datetime',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return $this->image_path ? asset('storage/' . $this->image_path) : null;
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true)->whereNotNull('published_at')->where('published_at', '<=', now());
    }
}
