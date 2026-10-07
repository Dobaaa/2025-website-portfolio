<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use App\Support\HandlesUploads;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    use HandlesUploads;

    public function index()
    {
        return response()->json(
            Testimonial::query()->orderBy('sort_order')->orderByDesc('id')->get()
        );
    }

    public function store(Request $request)
    {
        return response()->json($this->save(new Testimonial, $request), 201);
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        return response()->json($this->save($testimonial, $request));
    }

    public function destroy(Testimonial $testimonial)
    {
        $this->deleteUpload($testimonial->avatar);
        $testimonial->delete();

        return response()->json(['message' => 'Deleted']);
    }

    private function save(Testimonial $testimonial, Request $request): Testimonial
    {
        $data = $request->validate([
            'quote' => ['required', 'string'],
            'name' => ['required', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['nullable', 'boolean'],
            'avatar' => ['nullable', 'image', 'max:4096'],
        ]);

        $testimonial->fill([
            'quote' => $data['quote'],
            'name' => $data['name'],
            'title' => $data['title'] ?? null,
            'sort_order' => (int) ($data['sort_order'] ?? 0),
            'is_published' => $request->boolean('is_published', $testimonial->exists ? $testimonial->is_published : true),
        ]);

        if ($request->hasFile('avatar')) {
            $this->deleteUpload($testimonial->avatar);
            $testimonial->avatar = $this->storeUpload($request->file('avatar'), 'testimonials');
        }

        $testimonial->save();

        return $testimonial;
    }
}
