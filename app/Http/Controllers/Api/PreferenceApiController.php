<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PreferenceApiController extends Controller
{
    public function updateSound(Request $request): JsonResponse
    {
        $validated = $request->validate(['enabled' => ['required', 'boolean']]);

        $request->user()->update(['sound_enabled' => $validated['enabled']]);

        return response()->json(['sound_enabled' => (bool) $request->user()->fresh()->sound_enabled]);
    }
}
