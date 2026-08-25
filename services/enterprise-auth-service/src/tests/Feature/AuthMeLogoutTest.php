<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthMeLogoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_get_profile(): void
    {
        $user = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'is_active' => true,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/me');

        $response->assertOk();

        $response->assertJson([
            'user' => [
                'id' => $user->id,
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'roles' => [],
                'permissions' => [],
            ],
        ]);
    }

    public function test_authenticated_user_receives_active_roles(): void
    {
        $user = User::factory()->create([
            'is_active' => true,
        ]);

        $activeRole = Role::create([
            'name' => 'Admin',
            'slug' => 'admin',
            'description' => 'Administrative access',
            'is_active' => true,
        ]);

        $inactiveRole = Role::create([
            'name' => 'Inactive Admin',
            'slug' => 'inactive-admin',
            'description' => 'Inactive administrative access',
            'is_active' => false,
        ]);

        $user->roles()->attach([$activeRole->id, $inactiveRole->id]);

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/me');

        $response->assertOk();

        $response->assertJson([
            'user' => [
                'roles' => [
                    [
                        'id' => $activeRole->id,
                        'name' => 'Admin',
                        'slug' => 'admin',
                        'description' => 'Administrative access',
                        'is_active' => true,
                    ],
                ],
            ],
        ]);

        $response->assertJsonMissing([
            'slug' => 'inactive-admin',
        ]);
    }

    public function test_authenticated_user_receives_unique_sorted_active_permission_slugs(): void
    {
        $user = User::factory()->create([
            'is_active' => true,
        ]);

        $firstRole = Role::create([
            'name' => 'Operations',
            'slug' => 'operations',
            'description' => 'Operations access',
            'is_active' => true,
        ]);

        $secondRole = Role::create([
            'name' => 'Support',
            'slug' => 'support',
            'description' => 'Support access',
            'is_active' => true,
        ]);

        $inactiveRole = Role::create([
            'name' => 'Inactive Billing',
            'slug' => 'inactive-billing',
            'description' => 'Inactive billing access',
            'is_active' => false,
        ]);

        $manageUsers = Permission::create([
            'name' => 'Manage Users',
            'slug' => 'manage-users',
            'module' => 'users',
            'description' => 'Manage users',
            'is_active' => true,
        ]);

        $viewReports = Permission::create([
            'name' => 'View Reports',
            'slug' => 'view-reports',
            'module' => 'reports',
            'description' => 'View reports',
            'is_active' => true,
        ]);

        $inactivePermission = Permission::create([
            'name' => 'Delete Users',
            'slug' => 'delete-users',
            'module' => 'users',
            'description' => 'Delete users',
            'is_active' => false,
        ]);

        $billingPermission = Permission::create([
            'name' => 'Manage Billing',
            'slug' => 'manage-billing',
            'module' => 'billing',
            'description' => 'Manage billing',
            'is_active' => true,
        ]);

        $firstRole->permissions()->attach([$viewReports->id, $manageUsers->id, $inactivePermission->id]);
        $secondRole->permissions()->attach([$manageUsers->id]);
        $inactiveRole->permissions()->attach([$billingPermission->id]);
        $user->roles()->attach([$firstRole->id, $secondRole->id, $inactiveRole->id]);

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/me');

        $response->assertOk();

        $response->assertJsonPath('user.permissions', [
            'manage-users',
            'view-reports',
        ]);
    }

    public function test_inactive_authenticated_user_with_existing_token_cannot_get_profile(): void
    {
        $user = User::factory()->create([
            'is_active' => false,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/me');

        $response->assertForbidden();

        $response->assertJson([
            'message' => 'Your account is inactive.',
        ]);
    }

    public function test_guest_cannot_get_profile(): void
    {
        $response = $this->getJson('/api/me');

        $response->assertUnauthorized();
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::factory()->create();

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/logout');

        $response->assertOk();

        $response->assertJson([
            'message' => 'Logged out successfully.',
        ]);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_guest_cannot_logout(): void
    {
        $response = $this->postJson('/api/logout');

        $response->assertUnauthorized();
    }
}
