<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use App\Services\TenantService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IdentifyTenant
{
    public function __construct(private TenantService $tenantService) {}

    public function handle(Request $request, Closure $next): Response
    {
        $tenantId = $request->header(config('tenancy.header', 'X-Tenant-ID'));

        if (!$tenantId) {
            return response()->json(['message' => 'Tenant not specified'], 400);
        }

        $tenant = Tenant::where('id', $tenantId)
            ->where('status', 'active')
            ->first();

        if (!$tenant) {
            return response()->json(['message' => 'Tenant not found or inactive'], 404);
        }

        // Bind tenant to container
        app()->instance('current_tenant', $tenant);

        // Switch PostgreSQL search_path to tenant schema
        $this->tenantService->switchSchema($tenant);

        $request->merge(['tenant' => $tenant]);

        return $next($request);
    }
}
