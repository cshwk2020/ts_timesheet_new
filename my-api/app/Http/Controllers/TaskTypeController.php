<?php

namespace App\Http\Controllers;

use App\Models\TaskType;
use Illuminate\Http\Request;

class TaskTypeController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->header('X-User-Id');
        return response()->json(TaskType::where('user_id', $userId)->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'color' => 'nullable|string',
        ]);

        $userId = $request->header('X-User-Id');

        $type = TaskType::create([
            ...$validated,
            'user_id' => $userId
        ]);

        return response()->json($type, 201);
    }

    public function update(Request $request, $id)
    {
        $userId = $request->header('X-User-Id');
        $type = TaskType::where('id', $id)->where('user_id', $userId)->firstOrFail();

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'color' => 'sometimes|nullable|string',
        ]);

        $type->update($validated);
        return response()->json($type);
    }

    public function destroy(Request $request, $id)
    {
        $userId = $request->header('X-User-Id');
        $type = TaskType::where('id', $id)->where('user_id', $userId)->firstOrFail();
        
        // Optional: check if tasks are using this type before deleting, 
        // but cascade constraints in migration handle it.
        $type->delete();

        return response()->json(['message' => 'Task type deleted']);
    }
}

