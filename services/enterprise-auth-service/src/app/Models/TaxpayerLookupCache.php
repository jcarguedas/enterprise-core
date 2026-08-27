<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'identification_number',
    'source',
    'payload',
    'normalized_payload',
    'status',
    'http_status',
    'fetched_at',
    'expires_at',
])]
class TaxpayerLookupCache extends Model
{
    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'normalized_payload' => 'array',
            'fetched_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }
}
