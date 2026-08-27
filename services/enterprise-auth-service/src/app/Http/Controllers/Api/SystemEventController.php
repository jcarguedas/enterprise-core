<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SystemEventController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'limit' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ]);

        $limit = $validated['limit'] ?? 50;

        $events = SystemEvent::query()
            ->latest('created_at')
            ->latest('id')
            ->limit($limit)
            ->get()
            ->map(fn (SystemEvent $event): array => [
                'id' => $event->id,
                'event_type' => $event->event_type,
                'severity' => $event->severity,
                'message' => $event->message,
                'actor_user_id' => $event->actor_user_id,
                'actor_email' => $event->actor_email,
                'target_type' => $event->target_type,
                'target_id' => $event->target_id,
                'ip_address' => $event->ip_address,
                'user_agent' => $event->user_agent,
                'metadata' => $event->metadata,
                'created_at' => $event->created_at?->toJSON(),
            ]);

        return response()->json([
            'events' => $events,
            'limit' => $limit,
        ]);
    }
}
