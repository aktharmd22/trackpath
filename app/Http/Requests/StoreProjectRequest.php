<?php

namespace App\Http\Requests;

use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'repo_url' => ['nullable', 'url', 'max:2048'],
            'live_url' => ['nullable', 'url', 'max:2048'],
            'status' => ['required', Rule::in(Project::STATUSES)],
        ];
    }
}
