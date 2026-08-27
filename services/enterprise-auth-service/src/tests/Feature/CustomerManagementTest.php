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
                    'legal_name',
                    'commercial_name',
                    'email',
                    'fiscal_email',
                    'phone',
                    'identification_type',
                    'identification_number',
                    'address',
                    'province',
                    'canton',
                    'district',
                    'neighborhood',
                    'other_signs',
                    'notes',
                    'fiscal_notes',
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
                'legal_name' => 'New Customer Sociedad Anonima',
                'commercial_name' => 'New Customer Store',
                'email' => 'customer@example.test',
                'fiscal_email' => 'invoices@example.test',
                'phone' => '+506 2222 3333',
                'identification_type' => 'tax_id',
                'identification_number' => '123456789',
                'address' => 'San Jose',
                'province' => 'San Jose',
                'canton' => 'Central',
                'district' => 'Carmen',
                'neighborhood' => 'Amon',
                'other_signs' => 'North side of the central park.',
                'notes' => 'Preferred billing contact.',
                'fiscal_notes' => 'Use fiscal profile once invoicing is implemented.',
            ]);

        $response->assertCreated();

        $response->assertJsonPath('customer.name', 'New Customer');
        $response->assertJsonPath('customer.legal_name', 'New Customer Sociedad Anonima');
        $response->assertJsonPath('customer.commercial_name', 'New Customer Store');
        $response->assertJsonPath('customer.fiscal_email', 'invoices@example.test');
        $response->assertJsonPath('customer.province', 'San Jose');
        $response->assertJsonPath('customer.canton', 'Central');
        $response->assertJsonPath('customer.district', 'Carmen');
        $response->assertJsonPath('customer.neighborhood', 'Amon');
        $response->assertJsonPath('customer.other_signs', 'North side of the central park.');
        $response->assertJsonPath('customer.fiscal_notes', 'Use fiscal profile once invoicing is implemented.');
        $response->assertJsonPath('customer.is_active', true);
        $response->assertJsonPath('customer.created_by_user_id', $user->id);
        $response->assertJsonPath('customer.updated_by_user_id', $user->id);

        $this->assertDatabaseHas('customers', [
            'name' => 'New Customer',
            'legal_name' => 'New Customer Sociedad Anonima',
            'commercial_name' => 'New Customer Store',
            'email' => 'customer@example.test',
            'fiscal_email' => 'invoices@example.test',
            'province' => 'San Jose',
            'canton' => 'Central',
            'district' => 'Carmen',
            'neighborhood' => 'Amon',
            'other_signs' => 'North side of the central park.',
            'fiscal_notes' => 'Use fiscal profile once invoicing is implemented.',
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

    public function test_create_customer_rejects_invalid_fiscal_email(): void
    {
        $user = User::factory()->create();
        $this->givePermissions($user, ['manage-customers']);

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/customers', [
                'name' => 'Invalid Fiscal Email',
                'fiscal_email' => 'not-an-email',
            ]);

        $response->assertUnprocessable();

        $response->assertJsonValidationErrors([
            'fiscal_email',
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
                'legal_name' => 'Updated Customer Limitada',
                'commercial_name' => 'Updated Customer Store',
                'email' => 'updated@example.test',
                'fiscal_email' => 'updated-invoices@example.test',
                'province' => 'Alajuela',
                'canton' => 'San Carlos',
                'district' => 'Quesada',
                'neighborhood' => 'Cedral',
                'other_signs' => 'Blue gate near the main road.',
                'notes' => 'Internal notes should not appear in event metadata.',
                'fiscal_notes' => 'Fiscal note for future invoicing only.',
            ]);

        $response->assertOk();

        $response->assertJsonPath('customer.name', 'Updated Customer');
        $response->assertJsonPath('customer.legal_name', 'Updated Customer Limitada');
        $response->assertJsonPath('customer.commercial_name', 'Updated Customer Store');
        $response->assertJsonPath('customer.email', 'updated@example.test');
        $response->assertJsonPath('customer.fiscal_email', 'updated-invoices@example.test');
        $response->assertJsonPath('customer.province', 'Alajuela');
        $response->assertJsonPath('customer.canton', 'San Carlos');
        $response->assertJsonPath('customer.district', 'Quesada');
        $response->assertJsonPath('customer.neighborhood', 'Cedral');
        $response->assertJsonPath('customer.other_signs', 'Blue gate near the main road.');
        $response->assertJsonPath('customer.fiscal_notes', 'Fiscal note for future invoicing only.');
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
                'fiscal_email' => 'fiscal-event@example.test',
                'address' => 'Sensitive exact address.',
                'province' => 'San Jose',
                'canton' => 'Central',
                'district' => 'Carmen',
                'neighborhood' => 'Amon',
                'other_signs' => 'Sensitive location details.',
                'notes' => 'Do not log this note.',
                'fiscal_notes' => 'Do not log this fiscal note.',
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
        $this->assertStringNotContainsString('Do not log this fiscal note.', json_encode($event->toArray()));
        $this->assertStringNotContainsString('Sensitive exact address.', json_encode($event->toArray()));
        $this->assertStringNotContainsString('Sensitive location details.', json_encode($event->toArray()));
        $this->assertStringNotContainsString('fiscal-event@example.test', json_encode($event->toArray()));
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
                'fiscal_email' => 'updated-fiscal-event@example.test',
                'address' => 'Updated sensitive exact address.',
                'province' => 'Cartago',
                'canton' => 'Central',
                'district' => 'Oriental',
                'neighborhood' => 'Los Angeles',
                'other_signs' => 'Updated sensitive location details.',
                'notes' => 'Do not log updated notes.',
                'fiscal_notes' => 'Do not log updated fiscal notes.',
            ]);

        $response->assertOk();

        $event = SystemEvent::where('event_type', 'customers.updated')->firstOrFail();

        $this->assertSame($user->id, $event->actor_user_id);
        $this->assertSame('customer', $event->target_type);
        $this->assertSame((string) $customer->id, $event->target_id);
        $this->assertSame([
            'target_name' => 'Updated Event Customer',
            'target_email' => 'updated-event@example.test',
        ], $event->metadata);
        $this->assertStringNotContainsString('Do not log updated notes.', json_encode($event->toArray()));
        $this->assertStringNotContainsString('Do not log updated fiscal notes.', json_encode($event->toArray()));
        $this->assertStringNotContainsString('Updated sensitive exact address.', json_encode($event->toArray()));
        $this->assertStringNotContainsString('Updated sensitive location details.', json_encode($event->toArray()));
        $this->assertStringNotContainsString('fiscal_email', json_encode($event->toArray()));
        $this->assertStringNotContainsString('updated-fiscal-event@example.test', json_encode($event->toArray()));
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
