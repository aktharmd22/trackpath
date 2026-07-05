<?php

namespace App\Http\Requests;

use App\Models\Application;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company' => ['required', 'string', 'max:255'],
            'role_title' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in(Application::STATUSES)],
            'salary_min' => ['nullable', 'integer', 'min:0'],
            'salary_max' => ['nullable', 'integer', 'min:0', 'gte:salary_min'],
            'currency' => ['required', 'string', 'size:3'],
            'location' => ['nullable', 'string', 'max:255'],
            'source' => ['nullable', 'string', 'max:255'],
            'url' => ['nullable', 'url', 'max:2048'],
            'applied_at' => ['nullable', 'date'],
            'follow_up_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:10000'],
        ];
    }
}
