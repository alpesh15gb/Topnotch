<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VendorPayment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'payment_number', 'party_id', 'account_id', 'date',
        'amount', 'payment_mode', 'reference_number', 'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function party()
    {
        return $this->belongsTo(Party::class);
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
