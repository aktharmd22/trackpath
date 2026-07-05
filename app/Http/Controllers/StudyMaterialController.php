<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudyMaterialRequest;
use App\Http\Requests\UpdateStudyMaterialRequest;
use App\Models\Module;
use App\Models\StudyMaterial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Tags\Tag;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class StudyMaterialController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'type' => $request->query('type'),
            'module' => $request->query('module'),
            'tag' => $request->query('tag'),
        ];

        $materials = StudyMaterial::query()
            ->with(['module', 'tags', 'media'])
            ->when($filters['type'], fn ($query, $type) => $query->where('type', $type))
            ->when($filters['module'], fn ($query, $module) => $query->where('module_id', $module))
            ->when($filters['tag'], fn ($query, $tag) => $query->withAnyTags([$tag]))
            ->latest()
            ->get()
            ->map(fn (StudyMaterial $material) => $this->serialize($material));

        return Inertia::render('Materials/Index', [
            'materials' => $materials,
            'filters' => $filters,
            'modules' => Module::orderBy('order')->get(['id', 'title', 'slug']),
            'tags' => Tag::query()->orderBy('id')->get()->map(fn (Tag $tag) => $tag->name)->unique()->values(),
            'types' => StudyMaterial::TYPES,
        ]);
    }

    public function store(StoreStudyMaterialRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $material = StudyMaterial::create($validated);

        if ($request->hasFile('file')) {
            $material->addMediaFromRequest('file')->toMediaCollection('file');
        }

        $material->syncTags($validated['tags'] ?? []);

        return back()->with('success', 'Material added.');
    }

    public function update(UpdateStudyMaterialRequest $request, StudyMaterial $studyMaterial): RedirectResponse
    {
        $validated = $request->validated();

        $studyMaterial->update($validated);

        if ($request->hasFile('file')) {
            $studyMaterial->addMediaFromRequest('file')->toMediaCollection('file');
        }

        $studyMaterial->syncTags($validated['tags'] ?? []);

        return back();
    }

    public function download(StudyMaterial $studyMaterial): BinaryFileResponse
    {
        $media = $studyMaterial->getFirstMedia('file');

        abort_unless($media !== null, 404);

        return response()->download($media->getPath(), $media->file_name);
    }

    public function destroy(StudyMaterial $studyMaterial): RedirectResponse
    {
        $studyMaterial->delete();

        return back()->with('success', 'Material removed.');
    }

    private function serialize(StudyMaterial $material): array
    {
        $media = $material->getFirstMedia('file');

        return [
            'id' => $material->id,
            'title' => $material->title,
            'type' => $material->type,
            'url' => $material->url,
            'body' => $material->body,
            'module_id' => $material->module_id,
            'module' => $material->module?->only(['id', 'title', 'slug']),
            'tags' => $material->tags->map(fn (Tag $tag) => $tag->name)->values(),
            'file' => $media ? [
                'name' => $media->file_name,
                'size' => $media->human_readable_size,
            ] : null,
            'created_at' => $material->created_at->toDateTimeString(),
        ];
    }
}
