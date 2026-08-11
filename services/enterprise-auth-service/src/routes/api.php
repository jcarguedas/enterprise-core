<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'enterprise-auth-service',
    ]);
});

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/users', [UserController::class, 'index'])
        ->middleware('permission:manage-users');
    Route::get('/users/{user}', [UserController::class, 'show'])
        ->middleware('permission:manage-users');
    Route::patch('/users/{user}', [UserController::class, 'update'])
        ->middleware('permission:manage-users');
    Route::post('/users', [UserController::class, 'store'])
        ->middleware('permission:manage-users');
});
