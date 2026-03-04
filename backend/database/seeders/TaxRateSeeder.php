<?php

namespace Database\Seeders;

use App\Models\TaxRate;
use Illuminate\Database\Seeder;

class TaxRateSeeder extends Seeder
{
    public function run(): void
    {
        $rates = [
            ['name' => 'GST 0%',   'rate' => 0,  'type' => 'GST', 'cgst_rate' => 0,   'sgst_rate' => 0,   'igst_rate' => 0],
            ['name' => 'GST 5%',   'rate' => 5,  'type' => 'GST', 'cgst_rate' => 2.5, 'sgst_rate' => 2.5, 'igst_rate' => 5],
            ['name' => 'GST 12%',  'rate' => 12, 'type' => 'GST', 'cgst_rate' => 6,   'sgst_rate' => 6,   'igst_rate' => 12],
            ['name' => 'GST 18%',  'rate' => 18, 'type' => 'GST', 'cgst_rate' => 9,   'sgst_rate' => 9,   'igst_rate' => 18],
            ['name' => 'GST 28%',  'rate' => 28, 'type' => 'GST', 'cgst_rate' => 14,  'sgst_rate' => 14,  'igst_rate' => 28],
            ['name' => 'TDS 1%',   'rate' => 1,  'type' => 'TDS', 'cgst_rate' => 0,   'sgst_rate' => 0,   'igst_rate' => 0],
            ['name' => 'TDS 2%',   'rate' => 2,  'type' => 'TDS', 'cgst_rate' => 0,   'sgst_rate' => 0,   'igst_rate' => 0],
            ['name' => 'TDS 10%',  'rate' => 10, 'type' => 'TDS', 'cgst_rate' => 0,   'sgst_rate' => 0,   'igst_rate' => 0],
            ['name' => 'TCS 1%',   'rate' => 1,  'type' => 'TCS', 'cgst_rate' => 0,   'sgst_rate' => 0,   'igst_rate' => 0],
            ['name' => 'No Tax',   'rate' => 0,  'type' => 'none','cgst_rate' => 0,   'sgst_rate' => 0,   'igst_rate' => 0],
        ];

        foreach ($rates as $rate) {
            TaxRate::firstOrCreate(['name' => $rate['name'], 'type' => $rate['type']], array_merge($rate, ['is_active' => true]));
        }
    }
}
