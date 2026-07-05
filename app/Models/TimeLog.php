<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimeLog extends Model
{
    protected $fillable = ['module_id', 'minutes', 'logged_on', 'note'];

    protected function casts(): array
    {
        return [
            'logged_on' => 'date:Y-m-d',
        ];
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }
}
