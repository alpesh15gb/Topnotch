<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $tenant = app('current_tenant');

        if (!$tenant) {
            return response()->json(['message' => 'No tenant context'], 400);
        }

        $userTenant = $user->tenants()->where('tenant_id', $tenant->id)->first();

        if (!$userTenant || !$userTenant->pivot->is_active) {
            return response()->json(['message' => 'Access denied to this tenant'], 403);
        }

        // Store role in request for controllers
        $request->merge(['tenant_role' => $userTenant->pivot->role]);

        return $next($request);
    }
}
