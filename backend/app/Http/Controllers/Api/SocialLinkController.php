<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SocialLink;
use Illuminate\Http\Request;

class SocialLinkController extends Controller
{
    public function index()
    {
        return response()->json(
            SocialLink::query()->orderBy('sort_order')->orderByDesc('id')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $link = SocialLink::query()->create($data);

        return response()->json($link, 201);
    }

    public function update(Request $request, SocialLink $socialLink)
    {
        $socialLink->update($this->validated($request, $socialLink));

        return response()->json($socialLink);
    }

    public function destroy(SocialLink $socialLink)
    {
        $socialLink->delete();

        return response()->json(['message' => 'Deleted']);
    }

    private function validated(Request $request, ?SocialLink $link = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'url' => ['required', 'url', 'max:255'],
            'icon' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        $data['sort_order'] = (int) ($data['sort_order'] ?? 0);
        $data['is_published'] = $request->boolean('is_published', $link?->is_published ?? true);

        return $data;
    }
}
