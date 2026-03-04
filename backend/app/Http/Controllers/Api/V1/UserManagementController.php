<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserManagementController extends Controller
{
    public function index(): JsonResponse
    {
        $tenant = app('current_tenant');
        $users = $tenant->users()->with([])->get()->map(function ($user) {
            return array_merge($user->toArray(), ['role' => $user->pivot->role, 'is_active' => $user->pivot->is_active]);
        });

        return response()->json($users);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'role' => 'required|in:owner,admin,accountant,sales,viewer',
        ]);

        $tenant = app('current_tenant');

        $user = User::firstOrCreate(
            ['email' => $validated['email']],
            ['name' => $validated['name'], 'password' => Hash::make(str()->random(16))]
        );

        // Check if already member
        if ($tenant->users()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'User already a member of this tenant'], 422);
        }

        $tenant->users()->attach($user->id, [
            'role' => $validated['role'],
            'is_active' => true,
            'joined_at' => now(),
        ]);

        return response()->json(['message' => 'User invited', 'user' => $user], 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'role' => 'nullable|in:owner,admin,accountant,sales,viewer',
            'is_active' => 'nullable|boolean',
        ]);

        $tenant = app('current_tenant');
        $tenant->users()->updateExistingPivot($user->id, $validated);

        return response()->json(['message' => 'User updated']);
    }

    public function destroy(User $user): JsonResponse
    {
        $tenant = app('current_tenant');
        $tenant->users()->detach($user->id);

        return response()->json(['message' => 'User removed from tenant']);
    }

    public function activityLog(Request $request): JsonResponse
    {
        $logs = ActivityLog::with('user')
            ->latest()
            ->paginate($request->get('per_page', 30));

        return response()->json($logs);
    }
}
