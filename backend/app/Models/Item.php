<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'sku', 'hsn_sac', 'type', 'category_id', 'unit_id',
        'sale_price', 'purchase_price', 'tax_rate_id', 'track_stock',
        'opening_stock', 'current_stock', 'stock_alert_qty', 'description', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'track_stock' => 'boolean',
        'sale_price' => 'decimal:2',
        'purchase_price' => 'decimal:2',
        'opening_stock' => 'decimal:3',
        'current_stock' => 'decimal:3',
        'stock_alert_qty' => 'decimal:3',
    ];

    public function category()
    {
        return $this->belongsTo(ItemCategory::class, 'category_id');
    }

    public function unit()
    {
        return $this->belongsTo(ItemUnit::class, 'unit_id');
    }

    public function taxRate()
    {
        return $this->belongsTo(TaxRate::class);
    }

    public function invoiceItems()
    {
        return $this->hasMany(InvoiceItem::class);
    }
}
