<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        Project::create([
            'title' => 'Supply chain KPI dashboard',
            'description' => 'Power BI dashboard tracking OTIF, inventory turnover, and fill rate on a public retail dataset. Built to showcase DAX and data-model skills.',
            'repo_url' => 'https://github.com/example/supply-kpi-dashboard',
            'status' => 'building',
        ]);

        Project::create([
            'title' => 'Demand forecasting notebook',
            'description' => 'Python notebook forecasting weekly demand with pandas and statsmodels; compares naive, moving-average, and exponential smoothing baselines.',
            'repo_url' => 'https://github.com/example/demand-forecasting',
            'live_url' => 'https://nbviewer.org/example/demand-forecasting',
            'status' => 'idea',
        ]);
    }
}
