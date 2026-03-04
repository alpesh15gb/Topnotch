<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PurchaseBill extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'number', 'party_id', 'purchase_order_id', 'supplier_invoice_no',
        'supplier_invoice_date', 'date', 'due_date', 'status',
        'subtotal', 'tax_amount', 'discount', 'total', 'amount_paid', 'balance',
        'itc_eligible', 'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'due_date' => 'date',
        'supplier_invoice_date' => 'date',
        'itc_eligible' => 'boolean',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'balance' => 'decimal:2',
    ];

    public function party()
    {
        return $this->belongsTo(Party::class);
    }

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function items()
    {
        return $this->hasMany(PurchaseBillItem::class)->orderBy('sort_order');
    }
}
