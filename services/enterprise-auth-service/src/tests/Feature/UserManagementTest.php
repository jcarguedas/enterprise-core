<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_with_manage_users_permission_can_list_users(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);

        $firstUser = User::factory()->create([
            'name' => 'First User',
            'email' => 'first@example.com',
        ]);

        $secondUser = User::factory()->create([
            'name' => 'Second User',
            'email' => 'second@example.com',
        ]);

        $this->giveManageUsersPermission($admin);

        $token = $admin->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/users');

        $response->assertOk();

        $response->assertExactJson([
            'users' => [
                [
                    'id' => $admin->id,
                    'name' => 'Admin User',
                    'email' => 'admin@example.com',
                ],
                [
                    'id' => $firstUser->id,
                    'name' => 'First User',
                    'email' => 'first@example.com',
                ],
                [
                    'id' => $secondUser->id,
                    'name' => 'Second User',
                    'email' => 'second@example.com',
                ],
            ],
        ]);
    }

    public function test_guest_cannot_list_users(): void
    {
        $response = $this->getJson('/api/users');

        $response->assertUnauthorized();
    }

    public function test_authenticated_user_without_manage_users_permission_cannot_list_users(): void
    {
        $user = User::factory()->create();

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/users');

        $response->assertForbidden();

        $response->assertJson([
            'message' => 'This action is unauthorized.',
        ]);
    }

    public function test_authenticated_user_can_create_user(): void
    {
        $admin = User::factory()->create();

        $this->giveManageUsersPermission($admin);

        $token = $admin->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/users', [
                'name' => 'Operator User',
                'email' => 'operator@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

        $response->assertCreated();

        $response->assertJson([
            'user' => [
                'name' => 'Operator User',
                'email' => 'operator@example.com',
            ],
        ]);

        $this->assertDatabaseHas('users', [
            'name' => 'Operator User',
            'email' => 'operator@example.com',
        ]);
    }

    public function test_guest_cannot_create_user(): void
    {
        $response = $this->postJson('/api/users', [
            'name' => 'Operator User',
            'email' => 'operator@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertUnauthorized();
    }

    public function test_create_user_requires_valid_data(): void
    {
        $admin = User::factory()->create();

        $this->giveManageUsersPermission($admin);

        $token = $admin->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/users', []);

        $response->assertUnprocessable();

        $response->assertJsonValidationErrors([
            'name',
            'email',
            'password',
        ]);
    }

    public function test_create_user_requires_unique_email(): void
    {
        User::factory()->create([
            'email' => 'operator@example.com',
        ]);

        $admin = User::factory()->create();

        $this->giveManageUsersPermission($admin);

        $token = $admin->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/users', [
                'name' => 'Operator User',
                'email' => 'operator@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

        $response->assertUnprocessable();

        $response->assertJsonValidationErrors([
            'email',
        ]);
    }

    public function test_authenticated_user_without_manage_users_permission_cannot_create_user(): void
    {
        $user = User::factory()->create();

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/users', [
                'name' => 'Operator User',
                'email' => 'operator@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

        $response->assertForbidden();

        $response->assertJson([
            'message' => 'This action is unauthorized.',
        ]);
    }

    private function giveManageUsersPermission(User $user): void
    {
        $role = Role::updateOrCreate(
            ['slug' => 'administrator'],
            [
                'name' => 'Administrator',
                'description' => 'System administrator role',
                'is_active' => true,
            ]
        );

        $permission = Permission::updateOrCreate(
            ['slug' => 'manage-users'],
            [
                'name' => 'Manage Users',
                'module' => 'auth',
                'description' => 'Allows managing users.',
                'is_active' => true,
            ]
        );

        $role->permissions()->syncWithoutDetaching([$permission->id]);
        $user->roles()->syncWithoutDetaching([$role->id]);
    }
}
