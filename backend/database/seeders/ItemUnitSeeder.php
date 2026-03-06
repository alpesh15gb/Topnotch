<?php

namespace Database\Seeders;

use App\Models\ItemUnit;
use Illuminate\Database\Seeder;

class ItemUnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            ['name' => 'Pieces',    'symbol' => 'PCS'],
            ['name' => 'Numbers',   'symbol' => 'NOS'],
            ['name' => 'Kilograms', 'symbol' => 'KG'],
            ['name' => 'Grams',     'symbol' => 'GMS'],
            ['name' => 'Litres',    'symbol' => 'LTR'],
            ['name' => 'Millilitre','symbol' => 'ML'],
            ['name' => 'Metres',    'symbol' => 'MTR'],
            ['name' => 'Box',       'symbol' => 'BOX'],
            ['name' => 'Dozen',     'symbol' => 'DZN'],
            ['name' => 'Set',       'symbol' => 'SET'],
            ['name' => 'Pair',      'symbol' => 'PRS'],
            ['name' => 'Hours',     'symbol' => 'HRS'],
            ['name' => 'Days',      'symbol' => 'DAY'],
            ['name' => 'Months',    'symbol' => 'MON'],
        ];

        foreach ($units as $unit) {
            ItemUnit::firstOrCreate(['symbol' => $unit['symbol']], $unit);
        }
    }
}
