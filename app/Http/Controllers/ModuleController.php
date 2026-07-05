<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreModuleRequest;
use App\Http\Requests\UpdateModuleRequest;
use App\Models\Module;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ModuleController extends Controller
{
    public function index(): Response
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

        return Inertia::render('Learning/Index', [
            'modules' => $modules,
        ]);
    }

    public function show(Module $module): Response
    {
        $module->load(['lessons', 'timeLogs' => fn ($query) => $query->latest('logged_on')->limit(20)]);
        $module->loadCount([
            'lessons',
            'lessons as done_lessons_count' => fn ($query) => $query->where('status', 'done'),
        ]);

        return Inertia::render('Learning/Show', [
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

    public function store(StoreModuleRequest $request): RedirectResponse
    {
        Module::create([
            ...$request->validated(),
            'slug' => self::uniqueSlug($request->validated()['title']),
            'order' => (int) Module::max('order') + 1,
            'target_hours' => $request->validated()['target_hours'] ?? 0,
        ]);

        return back()->with('success', 'Module added.');
    }

    public function update(UpdateModuleRequest $request, Module $module): RedirectResponse
    {
        $module->update($request->validated());

        return back();
    }

    public function destroy(Module $module): RedirectResponse
    {
        $module->delete();

        return redirect()->route('learning.index')->with('success', 'Module removed.');
    }

    public static function uniqueSlug(string $title): string
    {
        $base = Str::slug($title) ?: 'module';
        $slug = $base;
        $suffix = 2;

        while (Module::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
