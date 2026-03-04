<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaleOrderItem extends Model
{
    protected $fillable = [
        'sale_order_id', 'item_id', 'description', 'qty', 'invoiced_qty', 'pending_qty',
        'unit_price', 'tax_rate_id', 'amount', 'sort_order',
    ];

    protected $casts = [
        'qty' => 'decimal:3',
        'invoiced_qty' => 'decimal:3',
        'pending_qty' => 'decimal:3',
        'unit_price' => 'decimal:2',
        'amount' => 'decimal:2',
    ];

    public function saleOrder()
    {
        return $this->belongsTo(SaleOrder::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
