<?php

use App\Http\Controllers\ProjectsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ProfileController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('web')->group(function () {

    // CSRF cookie endpoint
    Route::get('/sanctum/csrf-cookie', function () {
        return response()->json(['csrf' => csrf_token()]);
    });

    // Guest routes
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::post('/register', [RegisteredUserController::class, 'store']);

    // Authenticated routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
        Route::get('/user', function (Request $request) {
            return $request->user()->load('roles');
        });
        Route::put('/profile', [ProfileController::class, 'update']);
    });

    // Manger Routes (Project)
    Route::middleware('auth:sanctum')->group(function () {

        Route::get('/projects', [ProjectsController::class, 'index']);
        Route::post('/projects', [ProjectsController::class, 'create']);
        Route::put('/projects/{id}', [ProjectsController::class, 'edit']);
        Route::delete('/projects/{id}', [ProjectsController::class, 'destroy']);
        Route::get('/projects/team-members', [ProjectsController::class, 'getTeamMembers']);
    });

});




// require __DIR__.'/auth.php';

