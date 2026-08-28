<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\SystemEvent;
use App\Models\TaxpayerLookupCache;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class TaxpayerLookupTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_use_taxpayer_lookup_endpoint(): void
    {
        $this->getJson('/api/taxpayer-lookup?identification_number=3101123456')
            ->assertUnauthorized();
    }

    public function test_inactive_user_cannot_use_taxpayer_lookup_endpoint(): void
    {
        $user = User::factory()->create([
            'is_active' => false,
        ]);
        $this->givePermission($user, 'lookup-taxpayer');

        $token = $user->createToken('auth-token')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/taxpayer-lookup?identification_number=3101123456')
            ->assertForbidden();
    }

    public function test_user_without_lookup_taxpayer_permission_cannot_use_endpoint(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth-token')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/taxpayer-lookup?identification_number=3101123456')
            ->assertForbidden();
    }

    public function test_lookup_validates_required_identification_number(): void
    {
        $user = User::factory()->create();
        $this->givePermission($user, 'lookup-taxpayer');

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)->getJson('/api/taxpayer-lookup');

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['identification_number']);
    }

    public function test_lookup_identification_number_must_be_numeric(): void
    {
        $user = User::factory()->create();
        $this->givePermission($user, 'lookup-taxpayer');

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/taxpayer-lookup?identification_number=ABC123456');

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['identification_number']);
    }

    public function test_lookup_identification_number_must_be_between_9_and_12_digits(): void
    {
        $user = User::factory()->create();
        $this->givePermission($user, 'lookup-taxpayer');

        $token = $user->createToken('auth-token')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/taxpayer-lookup?identification_number=12345678')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['identification_number']);

        $this->withToken($token)
            ->getJson('/api/taxpayer-lookup?identification_number=1234567890123')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['identification_number']);
    }

    public function test_successful_live_hacienda_response_returns_normalized_taxpayer_payload(): void
    {
        Http::fake([
            'https://api.hacienda.go.cr/fe/ae*' => Http::response($this->haciendaPayload(), 200),
        ]);

        $user = User::factory()->create();
        $this->givePermission($user, 'lookup-taxpayer');

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/taxpayer-lookup?identification_number=3101123456');

        $response->assertOk();
        $response->assertJsonPath('source', 'live');
        $response->assertJsonPath('taxpayer.identification_number', '3101123456');
        $response->assertJsonPath('taxpayer.name', 'ACME SOCIEDAD ANONIMA');
        $response->assertJsonPath('taxpayer.identification_type', '02');
        $response->assertJsonPath('taxpayer.tax_regime', 'Traditional');
        $response->assertJsonPath('taxpayer.tax_status', 'Active');
        $response->assertJsonPath('taxpayer.economic_activities.0.code', '6201.0');
        $response->assertJsonPath('taxpayer.economic_activities.0.name', 'Software development');
        $response->assertJsonPath('taxpayer.economic_activities.0.status', 'Active');
    }

    public function test_successful_live_response_creates_cache(): void
    {
        Http::fake([
            'https://api.hacienda.go.cr/fe/ae*' => Http::response($this->haciendaPayload(), 200),
        ]);

        $user = User::factory()->create();
        $this->givePermission($user, 'lookup-taxpayer');

        $token = $user->createToken('auth-token')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/taxpayer-lookup?identification_number=3101123456')
            ->assertOk();

        $this->assertDatabaseHas('taxpayer_lookup_caches', [
            'identification_number' => '3101123456',
            'source' => 'hacienda',
            'status' => 'success',
            'http_status' => 200,
        ]);

        $cache = TaxpayerLookupCache::firstOrFail();

        $this->assertSame('ACME SOCIEDAD ANONIMA', $cache->normalized_payload['name']);
        $this->assertNotNull($cache->fetched_at);
        $this->assertNotNull($cache->expires_at);
    }

    public function test_second_lookup_uses_cache_and_does_not_call_hacienda_again(): void
    {
        TaxpayerLookupCache::create([
            'identification_number' => '3101123456',
            'source' => 'hacienda',
            'payload' => ['nombre' => 'Cached raw taxpayer data'],
            'normalized_payload' => [
                'identification_number' => '3101123456',
                'name' => 'Cached Customer',
                'identification_type' => '02',
                'tax_regime' => null,
                'tax_status' => null,
                'economic_activities' => [],
            ],
            'status' => 'success',
            'http_status' => 200,
            'fetched_at' => now()->subHour(),
            'expires_at' => now()->addHours(23),
        ]);

        Http::fake([
            'https://api.hacienda.go.cr/fe/ae*' => Http::response($this->haciendaPayload(), 200),
        ]);

        $user = User::factory()->create();
        $this->givePermission($user, 'lookup-taxpayer');

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/taxpayer-lookup?identification_number=3101123456');

        $response->assertOk();
        $response->assertJsonPath('source', 'cache');
        $response->assertJsonPath('taxpayer.name', 'Cached Customer');

        Http::assertNothingSent();
    }

    public function test_hacienda_404_returns_friendly_error(): void
    {
        $response = $this->lookupWithHaciendaResponse(404);

        $response->assertNotFound();
        $response->assertJson([
            'message' => 'No Hacienda taxpayer record was found for the provided identification number.',
        ]);
    }

    public function test_hacienda_429_returns_friendly_error(): void
    {
        $response = $this->lookupWithHaciendaResponse(429);

        $response->assertStatus(429);
        $response->assertJson([
            'message' => 'Hacienda taxpayer lookup is temporarily rate limited. Please try again later.',
        ]);
    }

    public function test_hacienda_5xx_returns_friendly_error(): void
    {
        $response = $this->lookupWithHaciendaResponse(500);

        $response->assertStatus(503);
        $response->assertJson([
            'message' => 'Hacienda taxpayer lookup is unavailable. Please try again later.',
        ]);
    }

    public function test_connection_exception_returns_friendly_error(): void
    {
        Http::fake(function () {
            throw new ConnectionException('Connection timed out.');
        });

        $user = User::factory()->create();
        $this->givePermission($user, 'lookup-taxpayer');

        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/taxpayer-lookup?identification_number=3101123456');

        $response->assertStatus(503);
        $response->assertJson([
            'message' => 'Unable to reach Hacienda taxpayer lookup. Please try again later.',
        ]);
    }

    public function test_successful_lookup_creates_safe_system_event_without_raw_payload(): void
    {
        Http::fake([
            'https://api.hacienda.go.cr/fe/ae*' => Http::response([
                ...$this->haciendaPayload(),
                'sensitive_raw_value' => 'do-not-log-this-success-payload',
            ], 200),
        ]);

        $user = User::factory()->create();
        $this->givePermission($user, 'lookup-taxpayer');

        $token = $user->createToken('auth-token')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/taxpayer-lookup?identification_number=3101123456')
            ->assertOk();

        $event = SystemEvent::where('event_type', 'taxpayer_lookup.succeeded')->firstOrFail();

        $this->assertSame($user->id, $event->actor_user_id);
        $this->assertSame('taxpayer_lookup', $event->target_type);
        $this->assertSame('******3456', $event->target_id);
        $this->assertSame([
            'source' => 'live',
            'http_status' => 200,
            'identification_number' => '******3456',
        ], $event->metadata);
        $this->assertStringNotContainsString('do-not-log-this-success-payload', json_encode($event->toArray()));
        $this->assertStringNotContainsString('ACME SOCIEDAD ANONIMA', json_encode($event->toArray()));
        $this->assertStringNotContainsString('6201.0', json_encode($event->toArray()));
        $this->assertStringNotContainsString('3101123456', json_encode($event->toArray()));
    }

    public function test_failed_lookup_creates_safe_system_event_without_raw_payload(): void
    {
        Http::fake([
            'https://api.hacienda.go.cr/fe/ae*' => Http::response([
                'message' => 'do-not-log-this-error-payload',
            ], 500),
        ]);

        $user = User::factory()->create();
        $this->givePermission($user, 'lookup-taxpayer');

        $token = $user->createToken('auth-token')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/taxpayer-lookup?identification_number=3101123456')
            ->assertStatus(503);

        $event = SystemEvent::where('event_type', 'taxpayer_lookup.failed')->firstOrFail();

        $this->assertSame($user->id, $event->actor_user_id);
        $this->assertSame('taxpayer_lookup', $event->target_type);
        $this->assertSame('******3456', $event->target_id);
        $this->assertSame([
            'source' => 'live',
            'http_status' => 500,
            'identification_number' => '******3456',
        ], $event->metadata);
        $this->assertStringNotContainsString('do-not-log-this-error-payload', json_encode($event->toArray()));
        $this->assertStringNotContainsString('3101123456', json_encode($event->toArray()));
    }

    /**
     * @return array<string, mixed>
     */
    private function haciendaPayload(): array
    {
        return [
            'nombre' => 'ACME SOCIEDAD ANONIMA',
            'tipoIdentificacion' => '02',
            'regimen' => 'Traditional',
            'situacion' => [
                'estado' => 'Active',
            ],
            'actividades' => [
                [
                    'codigo' => '6201.0',
                    'descripcion' => 'Software development',
                    'estado' => 'Active',
                ],
            ],
        ];
    }

    private function lookupWithHaciendaResponse(int $status)
    {
        Http::fake([
            'https://api.hacienda.go.cr/fe/ae*' => Http::response([
                'message' => 'raw Hacienda error',
            ], $status),
        ]);

        $user = User::factory()->create();
        $this->givePermission($user, 'lookup-taxpayer');

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->withToken($token)
            ->getJson('/api/taxpayer-lookup?identification_number=3101123456');
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
                'module' => 'customers',
                'description' => "Allows {$permissionSlug}.",
                'is_active' => true,
            ]
        );

        $role->permissions()->syncWithoutDetaching([$permission->id]);
        $user->roles()->syncWithoutDetaching([$role->id]);
    }
}
