<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateLessonRequest;
use App\Models\Lesson;
use Illuminate\Http\RedirectResponse;

class LessonController extends Controller
{
    public function update(UpdateLessonRequest $request, Lesson $lesson): RedirectResponse
    {
        $lesson->update($request->validated());

        // Keep the parent module's status in step with its lessons.
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

        return back();
    }
}
