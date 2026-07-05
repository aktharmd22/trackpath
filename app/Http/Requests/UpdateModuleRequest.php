<?php

namespace App\Http\Requests;

use App\Models\Module;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateModuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', Rule::in(Module::STATUSES)],
            'notes' => ['sometimes', 'nullable', 'string', 'max:10000'],
            'target_hours' => ['sometimes', 'integer', 'min:0', 'max:1000'],
        ];
    }
}
