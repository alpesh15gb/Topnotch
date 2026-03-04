<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TenantSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompanySettingController extends Controller
{
    public function show(): JsonResponse
    {
        $tenant = app('current_tenant');
        $setting = $tenant->setting ?? TenantSetting::firstOrCreate(['tenant_id' => $tenant->id]);

        return response()->json(array_merge($tenant->toArray(), ['setting' => $setting]));
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'gstin' => 'nullable|string|size:15',
            'pan' => 'nullable|string|size:10',
            'cin' => 'nullable|string|max:21',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'state_code' => 'nullable|string|size:2',
            'pincode' => 'nullable|string|max:6',
            'phone' => 'nullable|string|max:15',
            'email' => 'nullable|email',
            'website' => 'nullable|url',
            'fiscal_year_start' => 'nullable|integer|min:1|max:12',
            'currency' => 'nullable|string|size:3',
            'decimal_places' => 'nullable|integer|in:0,2,3',
            'invoice_prefix' => 'nullable|string|max:10',
            'upi_id' => 'nullable|string',
            'bank_details' => 'nullable|array',
            'invoice_footer_notes' => 'nullable|string',
            'terms_and_conditions' => 'nullable|string',
        ]);

        $tenant = app('current_tenant');

        DB::transaction(function () use ($tenant, $validated) {
            if (isset($validated['name'])) {
                $tenant->update(['name' => $validated['name']]);
                unset($validated['name']);
            }

            $setting = $tenant->setting ?? TenantSetting::firstOrCreate(['tenant_id' => $tenant->id]);
            $setting->update($validated);
        });

        return response()->json(['message' => 'Settings updated']);
    }

    public function uploadLogo(Request $request): JsonResponse
    {
        $request->validate(['logo' => 'required|image|mimes:jpg,jpeg,png,svg|max:2048']);

        $path = $request->file('logo')->store('company/logos', 'public');

        $tenant = app('current_tenant');
        $setting = $tenant->setting;
        $setting->update(['logo' => $path]);

        return response()->json(['path' => $path]);
    }

    public function uploadESignature(Request $request): JsonResponse
    {
        $request->validate(['signature' => 'required|image|mimes:jpg,jpeg,png|max:1024']);

        $path = $request->file('signature')->store('company/signatures', 'public');

        $tenant = app('current_tenant');
        $setting = $tenant->setting;
        $setting->update(['e_signature_path' => $path]);

        return response()->json(['path' => $path]);
    }
}
