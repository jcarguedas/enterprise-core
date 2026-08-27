<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'name',
    'legal_name',
    'commercial_name',
    'email',
    'fiscal_email',
    'phone',
    'identification_type',
    'identification_number',
    'address',
    'province',
    'canton',
    'district',
    'neighborhood',
    'other_signs',
    'notes',
    'fiscal_notes',
    'is_active',
    'created_by_user_id',
    'updated_by_user_id',
])]
class Customer extends Model
{
    /** @use HasFactory<\Database\Factories\CustomerFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
