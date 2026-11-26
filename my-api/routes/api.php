<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;


// Public route
Route::post('/auth/login', [AuthController::class, 'login']);

//
Route::middleware('jwt.auth')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    
    // Task Routes
    Route::get('/tasks', [TaskController::class, 'index']);                      // listAllTasks
    Route::post('/tasks', [TaskController::class, 'store']);                     // saveTask
    Route::put('/tasks/{id}', [TaskController::class, 'update']);                // updateTask
    Route::patch('/tasks/{id}/toggle', [TaskController::class, 'toggleStatus']); // ToggleTaskStatusAction
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);            // deleteTask

    // Task Type Routes
    Route::get('/task-types', [TaskTypeController::class, 'index']);             // listAllTaskTypes
    Route::post('/task-types', [TaskTypeController::class, 'store']);
    Route::put('/task-types/{id}', [TaskTypeController::class, 'update']);
    Route::delete('/task-types/{id}', [TaskTypeController::class, 'destroy']);
});


// Protected routes (requires valid JWT)
/*
Route::middleware('auth:api')->group(function () {
  
    
});

Route::middleware('auth:sanctum')->group(function () {
  
});
*/


/////////////////////////////
/*
Route::get('/test', [TestController::class, 'index']);
Route::post('/test', [TestController::class, 'store']);
Route::get('/test/{id}', [TestController::class, 'show']);
Route::put('/test/{id}', [TestController::class, 'update']);
Route::delete('/test/{id}', [TestController::class, 'destroy']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
*/

