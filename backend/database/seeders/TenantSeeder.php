<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\TenantSetting;
use App\Models\User;
use App\Services\TenantService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TenantSeeder extends Seeder
{
    public function run(TenantService $tenantService): void
    {
        // Create demo tenant
        $tenant = Tenant::firstOrCreate(
        ['subdomain' => env('DEMO_TENANT_SUBDOMAIN', 'demo')],
        [
            'name' => env('DEMO_TENANT_NAME', 'Demo Company Pvt Ltd'),
            'schema_name' => 'tenant_' . env('DEMO_TENANT_SUBDOMAIN', 'demo'),
            'plan' => 'professional',
            'status' => 'active',
            'owner_email' => env('DEMO_USER_EMAIL', 'demo@topnotch.app'),
        ]
        );

        TenantSetting::firstOrCreate(
        ['tenant_id' => $tenant->id],
        [
            'gstin' => env('DEMO_TENANT_GSTIN', '27AABCU9603R1ZX'),
            'pan' => env('DEMO_TENANT_PAN', 'AABCU9603R'),
            'address' => env('DEMO_TENANT_ADDRESS', '123 Business Park, Andheri East'),
            'city' => env('DEMO_TENANT_CITY', 'Mumbai'),
            'state' => env('DEMO_TENANT_STATE', 'Maharashtra'),
            'state_code' => env('DEMO_TENANT_STATE_CODE', '27'),
            'pincode' => env('DEMO_TENANT_PINCODE', '400069'),
            'phone' => env('DEMO_TENANT_PHONE', '+91 98765 43210'),
            'email' => env('DEMO_TENANT_EMAIL', 'billing@demo.com'),
            'fiscal_year_start' => env('DEMO_TENANT_FY_START', 4),
            'currency' => env('DEMO_TENANT_CURRENCY', 'INR'),
            'decimal_places' => 2,
            'invoice_prefix' => 'INV',
            'invoice_footer_notes' => 'Thank you for your business!',
            'terms_and_conditions' => 'Payment due within 30 days.',
        ]
        );

        $this->command->info("Demo tenant created: ID {$tenant->id}");
    }
}
