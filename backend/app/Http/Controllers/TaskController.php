<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (!$user->hasRole('manage')) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $tasks = Task::whereHas('project', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->with('project', 'assignedUser')->get();

        return response()->json([
            'message' => 'Tasks fetched successfully.',
            'tasks' => $tasks,
        ], 200);
    }


    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        if (!$user->hasRole('manage')) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $validatedData = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'assigned_user_id' => 'nullable|exists:users,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        // Ensure the selected project actually belongs to the authenticated manager
        $project = Project::find($validatedData['project_id']);
        if (!$project || $project->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized to add a task to this project.'], 403);
        }

        // 4. Create the task
        $task = Task::create([
            'project_id' => $validatedData['project_id'],
            'assigned_user_id' => $validatedData['assigned_user_id'],
            'name' => $validatedData['name'],
            'description' => $validatedData['description'],
            'status' => 'todo', // Set the default status
        ]);

        // 5. Eager load and return the newly created task
        $task->load('assignedUser');

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task,
        ], 201);
    }

    public function destroy(Task $task)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (!$user->hasRole('manage')) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        if ($task->project->user_id !== $user->id) {
            return response()->json(['message' => 'You are not authorized to delete this task.'], 403);
        }

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully.'
        ], 200);
    }

    public function update(Request $request, Task $task)
    {
        // 1. Authorization Check
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        if (!$user->hasRole('manage')) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        if ($task->project->user_id !== $user->id) {
            return response()->json(['message' => 'You are not authorized to edit this task.'], 403);
        }

        $validatedData = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'assigned_user_id' => 'nullable|exists:users,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|in:todo,doing,done',
        ]);

        $task->update($validatedData);

        $task->load('project', 'assignedUser');

        return response()->json([
            'message' => 'Task updated successfully.',
            'task' => $task,
        ], 200);
    }
}