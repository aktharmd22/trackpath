<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Http\JsonResponse;

class TaskApiController extends Controller
{
    public function index(): JsonResponse
    {
        $tasks = Task::query()
            ->orderByRaw('completed_at is not null')
            ->orderByRaw('due_on is null')
            ->orderBy('due_on')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Task $task) => $this->serialize($task));

        return response()->json([
            'tasks' => $tasks,
            'priorities' => Task::PRIORITIES,
        ]);
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = Task::create($request->validated());

        return response()->json(['task' => $this->serialize($task)], 201);
    }

    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $validated = $request->validated();

        if (array_key_exists('completed', $validated)) {
            $task->completed_at = $validated['completed'] ? now() : null;
            unset($validated['completed']);
        }

        $task->fill($validated)->save();

        return response()->json(['task' => $this->serialize($task->fresh())]);
    }

    public function destroy(Task $task): JsonResponse
    {
        $task->delete();

        return response()->json(['ok' => true]);
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
