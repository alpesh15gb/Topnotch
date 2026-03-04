<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Backup extends Model
{
    protected $fillable = [
        'type', 'filename', 'size', 'status', 'path', 'drive_file_id',
        'error_message', 'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
        'size' => 'integer',
    ];
}
