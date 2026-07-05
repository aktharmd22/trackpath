<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->string('company');
            $table->string('role_title');
            $table->string('status')->default('saved'); // saved|applied|interview|offer|rejected
            $table->unsignedInteger('salary_min')->nullable();
            $table->unsignedInteger('salary_max')->nullable();
            $table->string('currency', 3)->default('AED');
            $table->string('location')->nullable();
            $table->string('source')->nullable();
            $table->string('url')->nullable();
            $table->date('applied_at')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedInteger('order')->default(0); // kanban position within column
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
