<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemUnit extends Model
{
    protected $fillable = ['name', 'symbol'];

    public function items()
    {
        return $this->hasMany(Item::class, 'unit_id');
    }
}
