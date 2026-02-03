<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthorController;

// Ruta existente de prueba
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// RUTAS DEL MICROSERVICIO DE AUTORES
Route::prefix('authors')->group(function () {
    Route::post('/', [AuthorController::class, 'store']);
    Route::get('/', [AuthorController::class, 'index']);
    Route::get('/active', [AuthorController::class, 'active']);
    Route::get('/{uuid}', [AuthorController::class, 'show']);
    Route::get('/{uuid}/exists', [AuthorController::class, 'exists']);
});

// Health check
Route::get('/health', function () {
    return response()->json([
        'service' => 'authors-service',
        'status' => 'healthy',
        'timestamp' => now()->toISOString()
    ]);
});
