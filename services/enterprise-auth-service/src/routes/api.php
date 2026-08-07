<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'enterprise-auth-service',
    ]);
});

Route::post('/login', [AuthController::class, 'login']);
