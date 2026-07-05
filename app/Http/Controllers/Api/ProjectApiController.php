<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use Illuminate\Http\JsonResponse;

class ProjectApiController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'projects' => Project::latest()->get(),
            'statuses' => Project::STATUSES,
        ]);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        return response()->json(['project' => Project::create($request->validated())], 201);
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $project->update($request->validated());

        return response()->json(['project' => $project->fresh()]);
    }

    public function destroy(Project $project): JsonResponse
    {
        $project->delete();

        return response()->json(['ok' => true]);
    }
}
