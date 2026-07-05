<?php

use App\Http\Controllers\Api\ApplicationApiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardApiController;
use App\Http\Controllers\Api\MaterialApiController;
use App\Http\Controllers\Api\ModuleApiController;
use App\Http\Controllers\Api\PreferenceApiController;
use App\Http\Controllers\Api\ProjectApiController;
use App\Http\Controllers\Api\TaskApiController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::patch('/preferences/sound', [PreferenceApiController::class, 'updateSound']);

    Route::get('/dashboard', [DashboardApiController::class, 'index']);

    Route::get('/tasks', [TaskApiController::class, 'index']);
    Route::post('/tasks', [TaskApiController::class, 'store']);
    Route::patch('/tasks/{task}', [TaskApiController::class, 'update']);
    Route::delete('/tasks/{task}', [TaskApiController::class, 'destroy']);

    Route::get('/modules', [ModuleApiController::class, 'index']);
    Route::post('/modules', [ModuleApiController::class, 'store']);
    Route::get('/modules/{module}', [ModuleApiController::class, 'show']);
    Route::patch('/modules/{module}', [ModuleApiController::class, 'update']);
    Route::delete('/modules/{module}', [ModuleApiController::class, 'destroy']);
    Route::post('/modules/{module}/lessons', [ModuleApiController::class, 'storeLesson']);
    Route::patch('/lessons/{lesson}', [ModuleApiController::class, 'updateLesson']);
    Route::delete('/lessons/{lesson}', [ModuleApiController::class, 'destroyLesson']);
    Route::post('/modules/{module}/time-logs', [ModuleApiController::class, 'storeTimeLog']);
    Route::delete('/time-logs/{timeLog}', [ModuleApiController::class, 'destroyTimeLog']);

    Route::get('/applications', [ApplicationApiController::class, 'index']);
    Route::post('/applications', [ApplicationApiController::class, 'store']);
    Route::patch('/applications/{application}', [ApplicationApiController::class, 'update']);
    Route::patch('/applications/{application}/move', [ApplicationApiController::class, 'move']);
    Route::post('/applications/{application}/events', [ApplicationApiController::class, 'storeEvent']);
    Route::delete('/applications/{application}', [ApplicationApiController::class, 'destroy']);

    Route::get('/materials', [MaterialApiController::class, 'index']);
    Route::post('/materials', [MaterialApiController::class, 'store']);
    Route::post('/materials/{studyMaterial}', [MaterialApiController::class, 'update']); // POST + multipart for file replace
    Route::get('/materials/{studyMaterial}/download', [MaterialApiController::class, 'download']);
    Route::delete('/materials/{studyMaterial}', [MaterialApiController::class, 'destroy']);

    Route::get('/projects', [ProjectApiController::class, 'index']);
    Route::post('/projects', [ProjectApiController::class, 'store']);
    Route::patch('/projects/{project}', [ProjectApiController::class, 'update']);
    Route::delete('/projects/{project}', [ProjectApiController::class, 'destroy']);
});
