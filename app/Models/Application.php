<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Tags\HasTags;

class Application extends Model
{
    use HasTags;

    public const STATUSES = ['saved', 'applied', 'interview', 'offer', 'rejected'];

    protected $fillable = [
        'company',
        'role_title',
        'status',
        'salary_min',
        'salary_max',
        'currency',
        'location',
        'source',
        'url',
        'applied_at',
        'follow_up_at',
        'notes',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'applied_at' => 'date:Y-m-d',
            'follow_up_at' => 'date:Y-m-d',
        ];
    }

    public function events(): HasMany
    {
        return $this->hasMany(ApplicationEvent::class)->orderByDesc('occurred_at');
    }

    /** Days spent in the current status, based on the latest stage event. */
    public function daysInStage(): int
    {
        $since = $this->relationLoaded('events')
            ? $this->events->first()?->occurred_at
            : $this->events()->first()?->occurred_at;

        return (int) ($since ?? $this->created_at)->diffInDays(now());
    }
}
