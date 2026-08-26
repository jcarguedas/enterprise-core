<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Services\SystemEventLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function __construct(private SystemEventLogger $systemEvents)
    {
    }

    public function index(): JsonResponse
    {
        $customers = Customer::query()
            ->orderBy('id')
            ->get()
            ->map(fn (Customer $customer): array => $this->customerPayload($customer));

        return response()->json([
            'customers' => $customers,
        ]);
    }

    public function show(Customer $customer): JsonResponse
    {
        return response()->json([
            'customer' => $this->customerPayload($customer),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validatedCustomerData($request);
        $currentUserId = $request->user()->id;

        $customer = Customer::create([
            ...$validated,
            'created_by_user_id' => $currentUserId,
            'updated_by_user_id' => $currentUserId,
        ]);
        $customer->refresh();

        $this->systemEvents->log(
            eventType: 'customers.created',
            severity: 'info',
            message: 'Customer created.',
            actor: $request->user(),
            targetType: 'customer',
            targetId: $customer->id,
            metadata: $this->customerEventMetadata($customer),
            request: $request,
        );

        return response()->json([
            'customer' => $this->customerPayload($customer),
        ], 201);
    }

    public function update(Request $request, Customer $customer): JsonResponse
    {
        $wasActive = (bool) $customer->is_active;
        $validated = $this->validatedCustomerData($request, isUpdate: true);

        $customer->update([
            ...$validated,
            'updated_by_user_id' => $request->user()->id,
        ]);
        $customer->refresh();

        if (array_key_exists('is_active', $validated) && $wasActive !== (bool) $customer->is_active) {
            $this->systemEvents->log(
                eventType: $customer->is_active ? 'customers.activated' : 'customers.deactivated',
                severity: 'info',
                message: $customer->is_active ? 'Customer activated.' : 'Customer deactivated.',
                actor: $request->user(),
                targetType: 'customer',
                targetId: $customer->id,
                metadata: $this->customerEventMetadata($customer),
                request: $request,
            );
        } else {
            $this->systemEvents->log(
                eventType: 'customers.updated',
                severity: 'info',
                message: 'Customer updated.',
                actor: $request->user(),
                targetType: 'customer',
                targetId: $customer->id,
                metadata: [
                    ...$this->customerEventMetadata($customer),
                    'updated_fields' => array_keys($validated),
                ],
                request: $request,
            );
        }

        return response()->json([
            'customer' => $this->customerPayload($customer),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedCustomerData(Request $request, bool $isUpdate = false): array
    {
        $presenceRule = $isUpdate ? 'sometimes' : 'required';

        $validated = $request->validate([
            'name' => [$presenceRule, 'string', 'max:255'],
            'email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:50'],
            'identification_type' => ['sometimes', 'nullable', 'string', 'max:50'],
            'identification_number' => ['sometimes', 'nullable', 'string', 'max:100'],
            'address' => ['sometimes', 'nullable', 'string', 'max:500'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'is_active' => ['sometimes', 'nullable', 'boolean'],
        ]);

        if (array_key_exists('is_active', $validated) && $validated['is_active'] === null) {
            unset($validated['is_active']);
        }

        return $validated;
    }

    /**
     * @return array{id: int, name: string, email: string|null, phone: string|null, identification_type: string|null, identification_number: string|null, address: string|null, notes: string|null, is_active: bool, created_by_user_id: int|null, updated_by_user_id: int|null, created_at: string|null, updated_at: string|null}
     */
    private function customerPayload(Customer $customer): array
    {
        return [
            'id' => $customer->id,
            'name' => $customer->name,
            'email' => $customer->email,
            'phone' => $customer->phone,
            'identification_type' => $customer->identification_type,
            'identification_number' => $customer->identification_number,
            'address' => $customer->address,
            'notes' => $customer->notes,
            'is_active' => (bool) $customer->is_active,
            'created_by_user_id' => $customer->created_by_user_id,
            'updated_by_user_id' => $customer->updated_by_user_id,
            'created_at' => $customer->created_at?->toJSON(),
            'updated_at' => $customer->updated_at?->toJSON(),
        ];
    }

    /**
     * @return array{target_name: string, target_email: string|null}
     */
    private function customerEventMetadata(Customer $customer): array
    {
        return [
            'target_name' => $customer->name,
            'target_email' => $customer->email,
        ];
    }
}
