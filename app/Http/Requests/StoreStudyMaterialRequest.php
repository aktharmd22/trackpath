<?php

namespace App\Http\Requests;

use App\Models\StudyMaterial;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStudyMaterialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in(StudyMaterial::TYPES)],
            'file' => [
                Rule::requiredIf($this->input('type') === 'file' && $this->isMethod('POST')),
                'nullable',
                'file',
                'max:20480', // 20 MB
            ],
            'url' => [
                Rule::requiredIf($this->input('type') === 'link'),
                'nullable',
                'url',
                'max:2048',
            ],
            'body' => [
                Rule::requiredIf($this->input('type') === 'note'),
                'nullable',
                'string',
                'max:50000',
            ],
            'module_id' => ['nullable', 'integer', 'exists:modules,id'],
            'tags' => ['nullable', 'array', 'max:10'],
            'tags.*' => ['string', 'max:30'],
        ];
    }
}
