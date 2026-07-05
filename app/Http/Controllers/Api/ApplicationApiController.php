<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MoveApplicationRequest;
use App\Http\Requests\StoreApplicationEventRequest;
use App\Http\Requests\StoreApplicationRequest;
use App\Http\Requests\UpdateApplicationRequest;
use App\Models\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ApplicationApiController extends Controller
{
    public function index(): JsonResponse
    {
        $applications = Application::query()
            ->with('events')
            ->orderBy('order')
            ->get()
            ->map(fn (Application $application) => $this->serialize($application));

        return response()->json([
            'applications' => $applications,
            'statuses' => Application::STATUSES,
        ]);
    }

    public function store(StoreApplicationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $application = DB::transaction(function () use ($validated) {
            $application = Application::create([
                ...$validated,
                'order' => Application::where('status', $validated['status'])->max('order') + 1,
            ]);

            $application->events()->create([
                'status' => $application->status,
                'note' => 'Added to the board',
                'occurred_at' => now(),
            ]);

            return $application;
        });

        return response()->json(['application' => $this->serialize($application->load('events'))], 201);
    }

    public function update(UpdateApplicationRequest $request, Application $application): JsonResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($application, $validated) {
            $statusChanged = $validated['status'] !== $application->status;

            if ($statusChanged) {
                $validated['order'] = Application::where('status', $validated['status'])->max('order') + 1;
            }

            $application->update($validated);

            if ($statusChanged) {
                $application->events()->create([
                    'status' => $application->status,
                    'note' => null,
                    'occurred_at' => now(),
                ]);
            }
        });

        return response()->json(['application' => $this->serialize($application->fresh()->load('events'))]);
    }

    public function move(MoveApplicationRequest $request, Application $application): JsonResponse
    {
        ['status' => $status, 'position' => $position] = $request->validated();

        DB::transaction(function () use ($application, $status, $position) {
            $statusChanged = $status !== $application->status;

            $column = Application::where('status', $status)
                ->whereKeyNot($application->id)
                ->orderBy('order')
                ->get();

            $column->splice(min($position, $column->count()), 0, [$application]);

            foreach ($column->values() as $index => $item) {
                Application::whereKey($item->id)->update([
                    'order' => $index + 1,
                    ...($item->is($application) ? ['status' => $status] : []),
                ]);
            }

            if ($statusChanged) {
                $application->events()->create([
                    'status' => $status,
                    'note' => null,
                    'occurred_at' => now(),
                ]);
            }
        });

        return response()->json(['application' => $this->serialize($application->fresh()->load('events'))]);
    }

    public function storeEvent(StoreApplicationEventRequest $request, Application $application): JsonResponse
    {
        $validated = $request->validated();

        $application->events()->create($validated);

        if ($validated['status'] !== $application->status) {
            $application->update([
                'status' => $validated['status'],
                'order' => Application::where('status', $validated['status'])->max('order') + 1,
            ]);
        }

        return response()->json(['application' => $this->serialize($application->fresh()->load('events'))], 201);
    }

    public function destroy(Application $application): JsonResponse
    {
        $application->delete();

        return response()->json(['ok' => true]);
    }

    private function serialize(Application $application): array
    {
        return [
            'id' => $application->id,
            'company' => $application->company,
            'role_title' => $application->role_title,
            'status' => $application->status,
            'salary_min' => $application->salary_min,
            'salary_max' => $application->salary_max,
            'currency' => $application->currency,
            'location' => $application->location,
            'source' => $application->source,
            'url' => $application->url,
            'applied_at' => $application->applied_at?->toDateString(),
            'follow_up_at' => $application->follow_up_at?->toDateString(),
            'follow_up_due' => $application->follow_up_at !== null
                && $application->follow_up_at->lte(now()->startOfDay())
                && ! in_array($application->status, ['offer', 'rejected'], true),
            'notes' => $application->notes,
            'order' => $application->order,
            'days_in_stage' => $application->daysInStage(),
            'events' => $application->events->map(fn ($event) => [
                'id' => $event->id,
                'status' => $event->status,
                'note' => $event->note,
                'occurred_at' => $event->occurred_at->toDateTimeString(),
            ]),
        ];
    }
}
