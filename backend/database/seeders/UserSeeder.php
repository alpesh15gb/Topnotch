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
        ['email' => env('DEMO_USER_EMAIL', 'demo@topnotch.app')],
        [
            'name' => env('DEMO_USER_NAME', 'Demo Owner'),
            'password' => Hash::make(env('DEMO_USER_PASSWORD', 'password')),
            'is_super_admin' => false,
        ]
        );

        $tenant = Tenant::where('subdomain', env('DEMO_TENANT_SUBDOMAIN', 'demo'))->first();

        if ($tenant && !$tenant->users()->where('user_id', $user->id)->exists()) {
            $tenant->users()->attach($user->id, [
                'role' => 'owner',
                'is_active' => true,
                'joined_at' => now(),
            ]);
        }

        // Super admin
        User::firstOrCreate(
        ['email' => env('ADMIN_EMAIL', 'admin@topnotch.app')],
        [
            'name' => 'Super Admin',
            'password' => Hash::make(env('ADMIN_PASSWORD', 'admin_password')),
            'is_super_admin' => true,
        ]
        );

        $this->command->info("Users seeded. Login: " . env('DEMO_USER_EMAIL', 'demo@topnotch.app') . " / " . env('DEMO_USER_PASSWORD', 'password'));
    }
}
