<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectsController extends Controller
{
    
    public function index()
    {
        $user = auth()->user();
        if (!$user->hasRole('manager')) {
            // abort(403, 'Accès non autorisé.');
            return response()->json([
                'message' => 'unautherized'
            ], 403);
        }

        $projects = Project::where('id', $user->id);

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
        if (!$user->hasRole('manager')) {
            // abort(403, 'Accès non autorisé.');
            return response()->json([
                'message' => 'unautherized'
            ], 403);
        }

        $newProject = Project::create([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'user_id' => $user->id
        ]);

        return response()->json([
            'message' => "new project was created successfully",
            'project' => $newProject
        ], 200);
    }

    public function show(string $id)
    {
        //
    }

    public function edit(Request $request, string $id)
    {
        //

        $user = auth()->user();

        if (!$user->hasRole('manager')) {
            // abort(403, 'Accès non autorisé.');
            return response()->json([
                'message' => 'unautherized'
            ], 403);
        }

        $data = $request->all();

        $project = Project::where('id', $id)->update([
            'name' => $data['name'],
            'description' => $data['description'],
        ]);

        return response()->json([
            'message' => "project was updated successfully",
            'project' => $project
        ], 200);


    }

    public function destroy(string $id)
    {
        //
        $user = auth()->user();

        if (!$user->hasRole('manager')) {
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
}
