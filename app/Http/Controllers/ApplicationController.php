<?php

namespace App\Http\Controllers;

use App\Http\Requests\MoveApplicationRequest;
use App\Http\Requests\StoreApplicationRequest;
use App\Http\Requests\UpdateApplicationRequest;
use App\Models\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ApplicationController extends Controller
{
    public function index(): Response
    {
        $applications = Application::query()
            ->with('events')
            ->orderBy('order')
            ->get()
            ->map(fn (Application $application) => $this->serialize($application));

        return Inertia::render('Jobs/Index', [
            'applications' => $applications,
            'statuses' => Application::STATUSES,
        ]);
    }

    public function store(StoreApplicationRequest $request): RedirectResponse
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

        return back()->with('success', "{$application->company} added.");
    }

    public function update(UpdateApplicationRequest $request, Application $application): RedirectResponse
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

        return back();
    }

    /** Persist a kanban drag: new column (status) and position within it. */
    public function move(MoveApplicationRequest $request, Application $application): RedirectResponse
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

        return back();
    }

    public function destroy(Application $application): RedirectResponse
    {
        $application->delete();

        return back()->with('success', 'Application removed.');
    }

    public function export(): StreamedResponse
    {
        $filename = 'trackpath-applications-' . now()->format('Y-m-d') . '.csv';

        return response()->streamDownload(function () {
            $out = fopen('php://output', 'w');

            fputcsv($out, [
                'Company', 'Role', 'Status', 'Salary min', 'Salary max', 'Currency',
                'Location', 'Source', 'URL', 'Applied on', 'Follow up on',
                'Days in stage', 'Notes',
            ]);

            Application::with('events')
                ->orderBy('status')
                ->orderBy('order')
                ->each(function (Application $application) use ($out) {
                    fputcsv($out, [
                        $application->company,
                        $application->role_title,
                        $application->status,
                        $application->salary_min,
                        $application->salary_max,
                        $application->currency,
                        $application->location,
                        $application->source,
                        $application->url,
                        $application->applied_at?->toDateString(),
                        $application->follow_up_at?->toDateString(),
                        $application->daysInStage(),
                        $application->notes,
                    ]);
                });

            fclose($out);
        }, $filename, ['Content-Type' => 'text/csv']);
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
