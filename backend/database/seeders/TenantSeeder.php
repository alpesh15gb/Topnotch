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
            ['subdomain' => 'demo'],
            [
                'name' => 'Demo Company Pvt Ltd',
                'schema_name' => 'tenant_demo',
                'plan' => 'professional',
                'status' => 'active',
                'owner_email' => 'demo@topnotch.app',
            ]
        );

        TenantSetting::firstOrCreate(
            ['tenant_id' => $tenant->id],
            [
                'gstin' => '27AABCU9603R1ZX',
                'pan' => 'AABCU9603R',
                'address' => '123 Business Park, Andheri East',
                'city' => 'Mumbai',
                'state' => 'Maharashtra',
                'state_code' => '27',
                'pincode' => '400069',
                'phone' => '+91 98765 43210',
                'email' => 'billing@demo.com',
                'fiscal_year_start' => 4,
                'currency' => 'INR',
                'decimal_places' => 2,
                'invoice_prefix' => 'INV',
                'invoice_footer_notes' => 'Thank you for your business!',
                'terms_and_conditions' => 'Payment due within 30 days. Late payments subject to 2% monthly interest.',
            ]
        );

        $this->command->info("Demo tenant created: ID {$tenant->id}");
    }
}
