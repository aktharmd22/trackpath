<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSubjectRequest;
use App\Models\StudyMaterial;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Spatie\Tags\Tag;

class SubjectApiController extends Controller
{
    public function index(): JsonResponse
    {
        $subjects = Subject::query()
            ->withCount('materials')
            ->orderByRaw('exam_on is null')
            ->orderBy('exam_on')
            ->orderBy('title')
            ->get()
            ->map(fn (Subject $subject) => $this->serialize($subject));

        return response()->json(['subjects' => $subjects]);
    }

    public function show(Subject $subject): JsonResponse
    {
        $subject->loadCount('materials');

        $materials = $subject->materials()
            ->with(['module', 'tags', 'media'])
            ->latest()
            ->get()
            ->map(fn (StudyMaterial $material) => [
                'id' => $material->id,
                'title' => $material->title,
                'type' => $material->type,
                'url' => $material->url,
                'body' => $material->body,
                'module_id' => $material->module_id,
                'subject_id' => $material->subject_id,
                'module' => $material->module?->only(['id', 'title', 'slug']),
                'tags' => $material->tags->map(fn (Tag $tag) => $tag->name)->values(),
                'file' => ($media = $material->getFirstMedia('file')) ? [
                    'name' => $media->file_name,
                    'size' => $media->human_readable_size,
                ] : null,
                'created_at' => $material->created_at->toDateTimeString(),
            ]);

        return response()->json([
            'subject' => $this->serialize($subject),
            'materials' => $materials,
        ]);
    }

    public function store(StoreSubjectRequest $request): JsonResponse
    {
        $subject = Subject::create($request->validated());

        return response()->json(['id' => $subject->id], 201);
    }

    public function update(StoreSubjectRequest $request, Subject $subject): JsonResponse
    {
        $subject->update($request->validated());

        return response()->json(['ok' => true]);
    }

    public function destroy(Subject $subject): JsonResponse
    {
        $subject->delete();

        return response()->json(['ok' => true]);
    }

    private function serialize(Subject $subject): array
    {
        return [
            'id' => $subject->id,
            'title' => $subject->title,
            'exam_on' => $subject->exam_on?->toDateString(),
            'notes' => $subject->notes,
            'days_to_exam' => $subject->daysToExam(),
            'materials_count' => $subject->materials_count ?? 0,
        ];
    }
}
