<?php

namespace Database\Seeders;

use App\Models\Account;
use Illuminate\Database\Seeder;

class DefaultAccountsSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            // ASSETS
            ['name' => 'Current Assets',        'code' => '1000', 'type' => 'asset',     'sub_type' => 'current',        'parent_id' => null, 'is_system' => true],
            ['name' => 'Cash in Hand',           'code' => '1001', 'type' => 'asset',     'sub_type' => 'current',        'parent_key' => '1000'],
            ['name' => 'Bank Accounts',          'code' => '1010', 'type' => 'asset',     'sub_type' => 'current',        'parent_key' => '1000'],
            ['name' => 'Accounts Receivable',    'code' => '1100', 'type' => 'asset',     'sub_type' => 'current',        'parent_key' => '1000'],
            ['name' => 'GST Input Tax Credit',   'code' => '1200', 'type' => 'asset',     'sub_type' => 'current',        'parent_key' => '1000'],
            ['name' => 'CGST Input',             'code' => '1201', 'type' => 'asset',     'sub_type' => 'current',        'parent_key' => '1200'],
            ['name' => 'SGST Input',             'code' => '1202', 'type' => 'asset',     'sub_type' => 'current',        'parent_key' => '1200'],
            ['name' => 'IGST Input',             'code' => '1203', 'type' => 'asset',     'sub_type' => 'current',        'parent_key' => '1200'],
            ['name' => 'Closing Stock',          'code' => '1300', 'type' => 'asset',     'sub_type' => 'current',        'parent_key' => '1000'],
            ['name' => 'Advance to Suppliers',   'code' => '1400', 'type' => 'asset',     'sub_type' => 'current',        'parent_key' => '1000'],
            ['name' => 'TDS Recoverable',        'code' => '1500', 'type' => 'asset',     'sub_type' => 'current',        'parent_key' => '1000'],
            ['name' => 'Fixed Assets',           'code' => '2000', 'type' => 'asset',     'sub_type' => 'fixed',          'parent_id' => null, 'is_system' => true],
            ['name' => 'Plant & Machinery',      'code' => '2001', 'type' => 'asset',     'sub_type' => 'fixed',          'parent_key' => '2000'],
            ['name' => 'Furniture & Fixtures',   'code' => '2002', 'type' => 'asset',     'sub_type' => 'fixed',          'parent_key' => '2000'],
            ['name' => 'Computers & Electronics','code' => '2003', 'type' => 'asset',     'sub_type' => 'fixed',          'parent_key' => '2000'],
            ['name' => 'Vehicles',               'code' => '2004', 'type' => 'asset',     'sub_type' => 'fixed',          'parent_key' => '2000'],

            // LIABILITIES
            ['name' => 'Current Liabilities',   'code' => '3000', 'type' => 'liability', 'sub_type' => 'current',        'parent_id' => null, 'is_system' => true],
            ['name' => 'Accounts Payable',       'code' => '3001', 'type' => 'liability', 'sub_type' => 'current',        'parent_key' => '3000'],
            ['name' => 'GST Output Tax',         'code' => '3100', 'type' => 'liability', 'sub_type' => 'current',        'parent_key' => '3000'],
            ['name' => 'CGST Output',            'code' => '3101', 'type' => 'liability', 'sub_type' => 'current',        'parent_key' => '3100'],
            ['name' => 'SGST Output',            'code' => '3102', 'type' => 'liability', 'sub_type' => 'current',        'parent_key' => '3100'],
            ['name' => 'IGST Output',            'code' => '3103', 'type' => 'liability', 'sub_type' => 'current',        'parent_key' => '3100'],
            ['name' => 'TDS Payable',            'code' => '3200', 'type' => 'liability', 'sub_type' => 'current',        'parent_key' => '3000'],
            ['name' => 'TCS Payable',            'code' => '3201', 'type' => 'liability', 'sub_type' => 'current',        'parent_key' => '3000'],
            ['name' => 'Advance from Customers', 'code' => '3300', 'type' => 'liability', 'sub_type' => 'current',        'parent_key' => '3000'],
            ['name' => 'Long Term Liabilities',  'code' => '4000', 'type' => 'liability', 'sub_type' => 'long_term',      'parent_id' => null, 'is_system' => true],
            ['name' => 'Term Loans',             'code' => '4001', 'type' => 'liability', 'sub_type' => 'long_term',      'parent_key' => '4000'],
            ['name' => 'Unsecured Loans',        'code' => '4002', 'type' => 'liability', 'sub_type' => 'long_term',      'parent_key' => '4000'],

            // EQUITY
            ['name' => 'Equity',                 'code' => '5000', 'type' => 'equity',    'sub_type' => 'owner',          'parent_id' => null, 'is_system' => true],
            ['name' => "Owner's Capital",        'code' => '5001', 'type' => 'equity',    'sub_type' => 'owner',          'parent_key' => '5000'],
            ['name' => 'Retained Earnings',      'code' => '5002', 'type' => 'equity',    'sub_type' => 'owner',          'parent_key' => '5000'],
            ['name' => 'Share Capital',          'code' => '5003', 'type' => 'equity',    'sub_type' => 'owner',          'parent_key' => '5000'],

            // INCOME
            ['name' => 'Revenue',                'code' => '6000', 'type' => 'income',    'sub_type' => 'operating',      'parent_id' => null, 'is_system' => true],
            ['name' => 'Sales Revenue',          'code' => '6001', 'type' => 'income',    'sub_type' => 'operating',      'parent_key' => '6000'],
            ['name' => 'Service Revenue',        'code' => '6002', 'type' => 'income',    'sub_type' => 'operating',      'parent_key' => '6000'],
            ['name' => 'Interest Income',        'code' => '6100', 'type' => 'income',    'sub_type' => 'other',          'parent_key' => '6000'],
            ['name' => 'Other Income',           'code' => '6200', 'type' => 'income',    'sub_type' => 'other',          'parent_key' => '6000'],

            // EXPENSES
            ['name' => 'Cost of Goods Sold',     'code' => '7000', 'type' => 'expense',   'sub_type' => 'cogs',           'parent_id' => null, 'is_system' => true],
            ['name' => 'Purchases',              'code' => '7001', 'type' => 'expense',   'sub_type' => 'cogs',           'parent_key' => '7000'],
            ['name' => 'Direct Expenses',        'code' => '7002', 'type' => 'expense',   'sub_type' => 'cogs',           'parent_key' => '7000'],
            ['name' => 'Operating Expenses',     'code' => '8000', 'type' => 'expense',   'sub_type' => 'operating',      'parent_id' => null, 'is_system' => true],
            ['name' => 'Salaries & Wages',       'code' => '8001', 'type' => 'expense',   'sub_type' => 'operating',      'parent_key' => '8000'],
            ['name' => 'Rent',                   'code' => '8002', 'type' => 'expense',   'sub_type' => 'operating',      'parent_key' => '8000'],
            ['name' => 'Electricity',            'code' => '8003', 'type' => 'expense',   'sub_type' => 'operating',      'parent_key' => '8000'],
            ['name' => 'Office Supplies',        'code' => '8004', 'type' => 'expense',   'sub_type' => 'operating',      'parent_key' => '8000'],
            ['name' => 'Marketing & Advertising','code' => '8005', 'type' => 'expense',   'sub_type' => 'operating',      'parent_key' => '8000'],
            ['name' => 'Telephone & Internet',   'code' => '8006', 'type' => 'expense',   'sub_type' => 'operating',      'parent_key' => '8000'],
            ['name' => 'Travel & Conveyance',    'code' => '8007', 'type' => 'expense',   'sub_type' => 'operating',      'parent_key' => '8000'],
            ['name' => 'Professional Fees',      'code' => '8008', 'type' => 'expense',   'sub_type' => 'operating',      'parent_key' => '8000'],
            ['name' => 'Repairs & Maintenance',  'code' => '8009', 'type' => 'expense',   'sub_type' => 'operating',      'parent_key' => '8000'],
            ['name' => 'Depreciation',           'code' => '8010', 'type' => 'expense',   'sub_type' => 'operating',      'parent_key' => '8000'],
            ['name' => 'Interest Expense',       'code' => '8011', 'type' => 'expense',   'sub_type' => 'financial',      'parent_key' => '8000'],
            ['name' => 'Bank Charges',           'code' => '8012', 'type' => 'expense',   'sub_type' => 'financial',      'parent_key' => '8000'],
            ['name' => 'Miscellaneous Expenses', 'code' => '8099', 'type' => 'expense',   'sub_type' => 'operating',      'parent_key' => '8000'],
        ];

        $codeToId = [];

        foreach ($accounts as $account) {
            $parentId = null;
            if (isset($account['parent_key'])) {
                $parentId = $codeToId[$account['parent_key']] ?? null;
            } elseif (isset($account['parent_id'])) {
                $parentId = $account['parent_id'];
            }

            $data = [
                'name' => $account['name'],
                'code' => $account['code'],
                'type' => $account['type'],
                'sub_type' => $account['sub_type'],
                'parent_id' => $parentId,
                'is_system' => $account['is_system'] ?? false,
                'is_active' => true,
                'opening_balance' => 0,
            ];

            $created = Account::firstOrCreate(['code' => $account['code']], $data);
            $codeToId[$account['code']] = $created->id;
        }
    }
}
