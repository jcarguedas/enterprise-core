<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
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
            [
                'name' => 'View System Events',
                'slug' => 'view-system-events',
                'module' => 'system',
                'description' => 'Allows viewing system activity events.',
                'is_active' => true,
            ],
            [
                'name' => 'View Customers',
                'slug' => 'view-customers',
                'module' => 'customers',
                'description' => 'Allows viewing customers.',
                'is_active' => true,
            ],
            [
                'name' => 'Manage Customers',
                'slug' => 'manage-customers',
                'module' => 'customers',
                'description' => 'Allows creating and updating customers.',
                'is_active' => true,
            ],
            [
                'name' => 'Lookup Taxpayer',
                'slug' => 'lookup-taxpayer',
                'module' => 'customers',
                'description' => 'Allows consulting taxpayer data through backend-mediated lookup.',
                'is_active' => true,
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );
        }

        $administratorRole = Role::where('slug', 'administrator')->first();
        $administratorPermissions = Permission::whereIn('slug', [
            'manage-users',
            'view-system-events',
            'view-customers',
            'manage-customers',
            'lookup-taxpayer',
        ])->pluck('id');

        if ($administratorRole && $administratorPermissions->isNotEmpty()) {
            $administratorRole->permissions()->syncWithoutDetaching($administratorPermissions->all());
        }
    }
}
