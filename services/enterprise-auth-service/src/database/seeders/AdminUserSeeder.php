<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $administratorRole = Role::where('slug', 'administrator')->firstOrFail();

        $adminUser = User::updateOrCreate(
            ['email' => env('ADMIN_USER_EMAIL', 'admin@example.com')],
            [
                'name' => env('ADMIN_USER_NAME', 'Admin'),
                'password' => Hash::make(env('ADMIN_USER_PASSWORD', 'password123')),
                'is_active' => true,
            ]
        );

        $adminUser->roles()->syncWithoutDetaching([$administratorRole->id]);
    }
}
