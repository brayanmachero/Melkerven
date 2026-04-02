<?php

namespace App\Traits;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait OptimizesImages
{
    /**
     * Optimize and store an uploaded image.
     * Creates both a full-size optimized version and a thumbnail.
     */
    protected function optimizeAndStore(UploadedFile $file, string $directory = 'products', int $maxWidth = 1200, int $quality = 80): string
    {
        try {
            $manager = new ImageManager(new Driver());
            $image = $manager->read($file->getPathname());

            // Resize if wider than max width, maintaining aspect ratio
            if ($image->width() > $maxWidth) {
                $image->scaleDown(width: $maxWidth);
            }

            // Generate unique filename
            $filename = Str::uuid() . '.webp';
            $path = $directory . '/' . $filename;

            // Encode to WebP for better compression
            $encoded = $image->toWebp($quality);
            Storage::disk('public')->put($path, (string) $encoded);

            // Create thumbnail (300px wide)
            $image->scaleDown(width: 300);
            $thumbPath = $directory . '/thumbs/' . $filename;
            $thumbEncoded = $image->toWebp(70);
            Storage::disk('public')->put($thumbPath, (string) $thumbEncoded);

            return $path;
        } catch (\Exception $e) {
            // Fallback: store without optimization
            return $file->store($directory, 'public');
        }
    }
}
