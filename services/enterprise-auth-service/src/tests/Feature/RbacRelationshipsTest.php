<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RbacRelationshipsTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_have_roles(): void
    {
        $user = User::factory()->create();

        $role = Role::create([
            'name' => 'Administrator',
            'slug' => 'administrator',
            'description' => 'System administrator role',
            'is_active' => true,
        ]);

        $user->roles()->attach($role);

        $this->assertTrue(
            $user->roles()
                ->where('roles.id', $role->id)
                ->exists()
        );

        $this->assertTrue(
            $role->users()
                ->where('users.id', $user->id)
                ->exists()
        );
    }

    public function test_role_can_have_permissions(): void
    {
        $role = Role::create([
            'name' => 'Administrator',
            'slug' => 'administrator',
            'description' => 'System administrator role',
            'is_active' => true,
        ]);

        $permission = Permission::create([
            'name' => 'Manage Users',
            'slug' => 'manage-users',
            'module' => 'auth',
            'description' => 'Allows managing users',
            'is_active' => true,
        ]);

        $role->permissions()->attach($permission);

        $this->assertTrue(
            $role->permissions()
                ->where('permissions.id', $permission->id)
                ->exists()
        );

        $this->assertTrue(
            $permission->roles()
                ->where('roles.id', $role->id)
                ->exists()
        );
    }

    public function test_user_can_check_if_has_role(): void
    {
        $user = User::factory()->create();

        $role = Role::create([
            'name' => 'Administrator',
            'slug' => 'administrator',
            'description' => 'System administrator role',
            'is_active' => true,
        ]);

        $user->roles()->attach($role);

        $this->assertTrue($user->hasRole('administrator'));
        $this->assertFalse($user->hasRole('operator'));
    }

    public function test_role_can_check_if_has_permission(): void
    {
        $role = Role::create([
            'name' => 'Administrator',
            'slug' => 'administrator',
            'description' => 'System administrator role',
            'is_active' => true,
        ]);

        $permission = Permission::create([
            'name' => 'Manage Users',
            'slug' => 'manage-users',
            'module' => 'auth',
            'description' => 'Allows managing users',
            'is_active' => true,
        ]);

        $role->permissions()->attach($permission);

        $this->assertTrue($role->hasPermission('manage-users'));
        $this->assertFalse($role->hasPermission('delete-company'));
    }

    public function test_user_can_check_if_has_permission_through_roles(): void
    {
        $user = User::factory()->create();

        $role = Role::create([
            'name' => 'Administrator',
            'slug' => 'administrator',
            'description' => 'System administrator role',
            'is_active' => true,
        ]);

        $permission = Permission::create([
            'name' => 'Manage Users',
            'slug' => 'manage-users',
            'module' => 'auth',
            'description' => 'Allows managing users',
            'is_active' => true,
        ]);

        $role->permissions()->attach($permission);
        $user->roles()->attach($role);

        $this->assertTrue($user->hasPermission('manage-users'));
        $this->assertFalse($user->hasPermission('delete-company'));
    }
}
