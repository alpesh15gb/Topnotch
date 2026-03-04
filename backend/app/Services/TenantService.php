<?php

namespace App\Services;

use App\Models\Tenant;
use App\Models\TenantSetting;
use Illuminate\Support\Facades\DB;

class TenantService
{
    public function createTenant(array $data): Tenant
    {
        $tenant = Tenant::create([
            'name' => $data['company_name'],
            'subdomain' => $data['subdomain'],
            'schema_name' => 'tenant_' . uniqid(),
            'plan' => $data['plan'] ?? 'free',
            'status' => 'active',
            'owner_email' => $data['email'],
        ]);

        $this->provisionSchema($tenant);

        TenantSetting::create([
            'tenant_id' => $tenant->id,
            'gstin' => $data['gstin'] ?? null,
            'invoice_prefix' => 'INV',
            'fiscal_year_start' => 4,
            'currency' => 'INR',
            'decimal_places' => 2,
        ]);

        return $tenant;
    }

    public function provisionSchema(Tenant $tenant): void
    {
        $schemaName = $tenant->getSchemaName();

        // Create schema
        DB::statement("CREATE SCHEMA IF NOT EXISTS \"{$schemaName}\"");

        // Run tenant-specific migrations in the new schema
        DB::statement("SET search_path TO \"{$schemaName}\", public");

        // Note: In production, run per-tenant migrations here
        // This is handled by TenantMigrationService in full implementation
    }

    public function switchSchema(Tenant $tenant): void
    {
        $schemaName = $tenant->getSchemaName();
        DB::statement("SET search_path TO \"{$schemaName}\", public");
    }

    public function resetToPublicSchema(): void
    {
        DB::statement('SET search_path TO public');
    }

    public function dropSchema(Tenant $tenant): void
    {
        $schemaName = $tenant->getSchemaName();
        DB::statement("DROP SCHEMA IF EXISTS \"{$schemaName}\" CASCADE");
    }
}
