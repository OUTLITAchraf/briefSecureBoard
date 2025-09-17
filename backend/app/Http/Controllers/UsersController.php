<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UsersController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if (!$user->hasRole('admin')) {
            // abort(403, 'Accès non autorisé.');
            return response()->json([
                'message' => 'unautherized'
            ], 403);
        }
        $users = User::whereDoesntHave('roles', function($query) {
            $query->where('name', 'admin');
        })->with('roles')->get();

        return response()->json([
            'message' => 'Users fetched successfully!',
            'users' => $users,
        ]);
        }
}
