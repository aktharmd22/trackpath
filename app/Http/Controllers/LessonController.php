<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLessonRequest;
use App\Http\Requests\UpdateLessonRequest;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Http\RedirectResponse;

class LessonController extends Controller
{
    public function store(StoreLessonRequest $request, Module $module): RedirectResponse
    {
        $module->lessons()->create([
            'title' => $request->validated()['title'],
            'is_checkpoint' => $request->validated()['is_checkpoint'] ?? false,
            'order' => (int) $module->lessons()->max('order') + 1,
        ]);

        $this->syncModuleStatus($module);

        return back();
    }

    public function update(UpdateLessonRequest $request, Lesson $lesson): RedirectResponse
    {
        $lesson->update($request->validated());

        $this->syncModuleStatus($lesson->module);

        return back();
    }

    public function destroy(Lesson $lesson): RedirectResponse
    {
        $module = $lesson->module;
        $lesson->delete();

        $this->syncModuleStatus($module);

        return back();
    }

    /** Keep the parent module's status in step with its lessons. */
    private function syncModuleStatus(Module $module): void
    {
        $done = $module->lessons()->where('status', 'done')->count();
        $total = $module->lessons()->count();

        $module->update([
            'status' => match (true) {
                $total === 0, $done === 0 => 'not_started',
                $done === $total => 'done',
                default => 'in_progress',
            },
        ]);
    }
}
