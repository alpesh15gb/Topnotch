<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TenantSetting extends Model
{
    protected $fillable = [
        'tenant_id', 'logo', 'gstin', 'pan', 'cin', 'address', 'city', 'state',
        'state_code', 'pincode', 'phone', 'email', 'website', 'fiscal_year_start',
        'currency', 'decimal_places', 'invoice_prefix', 'default_tax_rate_id',
        'e_signature_path', 'upi_id', 'bank_details', 'invoice_footer_notes', 'terms_and_conditions',
    ];

    protected $casts = [
        'bank_details' => 'array',
        'decimal_places' => 'integer',
        'fiscal_year_start' => 'integer',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
