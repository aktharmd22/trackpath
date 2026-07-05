<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Module extends Model
{
    public const STATUSES = ['not_started', 'in_progress', 'done'];

    protected $fillable = [
        'title',
        'slug',
        'order',
        'target_hours',
        'status',
        'notes',
    ];

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class)->orderBy('order');
    }

    public function timeLogs(): HasMany
    {
        return $this->hasMany(TimeLog::class)->orderByDesc('logged_on');
    }

    /** Percentage of lessons marked done, 0 when the module has none. */
    public function progressPercent(): int
    {
        $total = $this->lessons_count ?? $this->lessons()->count();

        if ($total === 0) {
            return 0;
        }

        $done = $this->done_lessons_count ?? $this->lessons()->where('status', 'done')->count();

        return (int) round($done / $total * 100);
    }

    public function minutesLogged(): int
    {
        return (int) ($this->time_logs_sum_minutes ?? $this->timeLogs()->sum('minutes'));
    }
}
