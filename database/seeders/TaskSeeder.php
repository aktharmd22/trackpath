<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        Task::create([
            'title' => 'Follow up with DP World recruiter',
            'notes' => 'Reference the referral from the application.',
            'due_on' => now()->subDay()->toDateString(),
            'priority' => 'high',
        ]);

        Task::create([
            'title' => 'Finish demand forecasting lesson',
            'due_on' => now()->toDateString(),
            'priority' => 'normal',
        ]);

        Task::create([
            'title' => 'Rebuild CV with analytics keywords',
            'due_on' => now()->addDays(3)->toDateString(),
            'priority' => 'high',
        ]);

        Task::create([
            'title' => 'Watch Incoterms 2020 overview video',
            'priority' => 'low',
        ]);

        Task::create([
            'title' => 'Set up TrackPath',
            'completed_at' => now()->subDay(),
        ]);
    }
}
