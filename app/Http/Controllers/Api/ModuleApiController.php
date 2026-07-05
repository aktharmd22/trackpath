<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTimeLogRequest;
use App\Http\Requests\UpdateLessonRequest;
use App\Http\Requests\UpdateModuleRequest;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\TimeLog;
use Illuminate\Http\JsonResponse;

class ModuleApiController extends Controller
{
    public function index(): JsonResponse
    {
        $modules = Module::query()
            ->withCount([
                'lessons',
                'lessons as done_lessons_count' => fn ($query) => $query->where('status', 'done'),
            ])
            ->withSum('timeLogs as time_logs_sum_minutes', 'minutes')
            ->orderBy('order')
            ->get()
            ->map(fn (Module $module) => [
                'id' => $module->id,
                'title' => $module->title,
                'slug' => $module->slug,
                'order' => $module->order,
                'status' => $module->status,
                'target_hours' => $module->target_hours,
                'lessons_count' => $module->lessons_count,
                'done_lessons_count' => $module->done_lessons_count,
                'progress' => $module->progressPercent(),
                'minutes_logged' => $module->minutesLogged(),
            ]);

        return response()->json(['modules' => $modules]);
    }

    public function show(Module $module): JsonResponse
    {
        $module->load(['lessons', 'timeLogs' => fn ($query) => $query->latest('logged_on')->limit(20)]);
        $module->loadCount([
            'lessons',
            'lessons as done_lessons_count' => fn ($query) => $query->where('status', 'done'),
        ]);

        return response()->json([
            'module' => [
                'id' => $module->id,
                'title' => $module->title,
                'slug' => $module->slug,
                'order' => $module->order,
                'status' => $module->status,
                'notes' => $module->notes,
                'target_hours' => $module->target_hours,
                'progress' => $module->progressPercent(),
                'minutes_logged' => (int) $module->timeLogs()->sum('minutes'),
                'lessons' => $module->lessons->map(fn ($lesson) => [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'status' => $lesson->status,
                    'is_checkpoint' => $lesson->is_checkpoint,
                ]),
                'time_logs' => $module->timeLogs->map(fn ($log) => [
                    'id' => $log->id,
                    'minutes' => $log->minutes,
                    'logged_on' => $log->logged_on->toDateString(),
                    'note' => $log->note,
                ]),
            ],
            'statuses' => Module::STATUSES,
        ]);
    }

    public function update(UpdateModuleRequest $request, Module $module): JsonResponse
    {
        $module->update($request->validated());

        return response()->json(['ok' => true]);
    }

    public function updateLesson(UpdateLessonRequest $request, Lesson $lesson): JsonResponse
    {
        $lesson->update($request->validated());

        $module = $lesson->module;
        $done = $module->lessons()->where('status', 'done')->count();
        $total = $module->lessons()->count();

        $module->update([
            'status' => match (true) {
                $done === 0 => 'not_started',
                $done === $total => 'done',
                default => 'in_progress',
            },
        ]);

        return response()->json(['ok' => true]);
    }

    public function storeTimeLog(StoreTimeLogRequest $request, Module $module): JsonResponse
    {
        $log = $module->timeLogs()->create($request->validated());

        return response()->json(['id' => $log->id], 201);
    }

    public function destroyTimeLog(TimeLog $timeLog): JsonResponse
    {
        $timeLog->delete();

        return response()->json(['ok' => true]);
    }
}
