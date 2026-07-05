<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function index(): Response
    {
        $tasks = Task::query()
            ->orderByRaw('completed_at is not null') // open tasks first
            ->orderByRaw('due_on is null')           // dated before undated
            ->orderBy('due_on')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Task $task) => $this->serialize($task));

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'priorities' => Task::PRIORITIES,
        ]);
    }

    public function store(StoreTaskRequest $request): RedirectResponse
    {
        Task::create($request->validated());

        return back();
    }

    public function update(UpdateTaskRequest $request, Task $task): RedirectResponse
    {
        $validated = $request->validated();

        if (array_key_exists('completed', $validated)) {
            $task->completed_at = $validated['completed'] ? now() : null;
            unset($validated['completed']);
        }

        $task->fill($validated)->save();

        return back();
    }

    public function destroy(Task $task): RedirectResponse
    {
        $task->delete();

        return back();
    }

    private function serialize(Task $task): array
    {
        return [
            'id' => $task->id,
            'title' => $task->title,
            'notes' => $task->notes,
            'due_on' => $task->due_on?->toDateString(),
            'priority' => $task->priority,
            'completed' => $task->completed_at !== null,
            'overdue' => $task->isOverdue(),
        ];
    }
}
