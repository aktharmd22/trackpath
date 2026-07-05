<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreApplicationEventRequest;
use App\Models\Application;
use Illuminate\Http\RedirectResponse;

class ApplicationEventController extends Controller
{
    public function store(StoreApplicationEventRequest $request, Application $application): RedirectResponse
    {
        $validated = $request->validated();

        $application->events()->create($validated);

        // Adding a stage event moves the application to that stage.
        if ($validated['status'] !== $application->status) {
            $application->update([
                'status' => $validated['status'],
                'order' => Application::where('status', $validated['status'])->max('order') + 1,
            ]);
        }

        return back();
    }
}
