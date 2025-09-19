<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function getManagerDashboardData()
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

        // Get the projects created by the authenticated user
        $projects = Project::where('user_id', $user->id)->get();
        $projectIds = $projects->pluck('id');

        // Get all tasks associated with those projects
        $tasks = Task::whereIn('project_id', $projectIds)->get();

        // 1. Get total counts
        $totalProjects = $projects->count();
        $totalTasks = $tasks->count();

        // 2. Get status counts for tasks
        $statusCounts = $tasks->groupBy('status')->map(function ($items) {
            return count($items);
        });

        // Ensure all statuses are present, even if count is zero
        $taskStatusData = [
            'todo' => $statusCounts['todo'] ?? 0,
            'doing' => $statusCounts['doing'] ?? 0,
            'done' => $statusCounts['done'] ?? 0,
        ];

        // 3. Get the last 5 created projects
        $lastFiveProjects = Project::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'message' => 'Dashboard data fetched successfully.',
            'data' => [
                'totalProjects' => $totalProjects,
                'totalTasks' => $totalTasks,
                'taskStatusData' => $taskStatusData,
                'lastFiveProjects' => $lastFiveProjects,
            ],
        ], 200);
    }
}