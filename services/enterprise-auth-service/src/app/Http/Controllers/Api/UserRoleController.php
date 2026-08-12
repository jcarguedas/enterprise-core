<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserRoleController extends Controller
{
    public function index(User $user): JsonResponse
    {
        return $this->rolesResponse($user);
    }

    public function store(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'role_id' => ['required', 'integer', 'exists:roles,id'],
        ]);

        $user->roles()->syncWithoutDetaching([$validated['role_id']]);

        return $this->rolesResponse($user);
    }

    public function destroy(User $user, Role $role): JsonResponse
    {
        $user->roles()->detach($role->id);

        return $this->rolesResponse($user);
    }

    private function rolesResponse(User $user): JsonResponse
    {
        $roles = $user->roles()
            ->select(['roles.id', 'roles.name', 'roles.slug', 'roles.description', 'roles.is_active'])
            ->orderBy('roles.id')
            ->get()
            ->map(fn ($role) => [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'description' => $role->description,
                'is_active' => (bool) $role->is_active,
            ]);

        return response()->json([
            'roles' => $roles,
        ]);
    }
}
