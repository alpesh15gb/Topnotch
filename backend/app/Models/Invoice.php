<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'number', 'series_prefix', 'party_id', 'sale_order_id', 'proforma_id', 'estimate_id',
        'date', 'due_date', 'supply_state', 'supply_state_code', 'place_of_supply',
        'is_igst', 'status', 'subtotal', 'discount', 'tax_amount', 'tcs_rate', 'tcs_amount',
        'total', 'amount_paid', 'balance', 'notes', 'irn', 'template_id',
        'is_recurring', 'recurring_frequency', 'next_recurring_date',
    ];

    protected $casts = [
        'date' => 'date',
        'due_date' => 'date',
        'next_recurring_date' => 'date',
        'is_igst' => 'boolean',
        'is_recurring' => 'boolean',
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'tcs_rate' => 'decimal:2',
        'tcs_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'balance' => 'decimal:2',
    ];

    public function party()
    {
        return $this->belongsTo(Party::class);
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class)->orderBy('sort_order');
    }

    public function payments()
    {
        return $this->hasMany(InvoicePayment::class);
    }

    public function saleOrder()
    {
        return $this->belongsTo(SaleOrder::class);
    }

    public function proforma()
    {
        return $this->belongsTo(ProformaInvoice::class, 'proforma_id');
    }

    public function estimate()
    {
        return $this->belongsTo(Estimate::class);
    }
}
