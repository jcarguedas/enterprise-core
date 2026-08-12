<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
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

    public function test_authenticated_user_with_manage_users_permission_can_view_user_detail(): void
    {
        $admin = User::factory()->create();

        $user = User::factory()->create([
            'name' => 'Detail User',
            'email' => 'detail@example.com',
        ]);

        $this->giveManageUsersPermission($admin);

        $token = $admin->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson("/api/users/{$user->id}");

        $response->assertOk();

        $response->assertExactJson([
            'user' => [
                'id' => $user->id,
                'name' => 'Detail User',
                'email' => 'detail@example.com',
            ],
        ]);
    }

    public function test_guest_cannot_view_user_detail(): void
    {
        $user = User::factory()->create();

        $response = $this->getJson("/api/users/{$user->id}");

        $response->assertUnauthorized();
    }

    public function test_authenticated_user_without_manage_users_permission_cannot_view_user_detail(): void
    {
        $user = User::factory()->create();
        $targetUser = User::factory()->create();

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson("/api/users/{$targetUser->id}");

        $response->assertForbidden();

        $response->assertJson([
            'message' => 'This action is unauthorized.',
        ]);
    }

    public function test_authenticated_user_with_manage_users_permission_receives_not_found_for_missing_user_detail(): void
    {
        $admin = User::factory()->create();

        $this->giveManageUsersPermission($admin);

        $token = $admin->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/users/999999');

        $response->assertNotFound();
    }

    public function test_authenticated_user_with_manage_users_permission_can_update_user_name_and_email(): void
    {
        $admin = User::factory()->create();
        $user = User::factory()->create([
            'name' => 'Original User',
            'email' => 'original@example.com',
        ]);

        $this->giveManageUsersPermission($admin);

        $token = $admin->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->patchJson("/api/users/{$user->id}", [
                'name' => 'Updated User',
                'email' => 'updated@example.com',
            ]);

        $response->assertOk();

        $response->assertExactJson([
            'user' => [
                'id' => $user->id,
                'name' => 'Updated User',
                'email' => 'updated@example.com',
            ],
        ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated User',
            'email' => 'updated@example.com',
        ]);
    }

    public function test_authenticated_user_with_manage_users_permission_can_update_user_password(): void
    {
        $admin = User::factory()->create();
        $user = User::factory()->create([
            'password' => 'old-password',
        ]);

        $this->giveManageUsersPermission($admin);

        $token = $admin->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->patchJson("/api/users/{$user->id}", [
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ]);

        $response->assertOk();

        $response->assertExactJson([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);

        $this->assertTrue(Hash::check('new-password', $user->fresh()->password));
    }

    public function test_guest_cannot_update_user(): void
    {
        $user = User::factory()->create();

        $response = $this->patchJson("/api/users/{$user->id}", [
            'name' => 'Updated User',
        ]);

        $response->assertUnauthorized();
    }

    public function test_authenticated_user_without_manage_users_permission_cannot_update_user(): void
    {
        $user = User::factory()->create();
        $targetUser = User::factory()->create();

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->patchJson("/api/users/{$targetUser->id}", [
                'name' => 'Updated User',
            ]);

        $response->assertForbidden();

        $response->assertJson([
            'message' => 'This action is unauthorized.',
        ]);
    }

    public function test_authenticated_user_with_manage_users_permission_receives_not_found_for_missing_user_update(): void
    {
        $admin = User::factory()->create();

        $this->giveManageUsersPermission($admin);

        $token = $admin->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->patchJson('/api/users/999999', [
                'name' => 'Updated User',
            ]);

        $response->assertNotFound();
    }

    public function test_update_user_email_must_be_unique_except_for_user_being_updated(): void
    {
        $admin = User::factory()->create();
        $user = User::factory()->create([
            'email' => 'current@example.com',
        ]);
        $otherUser = User::factory()->create([
            'email' => 'other@example.com',
        ]);

        $this->giveManageUsersPermission($admin);

        $token = $admin->createToken('auth-token')->plainTextToken;

        $sameEmailResponse = $this->withToken($token)
            ->patchJson("/api/users/{$user->id}", [
                'email' => 'current@example.com',
            ]);

        $sameEmailResponse->assertOk();

        $duplicateEmailResponse = $this->withToken($token)
            ->patchJson("/api/users/{$user->id}", [
                'email' => $otherUser->email,
            ]);

        $duplicateEmailResponse->assertUnprocessable();

        $duplicateEmailResponse->assertJsonValidationErrors([
            'email',
        ]);
    }

    public function test_update_user_requires_valid_payload(): void
    {
        $admin = User::factory()->create();
        $user = User::factory()->create();

        $this->giveManageUsersPermission($admin);

        $token = $admin->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->patchJson("/api/users/{$user->id}", [
                'name' => '',
                'email' => 'not-an-email',
                'password' => 'short',
                'password_confirmation' => 'different',
            ]);

        $response->assertUnprocessable();

        $response->assertJsonValidationErrors([
            'name',
            'email',
            'password',
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

    public function test_authenticated_user_with_manage_users_permission_can_list_user_roles(): void
    {
        $admin = User::factory()->create();
        $user = User::factory()->create();

        $firstRole = Role::create([
            'name' => 'Operator',
            'slug' => 'operator',
            'description' => 'Operator role',
            'is_active' => true,
        ]);

        $secondRole = Role::create([
            'name' => 'Auditor',
            'slug' => 'auditor',
            'description' => 'Auditor role',
            'is_active' => false,
        ]);

        $user->roles()->syncWithoutDetaching([$secondRole->id, $firstRole->id]);

        $this->giveManageUsersPermission($admin);

        $token = $admin->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson("/api/users/{$user->id}/roles");

        $response->assertOk();

        $response->assertExactJson([
            'roles' => [
                [
                    'id' => $firstRole->id,
                    'name' => 'Operator',
                    'slug' => 'operator',
                    'description' => 'Operator role',
                    'is_active' => true,
                ],
                [
                    'id' => $secondRole->id,
                    'name' => 'Auditor',
                    'slug' => 'auditor',
                    'description' => 'Auditor role',
                    'is_active' => false,
                ],
            ],
        ]);
    }

    public function test_guest_cannot_list_user_roles(): void
    {
        $user = User::factory()->create();

        $response = $this->getJson("/api/users/{$user->id}/roles");

        $response->assertUnauthorized();
    }

    public function test_authenticated_user_without_manage_users_permission_cannot_list_user_roles(): void
    {
        $user = User::factory()->create();
        $targetUser = User::factory()->create();

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson("/api/users/{$targetUser->id}/roles");

        $response->assertForbidden();

        $response->assertJson([
            'message' => 'This action is unauthorized.',
        ]);
    }

    public function test_authenticated_user_with_manage_users_permission_receives_not_found_for_missing_user_roles(): void
    {
        $admin = User::factory()->create();

        $this->giveManageUsersPermission($admin);

        $token = $admin->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/users/999999/roles');

        $response->assertNotFound();
    }

    public function test_authenticated_user_with_manage_users_permission_can_assign_role_to_user(): void
    {
        $admin = User::factory()->create();
        $user = User::factory()->create();

        $role = Role::create([
            'name' => 'Operator',
            'slug' => 'operator',
            'description' => 'Operator role',
            'is_active' => true,
        ]);

        $this->giveManageUsersPermission($admin);

        $token = $admin->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson("/api/users/{$user->id}/roles", [
                'role_id' => $role->id,
            ]);

        $response->assertOk();

        $response->assertExactJson([
            'roles' => [
                [
                    'id' => $role->id,
                    'name' => 'Operator',
                    'slug' => 'operator',
                    'description' => 'Operator role',
                    'is_active' => true,
                ],
            ],
        ]);

        $this->assertDatabaseHas('role_user', [
            'role_id' => $role->id,
            'user_id' => $user->id,
        ]);
    }

    public function test_assigning_same_role_twice_does_not_create_duplicate_pivot_rows(): void
    {
        $admin = User::factory()->create();
        $user = User::factory()->create();

        $role = Role::create([
            'name' => 'Operator',
            'slug' => 'operator',
            'description' => 'Operator role',
            'is_active' => true,
        ]);

        $this->giveManageUsersPermission($admin);

        $token = $admin->createToken('auth-token')->plainTextToken;

        $this->withToken($token)
            ->postJson("/api/users/{$user->id}/roles", [
                'role_id' => $role->id,
            ])
            ->assertOk();

        $this->withToken($token)
            ->postJson("/api/users/{$user->id}/roles", [
                'role_id' => $role->id,
            ])
            ->assertOk()
            ->assertExactJson([
                'roles' => [
                    [
                        'id' => $role->id,
                        'name' => 'Operator',
                        'slug' => 'operator',
                        'description' => 'Operator role',
                        'is_active' => true,
                    ],
                ],
            ]);

        $this->assertSame(
            1,
            DB::table('role_user')
                ->where('role_id', $role->id)
                ->where('user_id', $user->id)
                ->count()
        );
    }

    public function test_guest_cannot_assign_user_roles(): void
    {
        $user = User::factory()->create();
        $role = Role::create([
            'name' => 'Operator',
            'slug' => 'operator',
            'description' => 'Operator role',
            'is_active' => true,
        ]);

        $response = $this->postJson("/api/users/{$user->id}/roles", [
            'role_id' => $role->id,
        ]);

        $response->assertUnauthorized();
    }

    public function test_authenticated_user_without_manage_users_permission_cannot_assign_user_roles(): void
    {
        $user = User::factory()->create();
        $targetUser = User::factory()->create();
        $role = Role::create([
            'name' => 'Operator',
            'slug' => 'operator',
            'description' => 'Operator role',
            'is_active' => true,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson("/api/users/{$targetUser->id}/roles", [
                'role_id' => $role->id,
            ]);

        $response->assertForbidden();

        $response->assertJson([
            'message' => 'This action is unauthorized.',
        ]);
    }

    public function test_assign_user_role_requires_valid_role_id(): void
    {
        $admin = User::factory()->create();
        $user = User::factory()->create();

        $this->giveManageUsersPermission($admin);

        $token = $admin->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson("/api/users/{$user->id}/roles", [
                'role_id' => 999999,
            ]);

        $response->assertUnprocessable();

        $response->assertJsonValidationErrors([
            'role_id',
        ]);
    }

    public function test_authenticated_user_with_manage_users_permission_receives_not_found_when_assigning_role_to_missing_user(): void
    {
        $admin = User::factory()->create();
        $role = Role::create([
            'name' => 'Operator',
            'slug' => 'operator',
            'description' => 'Operator role',
            'is_active' => true,
        ]);

        $this->giveManageUsersPermission($admin);

        $token = $admin->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/users/999999/roles', [
                'role_id' => $role->id,
            ]);

        $response->assertNotFound();
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
