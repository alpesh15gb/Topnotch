<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Voucher;
use App\Models\VoucherItem;
use Illuminate\Support\Facades\DB;

class AccountingService
{
    /**
     * Post a double-entry voucher.
     * $entries = [['account_id' => 1, 'debit' => 100, 'credit' => 0, 'narration' => ''], ...]
     */
    public function postVoucher(string $type, array $entries, string $date, string $narration = '', ?string $referenceType = null, ?int $referenceId = null): Voucher
    {
        $totalDebit = collect($entries)->sum('debit');
        $totalCredit = collect($entries)->sum('credit');

        if (round($totalDebit, 2) !== round($totalCredit, 2)) {
            throw new \InvalidArgumentException("Voucher is not balanced. Debit: {$totalDebit}, Credit: {$totalCredit}");
        }

        return DB::transaction(function () use ($type, $entries, $date, $narration, $referenceType, $referenceId) {
            $voucher = Voucher::create([
                'type' => $type,
                'date' => $date,
                'narration' => $narration,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
            ]);

            foreach ($entries as $i => $entry) {
                VoucherItem::create([
                    'voucher_id' => $voucher->id,
                    'account_id' => $entry['account_id'],
                    'debit' => $entry['debit'] ?? 0,
                    'credit' => $entry['credit'] ?? 0,
                    'narration' => $entry['narration'] ?? null,
                    'sort_order' => $i,
                ]);
            }

            return $voucher;
        });
    }

    /**
     * Get net balance of an account up to a given date.
     */
    public function getBalance(int $accountId, string $date = null): array
    {
        $query = VoucherItem::where('account_id', $accountId)
            ->join('vouchers', 'voucher_items.voucher_id', '=', 'vouchers.id');

        if ($date) {
            $query->where('vouchers.date', '<=', $date);
        }

        $result = $query->selectRaw('SUM(debit) as total_debit, SUM(credit) as total_credit')->first();

        $debit = $result->total_debit ?? 0;
        $credit = $result->total_credit ?? 0;
        $net = $debit - $credit;

        return [
            'debit' => $debit,
            'credit' => $credit,
            'balance' => abs($net),
            'type' => $net >= 0 ? 'Dr' : 'Cr',
        ];
    }

    /**
     * Get trial balance for all accounts.
     */
    public function getTrialBalance(string $fromDate = null, string $toDate = null): array
    {
        $query = Account::where('is_active', true)
            ->with(['voucherItems' => function ($q) use ($fromDate, $toDate) {
                $q->join('vouchers', 'voucher_items.voucher_id', '=', 'vouchers.id');
                if ($fromDate) $q->where('vouchers.date', '>=', $fromDate);
                if ($toDate) $q->where('vouchers.date', '<=', $toDate);
            }]);

        $accounts = $query->get();

        return $accounts->map(function ($account) {
            $debit = $account->voucherItems->sum('debit');
            $credit = $account->voucherItems->sum('credit');
            return [
                'account' => $account,
                'debit' => $debit,
                'credit' => $credit,
            ];
        })->toArray();
    }
}
