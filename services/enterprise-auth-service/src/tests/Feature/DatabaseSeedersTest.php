<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DatabaseSeedersTest extends TestCase
{
    use RefreshDatabase;

    public function test_role_seeder_creates_initial_roles(): void
    {
        $this->seed(RoleSeeder::class);

        $this->assertDatabaseHas('roles', [
            'slug' => 'administrator',
            'name' => 'Administrator',
            'is_active' => true,
        ]);

        $this->assertDatabaseHas('roles', [
            'slug' => 'manager',
            'name' => 'Manager',
            'is_active' => true,
        ]);

        $this->assertDatabaseHas('roles', [
            'slug' => 'operator',
            'name' => 'Operator',
            'is_active' => true,
        ]);

        $this->assertSame(3, Role::count());
    }

    public function test_permission_seeder_creates_initial_permissions(): void
    {
        $this->seed(PermissionSeeder::class);

        $this->assertDatabaseHas('permissions', [
            'slug' => 'manage-users',
            'name' => 'Manage Users',
            'module' => 'auth',
            'is_active' => true,
        ]);

        $this->assertDatabaseHas('permissions', [
            'slug' => 'manage-roles',
            'name' => 'Manage Roles',
            'module' => 'auth',
            'is_active' => true,
        ]);

        $this->assertDatabaseHas('permissions', [
            'slug' => 'manage-permissions',
            'name' => 'Manage Permissions',
            'module' => 'auth',
            'is_active' => true,
        ]);

        $this->assertDatabaseHas('permissions', [
            'slug' => 'view-dashboard',
            'name' => 'View Dashboard',
            'module' => 'core',
            'is_active' => true,
        ]);

        $this->assertSame(4, Permission::count());
    }

    public function test_database_seeders_are_idempotent(): void
    {
        $this->seed(RoleSeeder::class);
        $this->seed(RoleSeeder::class);

        $this->seed(PermissionSeeder::class);
        $this->seed(PermissionSeeder::class);

        $this->assertSame(3, Role::count());
        $this->assertSame(4, Permission::count());
    }
}
