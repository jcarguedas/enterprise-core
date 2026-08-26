<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\SystemEventLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct(private SystemEventLogger $systemEvents)
    {
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (
            ! $user ||
            ! $user->is_active ||
            ! Hash::check($credentials['password'], $user->password)
        ) {
            $this->systemEvents->log(
                eventType: 'auth.login.failed',
                severity: 'warning',
                message: 'Failed login attempt.',
                actorEmail: $credentials['email'],
                metadata: [
                    'attempted_email' => $credentials['email'],
                ],
                request: $request,
            );

            return response()->json([
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        $this->systemEvents->log(
            eventType: 'auth.login.succeeded',
            severity: 'info',
            message: 'User logged in successfully.',
            actor: $user,
            request: $request,
        );

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        $user->load([
            'roles' => fn ($query) => $query
                ->select(['roles.id', 'roles.name', 'roles.slug', 'roles.description', 'roles.is_active'])
                ->where('roles.is_active', true)
                ->orderBy('roles.id')
                ->with([
                    'permissions' => fn ($query) => $query
                        ->select(['permissions.id', 'permissions.slug'])
                        ->where('permissions.is_active', true)
                        ->orderBy('permissions.slug'),
                ]),
        ]);

        $roles = $user->roles->map(fn ($role) => [
            'id' => $role->id,
            'name' => $role->name,
            'slug' => $role->slug,
            'description' => $role->description,
            'is_active' => (bool) $role->is_active,
        ]);

        $permissions = $user->roles
            ->flatMap(fn ($role) => $role->permissions->pluck('slug'))
            ->unique()
            ->sort()
            ->values();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $roles,
                'permissions' => $permissions,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        $this->systemEvents->log(
            eventType: 'auth.logout',
            severity: 'info',
            message: 'User logged out successfully.',
            actor: $user,
            request: $request,
        );

        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}
