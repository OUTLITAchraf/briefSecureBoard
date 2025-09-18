<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

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


    public function store(Request $request)
    {
        $user = auth()->user();
        if (!$user->hasRole('admin')) {
            return response()->json([
                'message' => 'unautherized'
            ], 403);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:user,manage', // only user or manager
        ]);

        // Create the user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Assign role with Laratrust
        $user->addRole($request->role);

        return response()->json([
            'message' => 'User created successfully!',
            'user' => $user->load('roles'),
        ]);
    }

    public function update(Request $request, $id)
    {

        $user = auth()->user();
        if (!$user->hasRole('admin')) {
            return response()->json([
                'message' => 'unautherized'
            ], 403);
        }
        $user = User::findOrFail($id);

        // Validate incoming data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required|exists:roles,name',
        ]);

        // Update user basic info
        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        // Sync role (remove old, assign new)
        $user->syncRoles([$validated['role']]);

        return response()->json([
            'message' => 'User updated successfully!',
            'user' => $user->load('roles'), // return with role
        ]);
    }


    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Optional safeguard: prevent deleting admin
        if ($user->hasRole('admin')) {
            return response()->json([
                'message' => 'Cannot delete admin users.'
            ], 403);
        }

        // Detach roles
        $user->roles()->detach();

        // Delete user
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully!'
        ]);
    }

}
