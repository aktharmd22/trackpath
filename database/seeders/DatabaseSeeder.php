<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Credentials come from .env so real secrets never land in git.
        User::factory()->create([
            'name' => env('SEED_USER_NAME', 'Demo User'),
            'email' => env('SEED_USER_EMAIL', 'demo@trackpath.test'),
            'password' => Hash::make(env('SEED_USER_PASSWORD', 'password')),
        ]);

        $this->call([
            ModuleSeeder::class,
            ApplicationSeeder::class,
            MaterialSeeder::class,
            ProjectSeeder::class,
            TaskSeeder::class,
        ]);
    }
}
