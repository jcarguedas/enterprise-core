<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Permission;
use App\Models\Role;
use App\Models\SystemEvent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_with_view_customers_permission_can_list_customers(): void
    {
        $user = User::factory()->create();
        $this->givePermissions($user, ['view-customers']);

        Customer::create([
            'name' => 'Acme Corporation',
            'email' => 'billing@acme.test',
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/customers');

        $response->assertOk();

        $response->assertJsonPath('customers.0.name', 'Acme Corporation');
        $response->assertJsonPath('customers.0.email', 'billing@acme.test');
        $response->assertJsonStructure([
            'customers' => [
                [
                    'id',
                    'name',
                    'email',
                    'phone',
                    'identification_type',
                    'identification_number',
                    'address',
                    'notes',
                    'is_active',
                    'created_by_user_id',
                    'updated_by_user_id',
                    'created_at',
                    'updated_at',
                ],
            ],
        ]);
    }

    public function test_user_without_view_customers_permission_cannot_list_customers(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/customers');

        $response->assertForbidden();

        $response->assertJson([
            'message' => 'This action is unauthorized.',
        ]);
    }

    public function test_user_with_view_customers_permission_can_view_customer_detail(): void
    {
        $user = User::factory()->create();
        $this->givePermissions($user, ['view-customers']);

        $customer = Customer::create([
            'name' => 'Detail Customer',
            'email' => 'detail@example.test',
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson("/api/customers/{$customer->id}");

        $response->assertOk();

        $response->assertJsonPath('customer.id', $customer->id);
        $response->assertJsonPath('customer.name', 'Detail Customer');
    }

    public function test_user_with_manage_customers_permission_can_create_customer(): void
    {
        $user = User::factory()->create();
        $this->givePermissions($user, ['manage-customers']);

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/customers', [
                'name' => 'New Customer',
                'email' => 'customer@example.test',
                'phone' => '+506 2222 3333',
                'identification_type' => 'tax_id',
                'identification_number' => '123456789',
                'address' => 'San Jose',
                'notes' => 'Preferred billing contact.',
            ]);

        $response->assertCreated();

        $response->assertJsonPath('customer.name', 'New Customer');
        $response->assertJsonPath('customer.is_active', true);
        $response->assertJsonPath('customer.created_by_user_id', $user->id);
        $response->assertJsonPath('customer.updated_by_user_id', $user->id);

        $this->assertDatabaseHas('customers', [
            'name' => 'New Customer',
            'email' => 'customer@example.test',
            'is_active' => true,
            'created_by_user_id' => $user->id,
            'updated_by_user_id' => $user->id,
        ]);
    }

    public function test_user_without_manage_customers_permission_cannot_create_customer(): void
    {
        $user = User::factory()->create();
        $this->givePermissions($user, ['view-customers']);

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/customers', [
                'name' => 'Blocked Customer',
            ]);

        $response->assertForbidden();

        $this->assertDatabaseMissing('customers', [
            'name' => 'Blocked Customer',
        ]);
    }

    public function test_create_customer_validates_required_name(): void
    {
        $user = User::factory()->create();
        $this->givePermissions($user, ['manage-customers']);

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/customers', [
                'email' => 'missing-name@example.test',
            ]);

        $response->assertUnprocessable();

        $response->assertJsonValidationErrors([
            'name',
        ]);
    }

    public function test_created_customer_defaults_to_active(): void
    {
        $user = User::factory()->create();
        $this->givePermissions($user, ['manage-customers']);

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/customers', [
                'name' => 'Active By Default',
            ]);

        $response->assertCreated();

        $response->assertJsonPath('customer.is_active', true);
    }

    public function test_user_with_manage_customers_permission_can_update_customer(): void
    {
        $user = User::factory()->create();
        $this->givePermissions($user, ['manage-customers']);

        $customer = Customer::create([
            'name' => 'Original Customer',
            'email' => 'original@example.test',
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->patchJson("/api/customers/{$customer->id}", [
                'name' => 'Updated Customer',
                'email' => 'updated@example.test',
                'notes' => 'Internal notes should not appear in event metadata.',
            ]);

        $response->assertOk();

        $response->assertJsonPath('customer.name', 'Updated Customer');
        $response->assertJsonPath('customer.email', 'updated@example.test');
        $response->assertJsonPath('customer.updated_by_user_id', $user->id);
    }

    public function test_user_without_manage_customers_permission_cannot_update_customer(): void
    {
        $user = User::factory()->create();
        $this->givePermissions($user, ['view-customers']);

        $customer = Customer::create([
            'name' => 'Original Customer',
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->patchJson("/api/customers/{$customer->id}", [
                'name' => 'Blocked Update',
            ]);

        $response->assertForbidden();

        $this->assertDatabaseHas('customers', [
            'id' => $customer->id,
            'name' => 'Original Customer',
        ]);
    }

    public function test_update_customer_active_status_creates_activated_and_deactivated_events(): void
    {
        $user = User::factory()->create();
        $this->givePermissions($user, ['manage-customers']);

        $customer = Customer::create([
            'name' => 'Status Customer',
            'is_active' => true,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        $deactivateResponse = $this->withToken($token)
            ->patchJson("/api/customers/{$customer->id}", [
                'is_active' => false,
            ]);

        $deactivateResponse->assertOk();

        $activateResponse = $this->withToken($token)
            ->patchJson("/api/customers/{$customer->id}", [
                'is_active' => true,
            ]);

        $activateResponse->assertOk();

        $this->assertDatabaseHas('system_events', [
            'event_type' => 'customers.deactivated',
            'target_type' => 'customer',
            'target_id' => (string) $customer->id,
        ]);

        $this->assertDatabaseHas('system_events', [
            'event_type' => 'customers.activated',
            'target_type' => 'customer',
            'target_id' => (string) $customer->id,
        ]);
    }

    public function test_creating_customer_creates_system_event(): void
    {
        $user = User::factory()->create();
        $this->givePermissions($user, ['manage-customers']);

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/customers', [
                'name' => 'Event Customer',
                'email' => 'event@example.test',
                'notes' => 'Do not log this note.',
            ]);

        $response->assertCreated();

        $customer = Customer::where('email', 'event@example.test')->firstOrFail();
        $event = SystemEvent::where('event_type', 'customers.created')->firstOrFail();

        $this->assertSame($user->id, $event->actor_user_id);
        $this->assertSame('customer', $event->target_type);
        $this->assertSame((string) $customer->id, $event->target_id);
        $this->assertSame([
            'target_name' => 'Event Customer',
            'target_email' => 'event@example.test',
        ], $event->metadata);
        $this->assertStringNotContainsString('Do not log this note.', json_encode($event->toArray()));
    }

    public function test_updating_customer_creates_system_event(): void
    {
        $user = User::factory()->create();
        $this->givePermissions($user, ['manage-customers']);

        $customer = Customer::create([
            'name' => 'Original Customer',
            'email' => 'original@example.test',
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->patchJson("/api/customers/{$customer->id}", [
                'name' => 'Updated Event Customer',
                'email' => 'updated-event@example.test',
                'notes' => 'Do not log updated notes.',
            ]);

        $response->assertOk();

        $event = SystemEvent::where('event_type', 'customers.updated')->firstOrFail();

        $this->assertSame($user->id, $event->actor_user_id);
        $this->assertSame('customer', $event->target_type);
        $this->assertSame((string) $customer->id, $event->target_id);
        $this->assertSame('Updated Event Customer', $event->metadata['target_name']);
        $this->assertSame('updated-event@example.test', $event->metadata['target_email']);
        $this->assertStringNotContainsString('Do not log updated notes.', json_encode($event->toArray()));
    }

    public function test_guest_cannot_access_customer_routes(): void
    {
        $customer = Customer::create([
            'name' => 'Guest Customer',
        ]);

        $this->getJson('/api/customers')->assertUnauthorized();
        $this->getJson("/api/customers/{$customer->id}")->assertUnauthorized();
        $this->postJson('/api/customers', ['name' => 'Guest Create'])->assertUnauthorized();
        $this->patchJson("/api/customers/{$customer->id}", ['name' => 'Guest Update'])->assertUnauthorized();
    }

    public function test_inactive_authenticated_user_cannot_access_customer_routes(): void
    {
        $user = User::factory()->create([
            'is_active' => false,
        ]);
        $this->givePermissions($user, ['view-customers', 'manage-customers']);

        $customer = Customer::create([
            'name' => 'Inactive User Customer',
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        $this->withToken($token)->getJson('/api/customers')->assertForbidden();
        $this->withToken($token)->getJson("/api/customers/{$customer->id}")->assertForbidden();
        $this->withToken($token)->postJson('/api/customers', ['name' => 'Inactive Create'])->assertForbidden();
        $this->withToken($token)->patchJson("/api/customers/{$customer->id}", ['name' => 'Inactive Update'])->assertForbidden();
    }

    /**
     * @param  string[]  $permissionSlugs
     */
    private function givePermissions(User $user, array $permissionSlugs): void
    {
        $role = Role::updateOrCreate(
            ['slug' => 'administrator'],
            [
                'name' => 'Administrator',
                'description' => 'System administrator role',
                'is_active' => true,
            ]
        );

        foreach ($permissionSlugs as $permissionSlug) {
            $permission = Permission::updateOrCreate(
                ['slug' => $permissionSlug],
                [
                    'name' => str($permissionSlug)->replace('-', ' ')->title()->toString(),
                    'module' => str($permissionSlug)->after('-')->toString(),
                    'description' => "Allows {$permissionSlug}.",
                    'is_active' => true,
                ]
            );

            $role->permissions()->syncWithoutDetaching([$permission->id]);
        }

        $user->roles()->syncWithoutDetaching([$role->id]);
    }
}
