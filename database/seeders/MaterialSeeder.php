<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\StudyMaterial;
use Illuminate\Database\Seeder;

class MaterialSeeder extends Seeder
{
    public function run(): void
    {
        $modules = Module::pluck('id', 'slug');

        // Links
        $link = StudyMaterial::create([
            'title' => 'MIT Supply Chain Fundamentals (edX)',
            'type' => 'link',
            'url' => 'https://www.edx.org/learn/supply-chain-management',
            'module_id' => $modules['supply-chain-foundations'] ?? null,
        ]);
        $link->syncTags(['course', 'foundations']);

        $link = StudyMaterial::create([
            'title' => 'SQL for Data Analysis — Mode tutorial',
            'type' => 'link',
            'url' => 'https://mode.com/sql-tutorial',
            'module_id' => $modules['excel-sql'] ?? null,
        ]);
        $link->syncTags(['sql', 'tutorial']);

        $link = StudyMaterial::create([
            'title' => 'Power BI guided learning',
            'type' => 'link',
            'url' => 'https://learn.microsoft.com/en-us/power-bi/',
            'module_id' => $modules['power-bi'] ?? null,
        ]);
        $link->syncTags(['power-bi', 'course']);

        // Notes
        $note = StudyMaterial::create([
            'title' => 'Incoterms quick reference',
            'type' => 'note',
            'body' => "EXW — buyer takes all risk from seller's door.\nFOB — seller loads the vessel; risk transfers on board.\nCIF — seller pays cost, insurance, freight to destination port.\nDDP — seller delivers duty paid; maximum seller obligation.",
            'module_id' => $modules['trade-incoterms'] ?? null,
        ]);
        $note->syncTags(['incoterms', 'reference']);

        $note = StudyMaterial::create([
            'title' => 'Interview stories — STAR format',
            'type' => 'note',
            'body' => "1. Inventory reconciliation project — cut variance 40%.\n2. Excel automation that saved 6 hrs/week.\n3. Cross-team logistics escalation — what I'd do differently.",
        ]);
        $note->syncTags(['interview', 'prep']);

        // Files (small seeded artifacts so the file type is demonstrated)
        $file = StudyMaterial::create([
            'title' => 'SQL joins cheat sheet',
            'type' => 'file',
            'module_id' => $modules['excel-sql'] ?? null,
        ]);
        $file->addMediaFromString(
            "-- INNER JOIN: rows in both tables\n-- LEFT JOIN: all left rows + matches\n-- Window: SUM(x) OVER (PARTITION BY y ORDER BY z)\n"
        )->usingFileName('sql-joins-cheatsheet.txt')->toMediaCollection('file');
        $file->syncTags(['sql', 'reference']);

        $file = StudyMaterial::create([
            'title' => 'Safety stock calculator template',
            'type' => 'file',
            'module_id' => $modules['supply-chain-foundations'] ?? null,
        ]);
        $file->addMediaFromString(
            "item,demand_avg,demand_sd,lead_time_days,z,safety_stock\nSKU-001,120,30,14,1.65,185\nSKU-002,80,22,7,1.65,96\n"
        )->usingFileName('safety-stock-template.csv')->toMediaCollection('file');
        $file->syncTags(['excel', 'template']);
    }
}
