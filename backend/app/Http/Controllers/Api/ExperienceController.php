<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use App\Support\HandlesUploads;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    use HandlesUploads;

    public function index()
    {
        return response()->json(
            Experience::query()->orderBy('sort_order')->orderByDesc('id')->get()
        );
    }

    public function store(Request $request)
    {
        return response()->json($this->save(new Experience, $request), 201);
    }

    public function update(Request $request, Experience $experience)
    {
        return response()->json($this->save($experience, $request));
    }

    public function destroy(Experience $experience)
    {
        $this->deleteUpload($experience->thumbnail);
        $experience->delete();

        return response()->json(['message' => 'Deleted']);
    }

    private function save(Experience $experience, Request $request): Experience
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['nullable', 'boolean'],
            'thumbnail' => ['nullable', 'image', 'max:4096'],
        ]);

        $experience->fill([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'sort_order' => (int) ($data['sort_order'] ?? 0),
            'is_published' => $request->boolean('is_published', $experience->exists ? $experience->is_published : true),
        ]);

        if ($request->hasFile('thumbnail')) {
            $this->deleteUpload($experience->thumbnail);
            $experience->thumbnail = $this->storeUpload($request->file('thumbnail'), 'experiences');
        }

        $experience->save();

        return $experience;
    }
}
