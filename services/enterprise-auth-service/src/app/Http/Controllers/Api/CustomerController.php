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
                metadata: $this->customerEventMetadata($customer),
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
            'legal_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'commercial_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'fiscal_email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'economic_activity_code' => ['sometimes', 'nullable', 'string', 'max:20'],
            'economic_activity_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:50'],
            'identification_type' => ['sometimes', 'nullable', 'string', 'in:01,02,03,04,05'],
            'identification_number' => ['sometimes', 'nullable', 'string', 'max:100'],
            'address' => ['sometimes', 'nullable', 'string', 'max:500'],
            'province' => ['sometimes', 'nullable', 'string', 'max:100'],
            'province_code' => ['sometimes', 'nullable', 'string', 'max:2'],
            'province_name' => ['sometimes', 'nullable', 'string', 'max:100'],
            'canton' => ['sometimes', 'nullable', 'string', 'max:100'],
            'canton_code' => ['sometimes', 'nullable', 'string', 'max:2'],
            'canton_name' => ['sometimes', 'nullable', 'string', 'max:100'],
            'district' => ['sometimes', 'nullable', 'string', 'max:100'],
            'district_code' => ['sometimes', 'nullable', 'string', 'max:2'],
            'district_name' => ['sometimes', 'nullable', 'string', 'max:100'],
            'neighborhood' => ['sometimes', 'nullable', 'string', 'max:100'],
            'neighborhood_code' => ['sometimes', 'nullable', 'string', 'max:2'],
            'neighborhood_name' => ['sometimes', 'nullable', 'string', 'max:100'],
            'other_signs' => ['sometimes', 'nullable', 'string', 'max:500'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'fiscal_notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'is_active' => ['sometimes', 'nullable', 'boolean'],
        ]);

        if (array_key_exists('is_active', $validated) && $validated['is_active'] === null) {
            unset($validated['is_active']);
        }

        return $validated;
    }

    /**
     * @return array{id: int, name: string, legal_name: string|null, commercial_name: string|null, email: string|null, fiscal_email: string|null, economic_activity_code: string|null, economic_activity_name: string|null, phone: string|null, identification_type: string|null, identification_number: string|null, address: string|null, province: string|null, province_code: string|null, province_name: string|null, canton: string|null, canton_code: string|null, canton_name: string|null, district: string|null, district_code: string|null, district_name: string|null, neighborhood: string|null, neighborhood_code: string|null, neighborhood_name: string|null, other_signs: string|null, notes: string|null, fiscal_notes: string|null, is_active: bool, created_by_user_id: int|null, updated_by_user_id: int|null, created_at: string|null, updated_at: string|null}
     */
    private function customerPayload(Customer $customer): array
    {
        return [
            'id' => $customer->id,
            'name' => $customer->name,
            'legal_name' => $customer->legal_name,
            'commercial_name' => $customer->commercial_name,
            'email' => $customer->email,
            'fiscal_email' => $customer->fiscal_email,
            'economic_activity_code' => $customer->economic_activity_code,
            'economic_activity_name' => $customer->economic_activity_name,
            'phone' => $customer->phone,
            'identification_type' => $customer->identification_type,
            'identification_number' => $customer->identification_number,
            'address' => $customer->address,
            'province' => $customer->province,
            'province_code' => $customer->province_code,
            'province_name' => $customer->province_name,
            'canton' => $customer->canton,
            'canton_code' => $customer->canton_code,
            'canton_name' => $customer->canton_name,
            'district' => $customer->district,
            'district_code' => $customer->district_code,
            'district_name' => $customer->district_name,
            'neighborhood' => $customer->neighborhood,
            'neighborhood_code' => $customer->neighborhood_code,
            'neighborhood_name' => $customer->neighborhood_name,
            'other_signs' => $customer->other_signs,
            'notes' => $customer->notes,
            'fiscal_notes' => $customer->fiscal_notes,
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
