<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            [
                'name' => 'Manage Users',
                'slug' => 'manage-users',
                'module' => 'auth',
                'description' => 'Allows managing users.',
                'is_active' => true,
            ],
            [
                'name' => 'Manage Roles',
                'slug' => 'manage-roles',
                'module' => 'auth',
                'description' => 'Allows managing roles.',
                'is_active' => true,
            ],
            [
                'name' => 'Manage Permissions',
                'slug' => 'manage-permissions',
                'module' => 'auth',
                'description' => 'Allows managing permissions.',
                'is_active' => true,
            ],
            [
                'name' => 'View Dashboard',
                'slug' => 'view-dashboard',
                'module' => 'core',
                'description' => 'Allows viewing the main dashboard.',
                'is_active' => true,
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );
        }
    }
}
