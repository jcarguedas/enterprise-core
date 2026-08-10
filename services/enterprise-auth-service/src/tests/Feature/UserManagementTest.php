<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_user(): void
    {
        $admin = User::factory()->create();

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
}
