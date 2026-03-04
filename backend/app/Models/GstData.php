<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GstData extends Model
{
    protected $table = 'gst_data';

    protected $fillable = [
        'return_type', 'period', 'data', 'status', 'filed_at',
    ];

    protected $casts = [
        'data' => 'array',
        'filed_at' => 'datetime',
    ];
}
