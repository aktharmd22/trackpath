<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    public const STATUSES = ['idea', 'building', 'shipped'];

    protected $fillable = ['title', 'description', 'repo_url', 'live_url', 'status'];
}
