<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    protected $fillable = ['title', 'exam_on', 'notes'];

    protected function casts(): array
    {
        return [
            'exam_on' => 'date:Y-m-d',
        ];
    }

    public function materials(): HasMany
    {
        return $this->hasMany(StudyMaterial::class);
    }

    /** Days until the exam; negative when it has passed, null without a date. */
    public function daysToExam(): ?int
    {
        if ($this->exam_on === null) {
            return null;
        }

        return (int) now()->startOfDay()->diffInDays($this->exam_on, false);
    }
}
