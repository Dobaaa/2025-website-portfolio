<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'title',
        'short_description',
        'details',
        'cover_image',
        'live_url',
        'github_url',
        'access_type',
        'confidential_message',
        'technologies',
        'sort_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'technologies' => 'array',
            'is_published' => 'boolean',
        ];
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProjectImage::class)->orderBy('sort_order');
    }

    public function getPopupPayloadAttribute(): array
    {
        $isConfidential = $this->access_type === 'confidential';

        return [
            'id' => $this->id,
            'title' => $this->title,
            'short_description' => $this->short_description,
            'details' => $this->details,
            'cover_image' => $this->cover_image,
            'images' => $this->images->map(fn (ProjectImage $image) => [
                'id' => $image->id,
                'image_path' => $image->image_path,
                'caption' => $image->caption,
            ])->values(),
            'technologies' => $this->technologies ?? [],
            'access_type' => $this->access_type,
            'can_open_live' => ! $isConfidential && filled($this->live_url),
            'live_url' => $isConfidential ? null : $this->live_url,
            'github_url' => $isConfidential ? null : $this->github_url,
            'confidential_message' => $isConfidential
                ? ($this->confidential_message ?: SiteSetting::current()->confidential_default_message)
                : null,
        ];
    }
}
