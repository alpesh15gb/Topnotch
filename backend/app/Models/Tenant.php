<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tenant extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'subdomain', 'schema_name', 'plan', 'status', 'owner_email',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_tenant')
            ->withPivot(['role', 'is_active', 'joined_at'])
            ->withTimestamps();
    }

    public function setting()
    {
        return $this->hasOne(TenantSetting::class);
    }

    public function getSchemaName(): string
    {
        return config('tenancy.schema_prefix') . $this->id;
    }
}
