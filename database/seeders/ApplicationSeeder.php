<?php

namespace Database\Seeders;

use App\Models\Application;
use Illuminate\Database\Seeder;

class ApplicationSeeder extends Seeder
{
    public function run(): void
    {
        $applications = [
            [
                'company' => 'Maersk',
                'role_title' => 'Supply Chain Analyst',
                'status' => 'interview',
                'salary_min' => 12000,
                'salary_max' => 15000,
                'location' => 'Dubai, UAE',
                'source' => 'LinkedIn',
                'url' => 'https://careers.maersk.com',
                'applied_days_ago' => 14,
                'follow_up_at' => now()->addDays(2)->toDateString(),
                'order' => 1,
                'notes' => 'Second-round interview scheduled. Prepare the forecasting case study.',
                'history' => [
                    ['status' => 'saved', 'days_ago' => 18, 'note' => 'Found via LinkedIn alert'],
                    ['status' => 'applied', 'days_ago' => 14, 'note' => 'Tailored CV for analytics keywords'],
                    ['status' => 'interview', 'days_ago' => 4, 'note' => 'HR screen went well — case study next'],
                ],
            ],
            [
                'company' => 'DP World',
                'role_title' => 'Logistics Data Analyst',
                'status' => 'applied',
                'salary_min' => 10000,
                'salary_max' => 13000,
                'location' => 'Jebel Ali, UAE',
                'source' => 'Company site',
                'url' => 'https://www.dpworld.com/careers',
                'applied_days_ago' => 8,
                'follow_up_at' => now()->subDay()->toDateString(),
                'order' => 1,
                'history' => [
                    ['status' => 'saved', 'days_ago' => 10, 'note' => null],
                    ['status' => 'applied', 'days_ago' => 8, 'note' => 'Referred by a former colleague'],
                ],
            ],
            [
                'company' => 'Aramex',
                'role_title' => 'Operations Analyst',
                'status' => 'applied',
                'salary_min' => 9000,
                'salary_max' => 11000,
                'location' => 'Dubai, UAE',
                'source' => 'Indeed',
                'applied_days_ago' => 3,
                'order' => 2,
                'history' => [
                    ['status' => 'applied', 'days_ago' => 3, 'note' => 'Quick apply with updated CV'],
                ],
            ],
            [
                'company' => 'Noon',
                'role_title' => 'Supply Chain Coordinator',
                'status' => 'saved',
                'location' => 'Riyadh, KSA',
                'source' => 'LinkedIn',
                'order' => 1,
                'notes' => 'Wants SAP MM experience — apply after the SAP module.',
                'history' => [
                    ['status' => 'saved', 'days_ago' => 2, 'note' => 'Solid fit once SAP basics are done'],
                ],
            ],
            [
                'company' => 'Emirates Group',
                'role_title' => 'Procurement Analyst',
                'status' => 'saved',
                'salary_min' => 13000,
                'salary_max' => 16000,
                'location' => 'Dubai, UAE',
                'source' => 'Company site',
                'order' => 2,
                'history' => [
                    ['status' => 'saved', 'days_ago' => 1, 'note' => null],
                ],
            ],
            [
                'company' => 'GAC Group',
                'role_title' => 'Junior Demand Planner',
                'status' => 'rejected',
                'location' => 'Dubai, UAE',
                'source' => 'LinkedIn',
                'applied_days_ago' => 25,
                'order' => 1,
                'notes' => 'Rejected — asked for 3+ years experience. Revisit in 6 months.',
                'history' => [
                    ['status' => 'applied', 'days_ago' => 25, 'note' => null],
                    ['status' => 'rejected', 'days_ago' => 15, 'note' => 'Experience gap; keep building portfolio'],
                ],
            ],
        ];

        foreach ($applications as $data) {
            $history = $data['history'];
            $appliedDaysAgo = $data['applied_days_ago'] ?? null;
            unset($data['history'], $data['applied_days_ago']);

            $application = Application::create([
                ...$data,
                'applied_at' => $appliedDaysAgo ? now()->subDays($appliedDaysAgo)->toDateString() : null,
            ]);

            foreach ($history as $event) {
                $application->events()->create([
                    'status' => $event['status'],
                    'note' => $event['note'],
                    'occurred_at' => now()->subDays($event['days_ago']),
                ]);
            }
        }
    }
}
