<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Tags\HasTags;

class StudyMaterial extends Model implements HasMedia
{
    use HasTags;
    use InteractsWithMedia;

    public const TYPES = ['file', 'link', 'note'];

    protected $fillable = ['title', 'type', 'url', 'body', 'module_id', 'subject_id'];

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('file')->singleFile();
    }
}
