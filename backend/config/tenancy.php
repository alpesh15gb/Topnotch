<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Tenant Identification
    |--------------------------------------------------------------------------
    | How to identify the current tenant from the request.
    | Options: 'header', 'subdomain', 'domain'
    */
    'identification' => 'header',

    'header' => 'X-Tenant-ID',

    /*
    |--------------------------------------------------------------------------
    | Schema Prefix
    |--------------------------------------------------------------------------
    | PostgreSQL schema prefix for tenant schemas.
    */
    'schema_prefix' => 'tenant_',

    /*
    |--------------------------------------------------------------------------
    | Default Schema (public tables)
    |--------------------------------------------------------------------------
    */
    'default_schema' => 'public',

    /*
    |--------------------------------------------------------------------------
    | Tenant Model
    |--------------------------------------------------------------------------
    */
    'tenant_model' => \App\Models\Tenant::class,

    /*
    |--------------------------------------------------------------------------
    | Plans
    |--------------------------------------------------------------------------
    */
    'plans' => [
        'free' => [
            'max_invoices_per_month' => 10,
            'max_users' => 1,
            'max_items' => 50,
        ],
        'starter' => [
            'max_invoices_per_month' => 100,
            'max_users' => 3,
            'max_items' => 500,
        ],
        'professional' => [
            'max_invoices_per_month' => 1000,
            'max_users' => 10,
            'max_items' => -1, // unlimited
        ],
        'enterprise' => [
            'max_invoices_per_month' => -1,
            'max_users' => -1,
            'max_items' => -1,
        ],
    ],
];
