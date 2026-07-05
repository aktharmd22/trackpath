<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    public const PRIORITIES = ['low', 'normal', 'high'];

    protected $fillable = ['title', 'notes', 'due_on', 'priority', 'completed_at'];

    protected function casts(): array
    {
        return [
            'due_on' => 'date:Y-m-d',
            'completed_at' => 'datetime',
        ];
    }

    public function isOverdue(): bool
    {
        return $this->completed_at === null
            && $this->due_on !== null
            && $this->due_on->lt(now()->startOfDay());
    }
}
