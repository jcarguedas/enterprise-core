<?php

namespace App\Services;

use App\Models\TaxpayerLookupCache;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;

class HaciendaTaxpayerLookupService
{
    /**
     * @return array{status: 'success', taxpayer: array<string, mixed>, source: 'cache'|'live', fetched_at: string|null}|array{status: 'error', http_status: int, message: string, source: 'live'}
     */
    public function lookup(string $identificationNumber): array
    {
        $identificationNumber = trim($identificationNumber);

        $cachedLookup = TaxpayerLookupCache::query()
            ->where('source', 'hacienda')
            ->where('identification_number', $identificationNumber)
            ->whereNotNull('normalized_payload')
            ->where('expires_at', '>', now())
            ->latest('fetched_at')
            ->first();

        if ($cachedLookup) {
            return [
                'status' => 'success',
                'taxpayer' => $cachedLookup->normalized_payload,
                'source' => 'cache',
                'fetched_at' => $cachedLookup->fetched_at?->toJSON(),
            ];
        }

        try {
            $response = Http::timeout($this->timeoutSeconds())
                ->acceptJson()
                ->get($this->endpointUrl(), [
                    'identificacion' => $identificationNumber,
                ]);
        } catch (ConnectionException) {
            return $this->errorResult(
                503,
                'Unable to reach Hacienda taxpayer lookup. Please try again later.'
            );
        }

        if ($response->failed()) {
            return $this->errorResult(
                $this->clientStatusForHaciendaStatus($response->status()),
                $this->messageForHaciendaStatus($response->status()),
                $response->status()
            );
        }

        $payload = $response->json();
        $payload = is_array($payload) ? $payload : [];
        $normalizedPayload = $this->normalizePayload($identificationNumber, $payload);
        $fetchedAt = now();

        TaxpayerLookupCache::create([
            'identification_number' => $identificationNumber,
            'source' => 'hacienda',
            'payload' => $payload,
            'normalized_payload' => $normalizedPayload,
            'status' => 'success',
            'http_status' => $response->status(),
            'fetched_at' => $fetchedAt,
            'expires_at' => $fetchedAt->copy()->addHours($this->cacheTtlHours()),
        ]);

        return [
            'status' => 'success',
            'taxpayer' => $normalizedPayload,
            'source' => 'live',
            'fetched_at' => $fetchedAt->toJSON(),
        ];
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array{identification_number: string, name: string|null, identification_type: string|null, tax_regime: string|null, tax_status: string|null, economic_activities: array<int, array{code: string|null, name: string|null, status: string|null}>}
     */
    private function normalizePayload(string $identificationNumber, array $payload): array
    {
        return [
            'identification_number' => $identificationNumber,
            'name' => $this->stringFromKeys($payload, ['nombre', 'name']),
            'identification_type' => $this->stringFromKeys($payload, [
                'tipoIdentificacion',
                'tipo_identificacion',
                'identification_type',
            ]),
            'tax_regime' => $this->stringFromKeys($payload, ['regimen', 'tax_regime']),
            'tax_status' => $this->stringFromKeys($payload, [
                'situacion',
                'situacion_tributaria',
                'tax_status',
            ]),
            'economic_activities' => $this->normalizeEconomicActivities($payload),
        ];
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<int, array{code: string|null, name: string|null, status: string|null}>
     */
    private function normalizeEconomicActivities(array $payload): array
    {
        $activities = $this->valueFromKeys($payload, [
            'actividades',
            'actividadesEconomicas',
            'economic_activities',
        ]);

        if (! is_array($activities)) {
            return [];
        }

        return collect($activities)
            ->filter(fn (mixed $activity): bool => is_array($activity))
            ->map(fn (array $activity): array => [
                'code' => $this->stringFromKeys($activity, ['codigo', 'code']),
                'name' => $this->stringFromKeys($activity, [
                    'descripcion',
                    'nombre',
                    'name',
                    'description',
                ]),
                'status' => $this->stringFromKeys($activity, ['estado', 'status']),
            ])
            ->values()
            ->all();
    }

    /**
     * @param  array<string, mixed>  $payload
     * @param  string[]  $keys
     */
    private function stringFromKeys(array $payload, array $keys): ?string
    {
        $value = $this->valueFromKeys($payload, $keys);

        if (is_array($value)) {
            $value = $this->valueFromKeys($value, [
                'estado',
                'descripcion',
                'nombre',
                'name',
                'status',
            ]);
        }

        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        if (is_scalar($value)) {
            $value = trim((string) $value);

            return $value === '' ? null : $value;
        }

        return null;
    }

    /**
     * @param  array<string, mixed>  $payload
     * @param  string[]  $keys
     */
    private function valueFromKeys(array $payload, array $keys): mixed
    {
        foreach ($keys as $key) {
            if (array_key_exists($key, $payload)) {
                return $payload[$key];
            }
        }

        return null;
    }

    /**
     * @return array{status: 'error', http_status: int, message: string, source: 'live'}
     */
    private function errorResult(int $clientStatus, string $message, ?int $haciendaStatus = null): array
    {
        return [
            'status' => 'error',
            'http_status' => $haciendaStatus ?? $clientStatus,
            'message' => $message,
            'source' => 'live',
        ];
    }

    private function clientStatusForHaciendaStatus(int $status): int
    {
        if ($status === 400) {
            return 422;
        }

        if (in_array($status, [404, 429], true)) {
            return $status;
        }

        return 503;
    }

    private function messageForHaciendaStatus(int $status): string
    {
        return match ($status) {
            400 => 'Hacienda rejected the taxpayer lookup request. Please verify the identification number.',
            404 => 'No Hacienda taxpayer record was found for the provided identification number.',
            429 => 'Hacienda taxpayer lookup is temporarily rate limited. Please try again later.',
            default => 'Hacienda taxpayer lookup is unavailable. Please try again later.',
        };
    }

    private function endpointUrl(): string
    {
        return (string) config('services.hacienda_taxpayer_lookup.url');
    }

    private function timeoutSeconds(): int
    {
        return max(1, (int) config('services.hacienda_taxpayer_lookup.timeout', 10));
    }

    private function cacheTtlHours(): int
    {
        return max(1, (int) config('services.hacienda_taxpayer_lookup.cache_ttl_hours', 24));
    }
}
