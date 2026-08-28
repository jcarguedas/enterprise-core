<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\SystemEventController;
use App\Http\Controllers\Api\TaxpayerLookupController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UserRoleController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'enterprise-auth-service',
    ]);
});

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum', 'active-user'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/users', [UserController::class, 'index'])
        ->middleware('permission:manage-users');
    Route::get('/users/{user}', [UserController::class, 'show'])
        ->middleware('permission:manage-users');
    Route::get('/users/{user}/roles', [UserRoleController::class, 'index'])
        ->middleware('permission:manage-users');
    Route::get('/roles', [RoleController::class, 'index'])
        ->middleware('permission:manage-users');
    Route::get('/system-events', [SystemEventController::class, 'index'])
        ->middleware('permission:view-system-events');
    Route::get('/taxpayer-lookup', [TaxpayerLookupController::class, 'show'])
        ->middleware('permission:lookup-taxpayer');
    Route::get('/customers', [CustomerController::class, 'index'])
        ->middleware('permission:view-customers');
    Route::get('/customers/{customer}', [CustomerController::class, 'show'])
        ->middleware('permission:view-customers');
    Route::post('/customers', [CustomerController::class, 'store'])
        ->middleware('permission:manage-customers');
    Route::patch('/customers/{customer}', [CustomerController::class, 'update'])
        ->middleware('permission:manage-customers');
    Route::post('/users/{user}/roles', [UserRoleController::class, 'store'])
        ->middleware('permission:manage-users');
    Route::delete('/users/{user}/roles/{role}', [UserRoleController::class, 'destroy'])
        ->middleware('permission:manage-users');
    Route::patch('/users/{user}', [UserController::class, 'update'])
        ->middleware('permission:manage-users');
    Route::post('/users', [UserController::class, 'store'])
        ->middleware('permission:manage-users');
});
