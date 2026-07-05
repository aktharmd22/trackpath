<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubjectRequest;
use App\Models\Module;
use App\Models\StudyMaterial;
use App\Models\Subject;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Tags\Tag;

class SubjectController extends Controller
{
    public function index(): Response
    {
        $subjects = Subject::query()
            ->withCount('materials')
            ->orderByRaw('exam_on is null')
            ->orderBy('exam_on')
            ->orderBy('title')
            ->get()
            ->map(fn (Subject $subject) => $this->serialize($subject));

        return Inertia::render('ExamPrep/Index', [
            'subjects' => $subjects,
        ]);
    }

    public function show(Subject $subject): Response
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

        return Inertia::render('ExamPrep/Show', [
            'subject' => $this->serialize($subject),
            'materials' => $materials,
            'modules' => Module::orderBy('order')->get(['id', 'title', 'slug']),
            'subjects' => Subject::orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function store(StoreSubjectRequest $request): RedirectResponse
    {
        Subject::create($request->validated());

        return back()->with('success', 'Subject added.');
    }

    public function update(StoreSubjectRequest $request, Subject $subject): RedirectResponse
    {
        $subject->update($request->validated());

        return back();
    }

    public function destroy(Subject $subject): RedirectResponse
    {
        $subject->delete(); // materials keep existing; subject_id nulls out

        return redirect()->route('exam-prep.index')->with('success', 'Subject removed.');
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
