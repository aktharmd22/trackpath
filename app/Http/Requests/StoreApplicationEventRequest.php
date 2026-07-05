<?php

namespace App\Http\Requests;

use App\Models\Application;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreApplicationEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(Application::STATUSES)],
            'note' => ['nullable', 'string', 'max:2000'],
            'occurred_at' => ['required', 'date', 'before_or_equal:now'],
        ];
    }
}
