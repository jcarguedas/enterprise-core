<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\SystemEvent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SystemEventsTest extends TestCase
{
    use RefreshDatabase;

    public function test_administrator_can_list_system_events(): void
    {
        $admin = User::factory()->create();
        $this->givePermission($admin, 'view-system-events');

        SystemEvent::create([
            'event_type' => 'auth.login.succeeded',
            'severity' => 'info',
            'message' => 'User logged in successfully.',
            'actor_user_id' => $admin->id,
            'actor_email' => $admin->email,
        ]);

        $token = $admin->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/system-events');

        $response->assertOk();

        $response->assertJsonPath('events.0.event_type', 'auth.login.succeeded');
        $response->assertJsonPath('events.0.actor_email', $admin->email);
    }

    public function test_user_without_view_system_events_permission_cannot_list_system_events(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/system-events');

        $response->assertForbidden();

        $response->assertJson([
            'message' => 'This action is unauthorized.',
        ]);
    }

    public function test_successful_login_creates_system_event(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'admin@example.com',
            'password' => 'password123',
        ]);

        $response->assertOk();

        $this->assertDatabaseHas('system_events', [
            'event_type' => 'auth.login.succeeded',
            'severity' => 'info',
            'actor_user_id' => $user->id,
            'actor_email' => 'admin@example.com',
        ]);
    }

    public function test_failed_login_creates_system_event_without_password(): void
    {
        User::factory()->create([
            'email' => 'admin@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'admin@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertUnauthorized();

        $event = SystemEvent::where('event_type', 'auth.login.failed')->firstOrFail();

        $this->assertSame('warning', $event->severity);
        $this->assertSame('admin@example.com', $event->actor_email);
        $this->assertSame(['attempted_email' => 'admin@example.com'], $event->metadata);
        $this->assertStringNotContainsString('wrong-password', json_encode($event->toArray()));
        $this->assertStringNotContainsString('password123', json_encode($event->toArray()));
    }

    public function test_logout_creates_system_event(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@example.com',
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/logout');

        $response->assertOk();

        $this->assertDatabaseHas('system_events', [
            'event_type' => 'auth.logout',
            'severity' => 'info',
            'actor_user_id' => $user->id,
            'actor_email' => 'admin@example.com',
        ]);
    }

    public function test_creating_user_creates_system_event(): void
    {
        $admin = User::factory()->create();
        $this->givePermission($admin, 'manage-users');

        $token = $admin->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/users', [
                'name' => 'New User',
                'email' => 'new@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

        $response->assertCreated();

        $createdUser = User::where('email', 'new@example.com')->firstOrFail();

        $this->assertDatabaseHas('system_events', [
            'event_type' => 'users.created',
            'severity' => 'info',
            'actor_user_id' => $admin->id,
            'target_type' => 'user',
            'target_id' => (string) $createdUser->id,
        ]);
    }

    public function test_updating_user_profile_creates_system_event(): void
    {
        $admin = User::factory()->create();
        $user = User::factory()->create([
            'name' => 'Original User',
            'email' => 'original@example.com',
        ]);

        $this->givePermission($admin, 'manage-users');

        $token = $admin->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->patchJson("/api/users/{$user->id}", [
                'name' => 'Updated User',
                'email' => 'updated@example.com',
            ]);

        $response->assertOk();

        $this->assertDatabaseHas('system_events', [
            'event_type' => 'users.updated',
            'severity' => 'info',
            'actor_user_id' => $admin->id,
            'target_type' => 'user',
            'target_id' => (string) $user->id,
        ]);
    }

    public function test_updating_user_active_status_creates_activated_and_deactivated_events(): void
    {
        $admin = User::factory()->create();
        $user = User::factory()->create([
            'is_active' => true,
        ]);

        $this->givePermission($admin, 'manage-users');

        $token = $admin->createToken('auth-token')->plainTextToken;

        $deactivateResponse = $this->withToken($token)
            ->patchJson("/api/users/{$user->id}", [
                'is_active' => false,
            ]);

        $deactivateResponse->assertOk();

        $activateResponse = $this->withToken($token)
            ->patchJson("/api/users/{$user->id}", [
                'is_active' => true,
            ]);

        $activateResponse->assertOk();

        $this->assertDatabaseHas('system_events', [
            'event_type' => 'users.deactivated',
            'target_type' => 'user',
            'target_id' => (string) $user->id,
        ]);

        $this->assertDatabaseHas('system_events', [
            'event_type' => 'users.activated',
            'target_type' => 'user',
            'target_id' => (string) $user->id,
        ]);
    }

    public function test_assigning_and_removing_roles_create_system_events(): void
    {
        $admin = User::factory()->create();
        $user = User::factory()->create();

        $role = Role::create([
            'name' => 'Operator',
            'slug' => 'operator',
            'description' => 'Operator role',
            'is_active' => true,
        ]);

        $this->givePermission($admin, 'manage-users');

        $token = $admin->createToken('auth-token')->plainTextToken;

        $assignResponse = $this->withToken($token)
            ->postJson("/api/users/{$user->id}/roles", [
                'role_id' => $role->id,
            ]);

        $assignResponse->assertOk();

        $removeResponse = $this->withToken($token)
            ->deleteJson("/api/users/{$user->id}/roles/{$role->id}");

        $removeResponse->assertOk();

        $this->assertDatabaseHas('system_events', [
            'event_type' => 'users.roles.assigned',
            'actor_user_id' => $admin->id,
            'target_type' => 'user',
            'target_id' => (string) $user->id,
        ]);

        $this->assertDatabaseHas('system_events', [
            'event_type' => 'users.roles.removed',
            'actor_user_id' => $admin->id,
            'target_type' => 'user',
            'target_id' => (string) $user->id,
        ]);
    }

    private function givePermission(User $user, string $permissionSlug): void
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
            ['slug' => $permissionSlug],
            [
                'name' => str($permissionSlug)->replace('-', ' ')->title()->toString(),
                'module' => $permissionSlug === 'view-system-events' ? 'system' : 'auth',
                'description' => "Allows {$permissionSlug}.",
                'is_active' => true,
            ]
        );

        $role->permissions()->syncWithoutDetaching([$permission->id]);
        $user->roles()->syncWithoutDetaching([$role->id]);
    }
}
