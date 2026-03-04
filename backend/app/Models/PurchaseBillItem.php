<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseBillItem extends Model
{
    protected $fillable = [
        'purchase_bill_id', 'item_id', 'description', 'hsn_sac', 'qty', 'unit_price',
        'tax_rate_id', 'cgst', 'sgst', 'igst', 'itc_eligible', 'amount', 'sort_order',
    ];

    protected $casts = [
        'qty' => 'decimal:3',
        'unit_price' => 'decimal:2',
        'cgst' => 'decimal:2',
        'sgst' => 'decimal:2',
        'igst' => 'decimal:2',
        'itc_eligible' => 'boolean',
        'amount' => 'decimal:2',
    ];

    public function purchaseBill()
    {
        return $this->belongsTo(PurchaseBill::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function taxRate()
    {
        return $this->belongsTo(TaxRate::class);
    }
}
