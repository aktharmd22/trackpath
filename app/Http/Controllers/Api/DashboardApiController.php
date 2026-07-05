<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\Task;
use App\Models\TimeLog;
use Illuminate\Http\JsonResponse;

/**
 * Mirrors the web DashboardController payload for the mobile app.
 */
class DashboardApiController extends Controller
{
    public function index(): JsonResponse
    {
        $totalLessons = Lesson::count();
        $doneLessons = Lesson::where('status', 'done')->count();

        $minutesThisWeek = (int) TimeLog::where('logged_on', '>=', now()->startOfWeek()->toDateString())
            ->sum('minutes');

        $logged = TimeLog::where('logged_on', '>=', now()->subDays(13)->toDateString())
            ->selectRaw('logged_on, sum(minutes) as minutes')
            ->groupBy('logged_on')
            ->pluck('minutes', 'logged_on');

        $minutesByDay = collect(range(13, 0))->map(function (int $daysAgo) use ($logged) {
            $date = now()->subDays($daysAgo)->toDateString();

            return ['date' => $date, 'minutes' => (int) ($logged[$date] ?? 0)];
        })->values();

        $statusCounts = Application::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $currentModule = Module::query()
            ->where('status', 'in_progress')
            ->withCount([
                'lessons',
                'lessons as done_lessons_count' => fn ($query) => $query->where('status', 'done'),
            ])
            ->orderBy('order')
            ->first();

        $followUps = Application::query()
            ->with('events')
            ->whereNotIn('status', ['offer', 'rejected'])
            ->get()
            ->map(fn (Application $application) => [
                'id' => $application->id,
                'company' => $application->company,
                'role_title' => $application->role_title,
                'status' => $application->status,
                'days_in_stage' => $application->daysInStage(),
                'follow_up_at' => $application->follow_up_at?->toDateString(),
                'follow_up_due' => $application->follow_up_at !== null
                    && $application->follow_up_at->lte(now()->startOfDay()),
            ])
            ->filter(fn (array $application) => $application['follow_up_due']
                || ($application['follow_up_at'] === null
                    && in_array($application['status'], ['applied', 'interview'], true)
                    && $application['days_in_stage'] >= 5))
            ->sortBy([['follow_up_due', 'desc'], ['days_in_stage', 'desc']])
            ->take(4)
            ->values();

        $dueTasks = Task::query()
            ->whereNull('completed_at')
            ->whereNotNull('due_on')
            ->where('due_on', '<=', now()->toDateString())
            ->orderBy('due_on')
            ->limit(4)
            ->get()
            ->map(fn (Task $task) => [
                'id' => $task->id,
                'title' => $task->title,
                'due_on' => $task->due_on->toDateString(),
                'overdue' => $task->isOverdue(),
                'priority' => $task->priority,
            ]);

        return response()->json([
            'stats' => [
                'total_lessons' => $totalLessons,
                'done_lessons' => $doneLessons,
                'progress' => $totalLessons > 0 ? (int) round($doneLessons / $totalLessons * 100) : 0,
                'minutes_this_week' => $minutesThisWeek,
                'applications_total' => (int) $statusCounts->sum(),
                'applications_by_status' => collect(Application::STATUSES)
                    ->mapWithKeys(fn (string $status) => [$status => (int) ($statusCounts[$status] ?? 0)]),
            ],
            'minutesByDay' => $minutesByDay,
            'currentModule' => $currentModule ? [
                'title' => $currentModule->title,
                'slug' => $currentModule->slug,
                'progress' => $currentModule->progressPercent(),
                'done_lessons_count' => $currentModule->done_lessons_count,
                'lessons_count' => $currentModule->lessons_count,
            ] : null,
            'followUps' => $followUps,
            'dueTasks' => $dueTasks,
        ]);
    }
}
