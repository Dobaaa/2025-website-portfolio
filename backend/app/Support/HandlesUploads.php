<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

trait HandlesUploads
{
    protected function storeUpload(?UploadedFile $file, string $folder = 'misc'): ?string
    {
        if (! $file) {
            return null;
        }

        $directory = public_path('uploads/'.$folder);

        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $name = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
        $file->move($directory, $name);

        return '/uploads/'.$folder.'/'.$name;
    }

    protected function deleteUpload(?string $path): void
    {
        if (! $path) {
            return;
        }

        $relative = ltrim(parse_url($path, PHP_URL_PATH) ?: $path, '/');
        $full = public_path($relative);
        $uploadsRoot = realpath(public_path('uploads'));
        $resolved = realpath($full);

        if ($uploadsRoot && $resolved && str_starts_with($resolved, $uploadsRoot) && is_file($resolved)) {
            unlink($resolved);
        }
    }
}
