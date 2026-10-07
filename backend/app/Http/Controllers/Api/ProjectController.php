<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectImage;
use App\Support\HandlesUploads;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    use HandlesUploads;

    public function index()
    {
        $projects = Project::query()
            ->with('images')
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Project $project) => $this->serialize($project));

        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $project = new Project;
        $this->fillProject($project, $request);
        $project->save();
        $this->syncGallery($project, $request);

        return response()->json($this->serialize($project->fresh('images')), 201);
    }

    public function show(Project $project)
    {
        return response()->json($this->serialize($project->load('images')));
    }

    public function update(Request $request, Project $project)
    {
        $this->fillProject($project, $request);
        $project->save();
        $this->syncGallery($project, $request);

        return response()->json($this->serialize($project->fresh('images')));
    }

    public function destroy(Project $project)
    {
        $this->deleteUpload($project->cover_image);
        $project->images->each(fn (ProjectImage $image) => $this->deleteUpload($image->image_path));
        $project->delete();

        return response()->json(['message' => 'Deleted']);
    }

    private function fillProject(Project $project, Request $request): void
    {
        $request->merge([
            'live_url' => $request->filled('live_url') ? $request->input('live_url') : null,
            'github_url' => $request->filled('github_url') ? $request->input('github_url') : null,
            'confidential_message' => $request->filled('confidential_message') ? $request->input('confidential_message') : null,
        ]);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'short_description' => ['nullable', 'string'],
            'details' => ['nullable', 'string'],
            'live_url' => ['nullable', 'url', 'max:255'],
            'github_url' => ['nullable', 'url', 'max:255'],
            'access_type' => ['required', 'in:public,confidential'],
            'confidential_message' => ['nullable', 'string'],
            'technologies' => ['nullable'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['nullable', 'boolean'],
            'cover_image' => ['nullable', 'image', 'max:5120'],
        ]);

        $technologies = $request->input('technologies', []);
        if (is_string($technologies)) {
            $decoded = json_decode($technologies, true);
            $technologies = is_array($decoded)
                ? $decoded
                : array_values(array_filter(array_map('trim', explode(',', $technologies))));
        }

        $project->fill([
            'title' => $data['title'],
            'short_description' => $data['short_description'] ?? null,
            'details' => $data['details'] ?? null,
            'live_url' => $data['live_url'] ?? null,
            'github_url' => $data['github_url'] ?? null,
            'access_type' => $data['access_type'],
            'confidential_message' => $data['confidential_message'] ?? null,
            'technologies' => $technologies,
            'sort_order' => (int) ($data['sort_order'] ?? 0),
            'is_published' => $request->boolean('is_published', $project->exists ? $project->is_published : true),
        ]);

        if ($request->hasFile('cover_image')) {
            $this->deleteUpload($project->cover_image);
            $project->cover_image = $this->storeUpload($request->file('cover_image'), 'projects');
        }
    }

    private function syncGallery(Project $project, Request $request): void
    {
        $removed = $request->input('removed_image_ids', []);
        if (is_string($removed)) {
            $removed = json_decode($removed, true) ?: [];
        }

        if (is_array($removed) && $removed) {
            $project->images()->whereIn('id', $removed)->get()->each(function (ProjectImage $image) {
                $this->deleteUpload($image->image_path);
                $image->delete();
            });
        }

        $files = $request->file('gallery') ?: ($request->allFiles()['gallery'] ?? []);
        if (! is_array($files)) {
            $files = $files ? [$files] : [];
        }

        $nextOrder = (int) $project->images()->max('sort_order') + 1;
        foreach ($files as $file) {
            $project->images()->create([
                'image_path' => $this->storeUpload($file, 'projects/gallery'),
                'sort_order' => $nextOrder++,
            ]);
        }
    }

    private function serialize(Project $project): array
    {
        return [
            ...$project->toArray(),
            'popup' => $project->popup_payload,
        ];
    }
}
