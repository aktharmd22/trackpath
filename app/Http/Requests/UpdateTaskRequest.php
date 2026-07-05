<?php

namespace App\Http\Requests;

use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'due_on' => ['sometimes', 'nullable', 'date'],
            'priority' => ['sometimes', Rule::in(Task::PRIORITIES)],
            'completed' => ['sometimes', 'boolean'],
        ];
    }
}
