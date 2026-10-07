<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Support\HandlesUploads;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    use HandlesUploads;

    public function show()
    {
        return response()->json(SiteSetting::current());
    }

    public function update(Request $request)
    {
        $setting = SiteSetting::current();

        $data = $request->validate([
            'hero_label' => ['nullable', 'string', 'max:255'],
            'hero_title' => ['nullable', 'string', 'max:255'],
            'hero_subtitle' => ['nullable', 'string'],
            'footer_heading' => ['nullable', 'string', 'max:255'],
            'footer_text' => ['nullable', 'string'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'copyright_text' => ['nullable', 'string', 'max:255'],
            'confidential_default_message' => ['nullable', 'string'],
            'hero_image' => ['nullable', 'image', 'max:8192'],
            'cv' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:12288'],
        ]);

        unset($data['hero_image'], $data['cv']);
        $setting->fill($data);

        if ($request->hasFile('hero_image')) {
            $this->deleteUpload($setting->hero_image);
            $setting->hero_image = $this->storeUpload($request->file('hero_image'), 'hero');
        }

        if ($request->hasFile('cv')) {
            $this->deleteUpload($setting->cv_path);
            $file = $request->file('cv');
            $setting->cv_path = $this->storeUpload($file, 'cv');
            $setting->cv_original_name = $file->getClientOriginalName();
        }

        $setting->save();

        return response()->json($setting);
    }
}
