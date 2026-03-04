<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cheque extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'type', 'cheque_no', 'date', 'bank_name', 'amount',
        'party_id', 'bank_account_id', 'status', 'clearance_date',
        'bounce_charges', 'post_dated_date', 'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'clearance_date' => 'date',
        'post_dated_date' => 'date',
        'amount' => 'decimal:2',
        'bounce_charges' => 'decimal:2',
    ];

    public function party()
    {
        return $this->belongsTo(Party::class);
    }

    public function bankAccount()
    {
        return $this->belongsTo(BankAccount::class);
    }
}
