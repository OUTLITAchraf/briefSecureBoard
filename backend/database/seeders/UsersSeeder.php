<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        // Create Admin User
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@app.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('12345678'),
            ]
        );
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminUser->addRole($adminRole);
        }

        // Create Manager User
        $managerUser = User::firstOrCreate(
            ['email' => 'manager@app.com'],
            [
                'name' => 'Manager',
                'password' => Hash::make('12345678'),
            ]
        );
        $managerRole = Role::where('name', 'manage')->first();
        if ($managerRole) {
            $managerUser->addRole($managerRole);
        }
    }
}
