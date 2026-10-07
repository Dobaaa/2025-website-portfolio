<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/admin');
});

Route::get('/admin/{any?}', function () {
    $index = public_path('admin/index.html');

    if (! file_exists($index)) {
        return response(
            'Dashboard is not built yet. From the dashboard folder run: npm install && npm run build',
            503
        );
    }

    return response()->file($index);
})->where('any', '.*');
