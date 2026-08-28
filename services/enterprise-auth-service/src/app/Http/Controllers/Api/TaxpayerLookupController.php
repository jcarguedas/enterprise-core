<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\HaciendaTaxpayerLookupService;
use App\Services\SystemEventLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaxpayerLookupController extends Controller
{
    public function __construct(
        private HaciendaTaxpayerLookupService $taxpayerLookup,
        private SystemEventLogger $systemEvents,
    ) {
    }

    public function show(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'identification_number' => ['required', 'string', 'regex:/^\d+$/', 'min:9', 'max:12'],
        ]);

        $identificationNumber = trim($validated['identification_number']);
        $result = $this->taxpayerLookup->lookup($identificationNumber);

        if ($result['status'] === 'success') {
            $this->systemEvents->log(
                eventType: 'taxpayer_lookup.succeeded',
                severity: 'info',
                message: 'Taxpayer lookup succeeded.',
                actor: $request->user(),
                targetType: 'taxpayer_lookup',
                targetId: $this->maskedIdentificationNumber($identificationNumber),
                metadata: [
                    'source' => $result['source'],
                    'http_status' => 200,
                    'identification_number' => $this->maskedIdentificationNumber($identificationNumber),
                ],
                request: $request,
            );

            return response()->json([
                'taxpayer' => $result['taxpayer'],
                'source' => $result['source'],
                'fetched_at' => $result['fetched_at'],
            ]);
        }

        $this->systemEvents->log(
            eventType: 'taxpayer_lookup.failed',
            severity: 'warning',
            message: 'Taxpayer lookup failed.',
            actor: $request->user(),
            targetType: 'taxpayer_lookup',
            targetId: $this->maskedIdentificationNumber($identificationNumber),
            metadata: [
                'source' => $result['source'],
                'http_status' => $result['http_status'],
                'identification_number' => $this->maskedIdentificationNumber($identificationNumber),
            ],
            request: $request,
        );

        return response()->json([
            'message' => $result['message'],
        ], $this->clientStatus($result['http_status']));
    }

    private function maskedIdentificationNumber(string $identificationNumber): string
    {
        return str_repeat('*', max(0, strlen($identificationNumber) - 4))
            . substr($identificationNumber, -4);
    }

    private function clientStatus(int $status): int
    {
        if (in_array($status, [404, 429], true)) {
            return $status;
        }

        if ($status === 400 || $status === 422) {
            return 422;
        }

        return 503;
    }
}
