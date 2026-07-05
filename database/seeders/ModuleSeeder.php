<?php

namespace Database\Seeders;

use App\Models\Module;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
        $modules = [
            [
                'title' => 'Setup',
                'target_hours' => 4,
                'status' => 'done',
                'lessons' => [
                    ['title' => 'Install Excel, Power BI, and DB tools', 'status' => 'done'],
                    ['title' => 'Set up a study schedule', 'status' => 'done'],
                    ['title' => 'Checkpoint: environment ready', 'status' => 'done', 'is_checkpoint' => true],
                ],
                'logs' => [
                    ['minutes' => 120, 'days_ago' => 20, 'note' => 'Tool installs'],
                    ['minutes' => 90, 'days_ago' => 19, 'note' => 'Planning the roadmap'],
                ],
            ],
            [
                'title' => 'Supply Chain Foundations',
                'target_hours' => 20,
                'status' => 'in_progress',
                'notes' => "Focus on procurement → production → distribution flow.\nKey terms: lead time, safety stock, EOQ, bullwhip effect.",
                'lessons' => [
                    ['title' => 'Supply chain flows and stakeholders', 'status' => 'done'],
                    ['title' => 'Inventory basics: EOQ, safety stock', 'status' => 'done'],
                    ['title' => 'Warehousing and distribution', 'status' => 'done'],
                    ['title' => 'Demand forecasting fundamentals', 'status' => 'todo'],
                    ['title' => 'Checkpoint: explain end-to-end flow', 'status' => 'todo', 'is_checkpoint' => true],
                ],
                'logs' => [
                    ['minutes' => 150, 'days_ago' => 12, 'note' => 'Flows + stakeholders'],
                    ['minutes' => 120, 'days_ago' => 9, 'note' => 'Inventory models'],
                    ['minutes' => 180, 'days_ago' => 5, 'note' => 'Warehousing deep dive'],
                    ['minutes' => 90, 'days_ago' => 2, 'note' => 'Forecasting intro'],
                    ['minutes' => 60, 'days_ago' => 1, 'note' => 'Revision'],
                ],
            ],
            [
                'title' => 'Excel + SQL',
                'target_hours' => 30,
                'status' => 'in_progress',
                'lessons' => [
                    ['title' => 'Excel: lookups, pivots, Power Query', 'status' => 'done'],
                    ['title' => 'SQL: SELECT, JOIN, GROUP BY', 'status' => 'todo'],
                    ['title' => 'SQL: window functions', 'status' => 'todo'],
                    ['title' => 'Checkpoint: inventory analysis mini-project', 'status' => 'todo', 'is_checkpoint' => true],
                ],
                'logs' => [
                    ['minutes' => 180, 'days_ago' => 7, 'note' => 'Pivot tables'],
                    ['minutes' => 120, 'days_ago' => 3, 'note' => 'Power Query practice'],
                ],
            ],
            [
                'title' => 'Power BI',
                'target_hours' => 25,
                'status' => 'not_started',
                'lessons' => [
                    ['title' => 'Data model + relationships', 'status' => 'todo'],
                    ['title' => 'DAX fundamentals', 'status' => 'todo'],
                    ['title' => 'Supply chain dashboard build', 'status' => 'todo'],
                    ['title' => 'Checkpoint: publish a dashboard', 'status' => 'todo', 'is_checkpoint' => true],
                ],
            ],
            [
                'title' => 'SAP',
                'target_hours' => 20,
                'status' => 'not_started',
                'lessons' => [
                    ['title' => 'SAP navigation + core modules (MM/SD)', 'status' => 'todo'],
                    ['title' => 'Purchase-to-pay cycle', 'status' => 'todo'],
                    ['title' => 'Checkpoint: process a PO end-to-end', 'status' => 'todo', 'is_checkpoint' => true],
                ],
            ],
            [
                'title' => 'Python for Supply Chain',
                'target_hours' => 25,
                'status' => 'not_started',
                'lessons' => [
                    ['title' => 'pandas basics for tabular data', 'status' => 'todo'],
                    ['title' => 'Demand forecasting with statsmodels', 'status' => 'todo'],
                    ['title' => 'Checkpoint: forecast notebook', 'status' => 'todo', 'is_checkpoint' => true],
                ],
            ],
            [
                'title' => 'Trade / Incoterms',
                'target_hours' => 10,
                'status' => 'not_started',
                'lessons' => [
                    ['title' => 'Incoterms 2020 overview', 'status' => 'todo'],
                    ['title' => 'Import/export documentation', 'status' => 'todo'],
                    ['title' => 'Checkpoint: quote a shipment correctly', 'status' => 'todo', 'is_checkpoint' => true],
                ],
            ],
        ];

        foreach ($modules as $order => $data) {
            $module = Module::create([
                'title' => $data['title'],
                'slug' => Str::slug($data['title']),
                'order' => $order + 1,
                'target_hours' => $data['target_hours'],
                'status' => $data['status'],
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($data['lessons'] as $lessonOrder => $lesson) {
                $module->lessons()->create([
                    'title' => $lesson['title'],
                    'order' => $lessonOrder + 1,
                    'status' => $lesson['status'],
                    'is_checkpoint' => $lesson['is_checkpoint'] ?? false,
                ]);
            }

            foreach ($data['logs'] ?? [] as $log) {
                $module->timeLogs()->create([
                    'minutes' => $log['minutes'],
                    'logged_on' => now()->subDays($log['days_ago'])->toDateString(),
                    'note' => $log['note'],
                ]);
            }
        }
    }
}
