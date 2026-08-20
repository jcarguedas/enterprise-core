<?php

namespace Tests\Feature;

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
            ],
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
