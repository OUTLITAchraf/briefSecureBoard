<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProjectsController;
use App\Http\Controllers\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UsersController;
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

    // Manager Route (tasks)
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
    Route::put('/tasks/{task}', [TaskController::class, 'update']);

    // User CRUD routes

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/users', [UsersController::class, 'index']);
        Route::post('/users', [UsersController::class, 'store']);
        Route::put('/users/{id}', [UsersController::class, 'update']);
        Route::delete('/users/{id}', [UsersController::class, 'destroy']);
    });

    // Dashboard Route
    Route::get('/dashboard', [DashboardController::class, 'getManagerDashboardData']);

    // user route
    // User-specific project route
    Route::get('/user-projects', [ProjectsController::class, 'getProjectsForUser']);
    // User-specific tasks
    Route::get('/user-tasks', [ProjectsController::class, 'getUserTasks']);

    // User Dashboard Route
    Route::get('/user-dashboard', [ProjectsController::class, 'getUserDashboardData']);
    // Update task status
    Route::patch('/tasks/{task}/status', [ProjectsController::class, 'updateStatus']);
});





// require __DIR__.'/auth.php';

