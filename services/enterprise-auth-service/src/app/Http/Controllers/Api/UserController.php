<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\SystemEventLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function __construct(private SystemEventLogger $systemEvents)
    {
    }

    public function index(): JsonResponse
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'is_active'])
            ->orderBy('id')
            ->get()
            ->map(fn (User $user): array => $this->userPayload($user));

        return response()->json([
            'users' => $users,
        ]);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json([
            'user' => $this->userPayload($user),
        ]);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $wasActive = (bool) $user->is_active;

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => ['sometimes', 'required', 'string', 'min:8', 'confirmed'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if (
            array_key_exists('is_active', $validated) &&
            $validated['is_active'] === false &&
            $request->user()->is($user)
        ) {
            throw ValidationException::withMessages([
                'is_active' => ['You cannot deactivate your own account.'],
            ]);
        }

        $user->update($validated);
        $user->refresh();

        if (array_key_exists('is_active', $validated) && $wasActive !== (bool) $user->is_active) {
            $this->systemEvents->log(
                eventType: $user->is_active ? 'users.activated' : 'users.deactivated',
                severity: 'info',
                message: $user->is_active ? 'User activated.' : 'User deactivated.',
                actor: $request->user(),
                targetType: 'user',
                targetId: $user->id,
                metadata: [
                    'target_email' => $user->email,
                ],
                request: $request,
            );
        } else {
            $this->systemEvents->log(
                eventType: 'users.updated',
                severity: 'info',
                message: 'User updated.',
                actor: $request->user(),
                targetType: 'user',
                targetId: $user->id,
                metadata: [
                    'target_email' => $user->email,
                    'updated_fields' => array_keys($validated),
                ],
                request: $request,
            );
        }

        return response()->json([
            'user' => $this->userPayload($user),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create($validated);
        $user->refresh();

        $this->systemEvents->log(
            eventType: 'users.created',
            severity: 'info',
            message: 'User created.',
            actor: $request->user(),
            targetType: 'user',
            targetId: $user->id,
            metadata: [
                'target_email' => $user->email,
            ],
            request: $request,
        );

        return response()->json([
            'user' => $this->userPayload($user),
        ], 201);
    }

    /**
     * @return array{id: int, name: string, email: string, is_active: bool}
     */
    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'is_active' => (bool) $user->is_active,
        ];
    }
}
