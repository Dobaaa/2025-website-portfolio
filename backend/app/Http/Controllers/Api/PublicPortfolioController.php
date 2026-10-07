<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\SocialLink;
use App\Models\Testimonial;

class PublicPortfolioController extends Controller
{
    public function show()
    {
        $settings = SiteSetting::current();

        $projects = Project::query()
            ->with('images')
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Project $project) => $project->popup_payload);

        return response()->json([
            'settings' => $settings,
            'projects' => $projects,
            'testimonials' => Testimonial::query()
                ->where('is_published', true)
                ->orderBy('sort_order')
                ->get(),
            'experiences' => Experience::query()
                ->where('is_published', true)
                ->orderBy('sort_order')
                ->get(),
            'social_links' => SocialLink::query()
                ->where('is_published', true)
                ->orderBy('sort_order')
                ->get(),
        ])->header('Cache-Control', 'no-store, no-cache, must-revalidate');
    }
}
