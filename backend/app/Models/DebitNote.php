<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DebitNote extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'number', 'party_id', 'purchase_bill_id', 'date', 'status',
        'subtotal', 'tax_amount', 'total', 'balance', 'reason', 'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'balance' => 'decimal:2',
    ];

    public function party()
    {
        return $this->belongsTo(Party::class);
    }

    public function purchaseBill()
    {
        return $this->belongsTo(PurchaseBill::class);
    }

    public function items()
    {
        return $this->hasMany(DebitNoteItem::class)->orderBy('sort_order');
    }
}
