<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudyMaterialRequest;
use App\Http\Requests\UpdateStudyMaterialRequest;
use App\Models\Module;
use App\Models\StudyMaterial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Tags\Tag;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class MaterialApiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $materials = StudyMaterial::query()
            ->with(['module', 'tags', 'media'])
            ->when($request->query('type'), fn ($query, $type) => $query->where('type', $type))
            ->when($request->query('module'), fn ($query, $module) => $query->where('module_id', $module))
            ->when($request->query('tag'), fn ($query, $tag) => $query->withAnyTags([$tag]))
            ->latest()
            ->get()
            ->map(fn (StudyMaterial $material) => $this->serialize($material));

        return response()->json([
            'materials' => $materials,
            'modules' => Module::orderBy('order')->get(['id', 'title', 'slug']),
            'tags' => Tag::query()->orderBy('id')->get()->map(fn (Tag $tag) => $tag->name)->unique()->values(),
            'types' => StudyMaterial::TYPES,
        ]);
    }

    public function store(StoreStudyMaterialRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $material = StudyMaterial::create($validated);

        if ($request->hasFile('file')) {
            $material->addMediaFromRequest('file')->toMediaCollection('file');
        }

        $material->syncTags($validated['tags'] ?? []);

        return response()->json(['material' => $this->serialize($material->fresh()->load(['module', 'tags', 'media']))], 201);
    }

    public function update(UpdateStudyMaterialRequest $request, StudyMaterial $studyMaterial): JsonResponse
    {
        $validated = $request->validated();

        $studyMaterial->update($validated);

        if ($request->hasFile('file')) {
            $studyMaterial->addMediaFromRequest('file')->toMediaCollection('file');
        }

        $studyMaterial->syncTags($validated['tags'] ?? []);

        return response()->json(['material' => $this->serialize($studyMaterial->fresh()->load(['module', 'tags', 'media']))]);
    }

    public function download(StudyMaterial $studyMaterial): BinaryFileResponse
    {
        $media = $studyMaterial->getFirstMedia('file');

        abort_unless($media !== null, 404);

        return response()->download($media->getPath(), $media->file_name);
    }

    public function destroy(StudyMaterial $studyMaterial): JsonResponse
    {
        $studyMaterial->delete();

        return response()->json(['ok' => true]);
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
