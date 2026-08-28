<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
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

        $this->assertDatabaseHas('permissions', [
            'slug' => 'view-system-events',
            'name' => 'View System Events',
            'module' => 'system',
            'is_active' => true,
        ]);

        $this->assertDatabaseHas('permissions', [
            'slug' => 'view-customers',
            'name' => 'View Customers',
            'module' => 'customers',
            'is_active' => true,
        ]);

        $this->assertDatabaseHas('permissions', [
            'slug' => 'manage-customers',
            'name' => 'Manage Customers',
            'module' => 'customers',
            'is_active' => true,
        ]);

        $this->assertDatabaseHas('permissions', [
            'slug' => 'lookup-taxpayer',
            'name' => 'Lookup Taxpayer',
            'module' => 'customers',
            'is_active' => true,
        ]);

        $this->assertSame(8, Permission::count());
    }

    public function test_permission_seeder_assigns_administrator_permissions(): void
    {
        $this->seed(RoleSeeder::class);
        $this->seed(PermissionSeeder::class);

        $administratorRole = Role::where('slug', 'administrator')->firstOrFail();

        $this->assertTrue($administratorRole->hasPermission('manage-users'));
        $this->assertTrue($administratorRole->hasPermission('view-system-events'));
        $this->assertTrue($administratorRole->hasPermission('view-customers'));
        $this->assertTrue($administratorRole->hasPermission('manage-customers'));
        $this->assertTrue($administratorRole->hasPermission('lookup-taxpayer'));
    }

    public function test_database_seeder_creates_active_admin_user_with_administrator_role_and_permissions(): void
    {
        $this->artisan('db:seed')
            ->assertExitCode(0);

        $adminUser = User::where('email', 'admin@example.com')->firstOrFail();
        $administratorRole = Role::where('slug', 'administrator')->firstOrFail();

        $this->assertSame('Admin', $adminUser->name);
        $this->assertTrue(Hash::check('password123', $adminUser->password));
        $this->assertTrue($adminUser->is_active);
        $this->assertTrue($adminUser->hasRole('administrator'));

        $this->assertTrue($administratorRole->hasPermission('manage-users'));
        $this->assertTrue($administratorRole->hasPermission('view-customers'));
        $this->assertTrue($administratorRole->hasPermission('manage-customers'));
        $this->assertTrue($administratorRole->hasPermission('lookup-taxpayer'));
        $this->assertTrue($administratorRole->hasPermission('view-system-events'));
    }

    public function test_database_seeders_are_idempotent(): void
    {
        $this->artisan('db:seed')
            ->assertExitCode(0);
        $this->artisan('db:seed')
            ->assertExitCode(0);

        $this->assertSame(3, Role::count());
        $this->assertSame(8, Permission::count());
        $this->assertSame(1, User::where('email', 'admin@example.com')->count());
        $this->assertSame(1, DB::table('role_user')->count());

        $administratorRole = Role::where('slug', 'administrator')->firstOrFail();

        $this->assertSame(5, $administratorRole->permissions()->count());
    }
}
