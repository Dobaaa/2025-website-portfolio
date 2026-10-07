<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'hero_label',
        'hero_title',
        'hero_subtitle',
        'hero_image',
        'footer_heading',
        'footer_text',
        'contact_email',
        'copyright_text',
        'cv_path',
        'cv_original_name',
        'confidential_default_message',
    ];

    public static function current(): self
    {
        return static::query()->first() ?? static::query()->create([]);
    }
}
