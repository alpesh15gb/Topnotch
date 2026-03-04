<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DebitNoteItem extends Model
{
    protected $fillable = [
        'debit_note_id', 'item_id', 'tax_rate_id', 'description', 'qty', 'unit_price',
        'cgst_rate', 'sgst_rate', 'igst_rate', 'cgst', 'sgst', 'igst', 'amount', 'sort_order',
    ];

    protected $casts = [
        'qty' => 'decimal:3',
        'unit_price' => 'decimal:2',
        'cgst_rate' => 'decimal:2',
        'sgst_rate' => 'decimal:2',
        'igst_rate' => 'decimal:2',
        'cgst' => 'decimal:2',
        'sgst' => 'decimal:2',
        'igst' => 'decimal:2',
        'amount' => 'decimal:2',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function taxRate()
    {
        return $this->belongsTo(TaxRate::class);
    }
}
