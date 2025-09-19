<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
}
