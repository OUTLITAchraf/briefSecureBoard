<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Jobs\SendProjectNotifications;
class ProjectsController extends Controller
{

    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user->hasRole(['admin', 'manage'])) {
            return response()->json([
                'message' => 'unauthorized'
            ], 403);
        }

        if ($user->hasRole('admin')) {
            $projects = Project::with('user', 'teamMembers')->get();
        } else {
            $projects = Project::where('user_id', $user->id)
                ->with('user', 'teamMembers')
                ->get();
        }

        if (!$projects) {
            return response()->json([
                "message" => "no projects found"
            ], 401);
        }

        return response()->json([
            'message' => "projects fetched successfully!",
            'projects' => $projects
        ], 200);

    }

    public function create(Request $request)
    {
        $user = auth()->user();

        if (!$user->hasRole(['admin', 'manage'])) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        // Use validation to handle all incoming data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'team_members' => 'nullable|array',
            'team_members.*' => 'integer|exists:users,id',
        ]);

        // Create the project using the validated data
        $project = Project::create([
            'name' => $validatedData['name'],
            'description' => $validatedData['description'],
            'user_id' => $user->id,
            'team_members' => $validatedData['team_members'] ?? null,
        ]);

        if (isset($validatedData['team_members'])) {
            $project->teamMembers()->sync($validatedData['team_members']);
        }

        SendProjectNotifications::dispatch($project);

        $projects = Project::where('user_id', $user->id)
            ->with('user', 'teamMembers')
            ->get();


        return response()->json([
            'message' => "New project was created successfully",
            'projects' => $projects
        ], 200);
    }

    public function show(string $id)
    {
        //
    }

    public function edit(Request $request, string $id)
    {
        $user = auth()->user();

        if (!$user->hasRole(['admin', 'manage'])) {
            return response()->json([
                'message' => 'unautherized'
            ], 403);
        }

        $project = Project::find($id);

        if (!$project || $project->user_id !== $user->id) {
            return response()->json(['message' => 'Project not found or unauthorized.'], 404);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'team_members' => 'nullable|array',
            'team_members.*' => 'integer|exists:users,id',
        ]);

        $project->update([
            'name' => $data['name'],
            'description' => $data['description'],
        ]);


        if (isset($data['team_members'])) {
            $project->teamMembers()->sync($data['team_members']);
        } else {
            $project->teamMembers()->sync([]);
        }


        $projects = Project::where('user_id', $user->id)
            ->with('user', 'teamMembers')
            ->get();

        return response()->json([
            'message' => "project was updated successfully",
            'project' => $projects
        ], 200);
    }

    public function destroy(string $id)
    {
        //
        $user = auth()->user();

        if (!$user->hasRole(['admin', 'manage'])) {
            // abort(403, 'Accès non autorisé.');
            return response()->json([
                'message' => 'unautherized'
            ], 403);
        }

        $project = Project::findOrFail($id);

        if (!$project) {
            return response()->json([
                'message' => 'project not found'
            ], 404);
        }

        $project->delete();

        return response()->json([
            'message' => 'project deleted successfully'
        ], 200);
    }

    public function getTeamMembers()
    {
        $user = auth()->user();

        if (!$user->hasRole(['admin', 'manage'])) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $users = User::whereHas('roles', function ($query) {
            $query->where('name', 'user');
        })->get(['id', 'name']);

        return response()->json(['users' => $users], 200);
    }


    public function getProjectsForUser()
    {
        // Get the authenticated user
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Not Authenticated'], 401);
        }

        if (!$user->hasRole('user')) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        // Get the projects where the user's ID is in the team_members column
        $projects = Project::whereJsonContains('team_members', $user->id)
            ->with('user', 'teamMembers')
            ->get();

        return response()->json([
            'message' => 'User projects fetched successfully.',
            'data' => $projects,
        ], 200);
    }


    public function getUserTasks()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Not Authenticated'], 401);
        }

        if (!$user->hasRole('user')) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $tasks = Task::where('assigned_user_id', $user->id)
            ->with('project')
            ->get();

        return response()->json([
            'message' => 'User tasks fetched successfully.',
            'data' => $tasks,
        ], 200);
    }

    public function updateStatus(Request $request, Task $task)
    {
        $request->validate([
            'status' => 'required|in:To-Do,Doing,Done',
        ]);

        $user = Auth::user();

        // Check if the authenticated user is assigned to this task
        if ($user->id !== $task->assigned_user_id) {
            return response()->json(['message' => 'Forbidden: You can only update your own tasks.'], 403);
        }

        if (!$user->hasRole('user')) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $task->status = $request->status;
        $task->save();

        return response()->json([
            'message' => 'Task status updated successfully.',
            'data' => $task,
        ], 200);
    }


    public function getUserDashboardData()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Not Authenticated'], 401);
        }

        // 1. Count projects the user is a part of
        $projects = Project::whereJsonContains('team_members', (int) $user->id)->get();
        $totalProjects = $projects->count();

        // 2. Count tasks assigned to the user
        $tasks = Task::where('assigned_user_id', $user->id)->get();
        $totalTasks = $tasks->count();

        // 3. Get status counts for tasks
        $statusCounts = $tasks->groupBy('status')->map(function ($items) {
            return count($items);
        });

        $taskStatusData = [
            'to_do' => $statusCounts['To-Do'] ?? 0,
            'doing' => $statusCounts['Doing'] ?? 0,
            'done' => $statusCounts['Done'] ?? 0,
        ];

        return response()->json([
            'message' => 'User dashboard data fetched successfully.',
            'data' => [
                'totalProjects' => $totalProjects,
                'totalTasks' => $totalTasks,
                'taskStatusData' => $taskStatusData,
            ],
        ], 200);
    }
}
