<?php

namespace App\Services;

use App\Models\SystemEvent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SystemEventLogger
{
    /**
     * @param  array<string, mixed>|null  $metadata
     */
    public function log(
        string $eventType,
        string $severity = 'info',
        ?string $message = null,
        ?User $actor = null,
        ?string $actorEmail = null,
        ?string $targetType = null,
        int|string|null $targetId = null,
        ?array $metadata = null,
        ?Request $request = null,
    ): SystemEvent {
        return SystemEvent::create([
            'event_type' => $eventType,
            'severity' => $severity,
            'message' => $message,
            'actor_user_id' => $actor?->id,
            'actor_email' => $actor?->email ?? $actorEmail,
            'target_type' => $targetType,
            'target_id' => $targetId === null ? null : (string) $targetId,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent() ? Str::limit($request->userAgent(), 255, '') : null,
            'metadata' => $this->sanitizeMetadata($metadata),
        ]);
    }

    /**
     * @param  array<string, mixed>|null  $metadata
     * @return array<string, mixed>|null
     */
    private function sanitizeMetadata(?array $metadata): ?array
    {
        if ($metadata === null) {
            return null;
        }

        $sanitized = [];

        foreach ($metadata as $key => $value) {
            if ($this->isSensitiveKey((string) $key)) {
                continue;
            }

            $sanitized[$key] = is_array($value)
                ? $this->sanitizeMetadata($value)
                : $value;
        }

        return $sanitized;
    }

    private function isSensitiveKey(string $key): bool
    {
        $normalizedKey = Str::lower($key);

        return Str::contains($normalizedKey, [
            'authorization',
            'credential',
            'password',
            'secret',
            'token',
        ]);
    }
}
