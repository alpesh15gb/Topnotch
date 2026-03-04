<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'demo@topnotch.app'],
            [
                'name' => 'Demo Owner',
                'password' => Hash::make('password'),
                'is_super_admin' => false,
            ]
        );

        $tenant = Tenant::where('subdomain', 'demo')->first();

        if ($tenant && !$tenant->users()->where('user_id', $user->id)->exists()) {
            $tenant->users()->attach($user->id, [
                'role' => 'owner',
                'is_active' => true,
                'joined_at' => now(),
            ]);
        }

        // Super admin
        User::firstOrCreate(
            ['email' => 'admin@topnotch.app'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('admin_password'),
                'is_super_admin' => true,
            ]
        );

        $this->command->info("Users seeded. Login: demo@topnotch.app / password");
    }
}
