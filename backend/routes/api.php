<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\PublicPortfolioController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\SocialLinkController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Support\Facades\Route;

Route::get('/public/portfolio', [PublicPortfolioController::class, 'show']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/password', [AuthController::class, 'updatePassword']);

    Route::get('/stats', [DashboardController::class, 'stats']);
    Route::post('/upload', [DashboardController::class, 'upload']);

    Route::get('/settings', [SettingController::class, 'show']);
    Route::post('/settings', [SettingController::class, 'update']);

    Route::apiResource('projects', ProjectController::class);
    Route::post('projects/{project}', [ProjectController::class, 'update']);
    Route::apiResource('testimonials', TestimonialController::class)->except(['show']);
    Route::post('testimonials/{testimonial}', [TestimonialController::class, 'update']);
    Route::apiResource('experiences', ExperienceController::class)->except(['show']);
    Route::post('experiences/{experience}', [ExperienceController::class, 'update']);
    Route::apiResource('social-links', SocialLinkController::class)->except(['show']);
});
