<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->date('exam_on')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::table('study_materials', function (Blueprint $table) {
            $table->foreignId('subject_id')->nullable()->after('module_id')->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('study_materials', function (Blueprint $table) {
            $table->dropConstrainedForeignId('subject_id');
        });

        Schema::dropIfExists('subjects');
    }
};
