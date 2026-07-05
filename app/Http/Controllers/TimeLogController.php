<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTimeLogRequest;
use App\Models\Module;
use App\Models\TimeLog;
use Illuminate\Http\RedirectResponse;

class TimeLogController extends Controller
{
    public function store(StoreTimeLogRequest $request, Module $module): RedirectResponse
    {
        $module->timeLogs()->create($request->validated());

        return back();
    }

    public function destroy(TimeLog $timeLog): RedirectResponse
    {
        $timeLog->delete();

        return back();
    }
}
