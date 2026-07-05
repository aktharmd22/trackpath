<?php

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\ApplicationEventController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\PreferenceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\StudyMaterialController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TimeLogController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Learning
    Route::get('/learning', [ModuleController::class, 'index'])->name('learning.index');
    Route::get('/learning/{module:slug}', [ModuleController::class, 'show'])->name('learning.show');
    Route::post('/modules', [ModuleController::class, 'store'])->name('modules.store');
    Route::patch('/modules/{module}', [ModuleController::class, 'update'])->name('modules.update');
    Route::delete('/modules/{module}', [ModuleController::class, 'destroy'])->name('modules.destroy');
    Route::post('/modules/{module}/lessons', [LessonController::class, 'store'])->name('lessons.store');
    Route::patch('/lessons/{lesson}', [LessonController::class, 'update'])->name('lessons.update');
    Route::delete('/lessons/{lesson}', [LessonController::class, 'destroy'])->name('lessons.destroy');
    Route::post('/modules/{module}/time-logs', [TimeLogController::class, 'store'])->name('time-logs.store');
    Route::delete('/time-logs/{timeLog}', [TimeLogController::class, 'destroy'])->name('time-logs.destroy');

    // Jobs
    Route::get('/jobs', [ApplicationController::class, 'index'])->name('jobs.index');
    Route::get('/applications/export', [ApplicationController::class, 'export'])->name('applications.export');
    Route::post('/applications', [ApplicationController::class, 'store'])->name('applications.store');
    Route::patch('/applications/{application}', [ApplicationController::class, 'update'])->name('applications.update');
    Route::patch('/applications/{application}/move', [ApplicationController::class, 'move'])->name('applications.move');
    Route::delete('/applications/{application}', [ApplicationController::class, 'destroy'])->name('applications.destroy');
    Route::post('/applications/{application}/events', [ApplicationEventController::class, 'store'])->name('application-events.store');

    // Exam prep (subjects)
    Route::get('/exam-prep', [SubjectController::class, 'index'])->name('exam-prep.index');
    Route::get('/exam-prep/{subject}', [SubjectController::class, 'show'])->name('exam-prep.show');
    Route::post('/subjects', [SubjectController::class, 'store'])->name('subjects.store');
    Route::patch('/subjects/{subject}', [SubjectController::class, 'update'])->name('subjects.update');
    Route::delete('/subjects/{subject}', [SubjectController::class, 'destroy'])->name('subjects.destroy');

    // Materials
    Route::get('/materials', [StudyMaterialController::class, 'index'])->name('materials.index');
    Route::post('/materials', [StudyMaterialController::class, 'store'])->name('materials.store');
    Route::patch('/materials/{studyMaterial}', [StudyMaterialController::class, 'update'])->name('materials.update');
    Route::get('/materials/{studyMaterial}/download', [StudyMaterialController::class, 'download'])->name('materials.download');
    Route::get('/materials/{studyMaterial}/preview', [StudyMaterialController::class, 'preview'])->name('materials.preview');
    Route::delete('/materials/{studyMaterial}', [StudyMaterialController::class, 'destroy'])->name('materials.destroy');

    // Tasks
    Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::patch('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');

    // Preferences
    Route::patch('/preferences/sound', [PreferenceController::class, 'updateSound'])->name('preferences.sound');

    // Projects
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::patch('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');
});

// Signed URLs for the mobile app — no session, validity comes from the signature.
Route::middleware('signed')->group(function () {
    Route::get('/shared/materials/{studyMaterial}/preview', [StudyMaterialController::class, 'preview'])->name('shared.materials.preview');
    Route::get('/shared/materials/{studyMaterial}/download', [StudyMaterialController::class, 'download'])->name('shared.materials.download');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
