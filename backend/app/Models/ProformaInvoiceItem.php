<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProformaInvoiceItem extends Model
{
    protected $fillable = [
        'proforma_invoice_id', 'item_id', 'description', 'qty', 'unit_price',
        'discount_pct', 'tax_rate_id', 'cgst', 'sgst', 'igst', 'amount', 'sort_order',
    ];

    protected $casts = [
        'qty' => 'decimal:3',
        'unit_price' => 'decimal:2',
        'discount_pct' => 'decimal:2',
        'cgst' => 'decimal:2',
        'sgst' => 'decimal:2',
        'igst' => 'decimal:2',
        'amount' => 'decimal:2',
    ];

    public function proformaInvoice()
    {
        return $this->belongsTo(ProformaInvoice::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
