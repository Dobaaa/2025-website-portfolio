<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('short_description')->nullable();
            $table->longText('details')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('live_url')->nullable();
            $table->string('github_url')->nullable();
            $table->enum('access_type', ['public', 'confidential'])->default('public');
            $table->text('confidential_message')->nullable();
            $table->json('technologies')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
