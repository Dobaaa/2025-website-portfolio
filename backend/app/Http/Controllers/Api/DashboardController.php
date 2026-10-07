<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use App\Models\Project;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'projects' => Project::query()->count(),
            'published_projects' => Project::query()->where('is_published', true)->count(),
            'confidential_projects' => Project::query()->where('access_type', 'confidential')->count(),
            'testimonials' => Testimonial::query()->count(),
            'experiences' => Experience::query()->count(),
            'cv_uploaded' => File::exists(public_path(ltrim((string) optional(\App\Models\SiteSetting::current())->cv_path, '/'))) && filled(optional(\App\Models\SiteSetting::current())->cv_path),
        ]);
    }

    public function upload(Request $request)
    {
        $data = $request->validate([
            'file' => ['required', 'file', 'max:12288', 'mimes:jpg,jpeg,png,webp,svg,pdf'],
            'folder' => ['nullable', 'string', 'max:40'],
        ]);

        $controller = new class {
            use \App\Support\HandlesUploads;

            public function store($file, $folder)
            {
                return $this->storeUpload($file, $folder);
            }
        };

        $path = $controller->store($data['file'], $data['folder'] ?? 'misc');

        return response()->json(['path' => $path]);
    }
}
