<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{
    // listAllTasks
    public function index(Request $request)
    {
        Log::error("TaskController");

        $userId = $request->header('X-User-Id'); // Or auth()->user()->user_id
        
        // Explicit where clause (defense in depth)
        $tasks = Task::where('user_id', $userId)->with('taskType')->orderBy('from_timestamp', 'asc')->get();
        
        return response()->json($tasks);
    }

    // saveTask (Create)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_details' => 'required|string',
            'from_datetime' => 'required|date',
            'to_datetime' => 'required|date',
            'from_timestamp' => 'required|integer',
            'to_timestamp' => 'required|integer',
            'task_type_id' => 'required|uuid|exists:task_types,id',
            'status' => 'required|in:planned,done',
        ]);

        $userId = $request->header('X-User-Id');
        
        // Verify the TaskType belongs to the user before saving
        $typeExists = \App\Models\TaskType::where('id', $validated['task_type_id'])
                                          ->where('user_id', $userId)
                                          ->exists();
        if (!$typeExists) {
             return response()->json(['error' => 'Invalid Task Type'], 403);
        }

        $task = Task::create([
            ...$validated,
            'user_id' => $userId // Explicitly inject user_id
        ]);

        return response()->json($task, 201);
    }

    // updateTask
    public function update(Request $request, $id)
    {
        $userId = $request->header('X-User-Id');
        
        // Explicit check before modifying
        $task = Task::where('id', $id)->where('user_id', $userId)->firstOrFail();

        $validated = $request->validate([
            'task_details' => 'sometimes|string',
            'from_datetime' => 'sometimes|date',
            'to_datetime' => 'sometimes|date',
            'from_timestamp' => 'sometimes|integer',
            'to_timestamp' => 'sometimes|integer',
            'task_type_id' => 'sometimes|uuid|exists:task_types,id',
            'status' => 'sometimes|in:planned,done',
        ]);

        if (isset($validated['task_type_id'])) {
             $typeExists = \App\Models\TaskType::where('id', $validated['task_type_id'])
                                               ->where('user_id', $userId)
                                               ->exists();
             if (!$typeExists) {
                  return response()->json(['error' => 'Invalid Task Type'], 403);
             }
        }

        $task->update($validated);
        return response()->json($task);
    }

    // ToggleTaskStatusAction
    public function toggleStatus(Request $request, $id)
    {
        $userId = $request->header('X-User-Id');
        
        // Explicit check
        $task = Task::where('id', $id)->where('user_id', $userId)->firstOrFail();
        
        $task->status = $task->status === 'planned' ? 'done' : 'planned';
        $task->save();

        return response()->json($task);
    }

    // deleteTask (Soft Delete)
    public function destroy(Request $request, $id)
    {
        $userId = $request->header('X-User-Id');
        
        // Explicit check before deleting
        $task = Task::where('id', $id)->where('user_id', $userId)->firstOrFail();
        
        $task->delete(); // SoftDeletes

        return response()->json(['message' => 'Task deleted']);
    }
}