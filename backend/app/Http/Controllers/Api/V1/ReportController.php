<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\PurchaseBill;
use App\Models\Expense;
use App\Models\Party;
use App\Models\VoucherItem;
use App\Services\AccountingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct(private AccountingService $accountingService) {}

    public function salesSummary(Request $request): JsonResponse
    {
        $request->validate(['from_date' => 'required|date', 'to_date' => 'required|date']);

        $invoices = Invoice::whereIn('status', ['posted', 'partially_paid', 'paid', 'overdue'])
            ->whereBetween('date', [$request->from_date, $request->to_date])
            ->get();

        return response()->json([
            'total_invoices' => $invoices->count(),
            'total_sales' => $invoices->sum('total'),
            'total_collected' => $invoices->sum('amount_paid'),
            'total_outstanding' => $invoices->sum('balance'),
            'total_tax' => $invoices->sum('tax_amount'),
        ]);
    }

    public function outstandingReceivables(Request $request): JsonResponse
    {
        $invoices = Invoice::with('party')
            ->whereIn('status', ['posted', 'partially_paid', 'overdue'])
            ->where('balance', '>', 0)
            ->get()
            ->groupBy('party_id')
            ->map(function ($group) {
                return [
                    'party' => $group->first()->party,
                    'total_outstanding' => $group->sum('balance'),
                    'invoices_count' => $group->count(),
                    'oldest_invoice_date' => $group->min('date'),
                ];
            })
            ->values();

        return response()->json($invoices);
    }

    public function purchaseSummary(Request $request): JsonResponse
    {
        $request->validate(['from_date' => 'required|date', 'to_date' => 'required|date']);

        $bills = PurchaseBill::whereIn('status', ['posted', 'partially_paid', 'paid'])
            ->whereBetween('date', [$request->from_date, $request->to_date])
            ->get();

        $expenses = Expense::whereBetween('date', [$request->from_date, $request->to_date])->get();

        return response()->json([
            'total_bills' => $bills->count(),
            'total_purchases' => $bills->sum('total'),
            'total_paid' => $bills->sum('amount_paid'),
            'total_payable' => $bills->sum('balance'),
            'total_expenses' => $expenses->sum('amount'),
            'total_itc' => $bills->where('itc_eligible', true)->sum('tax_amount'),
        ]);
    }

    public function outstandingPayables(Request $request): JsonResponse
    {
        $bills = PurchaseBill::with('party')
            ->whereIn('status', ['posted', 'partially_paid', 'overdue'])
            ->where('balance', '>', 0)
            ->get()
            ->groupBy('party_id')
            ->map(function ($group) {
                return [
                    'party' => $group->first()->party,
                    'total_outstanding' => $group->sum('balance'),
                    'bills_count' => $group->count(),
                ];
            })
            ->values();

        return response()->json($bills);
    }

    public function daybook(Request $request): JsonResponse
    {
        $request->validate(['date' => 'required|date']);

        $invoices = Invoice::whereDate('date', $request->date)->with('party')->get();
        $bills = PurchaseBill::whereDate('date', $request->date)->with('party')->get();
        $expenses = Expense::whereDate('date', $request->date)->get();

        return response()->json([
            'date' => $request->date,
            'invoices' => $invoices,
            'bills' => $bills,
            'expenses' => $expenses,
        ]);
    }

    public function profitLoss(Request $request): JsonResponse
    {
        $request->validate(['from_date' => 'required|date', 'to_date' => 'required|date']);

        $invoices = Invoice::whereIn('status', ['posted', 'partially_paid', 'paid', 'overdue'])
            ->whereBetween('date', [$request->from_date, $request->to_date])
            ->get();

        $bills = PurchaseBill::whereIn('status', ['posted', 'partially_paid', 'paid'])
            ->whereBetween('date', [$request->from_date, $request->to_date])
            ->get();

        $expenses = Expense::whereBetween('date', [$request->from_date, $request->to_date])->get();

        $revenue = $invoices->sum('subtotal');
        $cogs = $bills->sum('subtotal');
        $opex = $expenses->sum('amount');
        $grossProfit = $revenue - $cogs;
        $netProfit = $grossProfit - $opex;

        return response()->json([
            'period' => ['from' => $request->from_date, 'to' => $request->to_date],
            'revenue' => $revenue,
            'cogs' => $cogs,
            'gross_profit' => $grossProfit,
            'gross_margin_pct' => $revenue > 0 ? round(($grossProfit / $revenue) * 100, 2) : 0,
            'operating_expenses' => $opex,
            'net_profit' => $netProfit,
            'net_margin_pct' => $revenue > 0 ? round(($netProfit / $revenue) * 100, 2) : 0,
        ]);
    }

    public function partyStatement(Request $request, Party $party): JsonResponse
    {
        $request->validate(['from_date' => 'nullable|date', 'to_date' => 'nullable|date']);

        $invoices = $party->invoices()
            ->when($request->from_date, fn($q) => $q->whereDate('date', '>=', $request->from_date))
            ->when($request->to_date, fn($q) => $q->whereDate('date', '<=', $request->to_date))
            ->get()
            ->map(fn($inv) => [
                'type' => 'invoice',
                'date' => $inv->date,
                'reference' => $inv->number,
                'debit' => $inv->total,
                'credit' => 0,
                'balance' => $inv->balance,
            ]);

        $payments = $party->invoices()
            ->with('payments')
            ->when($request->from_date, fn($q) => $q->whereDate('date', '>=', $request->from_date))
            ->when($request->to_date, fn($q) => $q->whereDate('date', '<=', $request->to_date))
            ->get()
            ->flatMap->payments
            ->map(fn($pmt) => [
                'type' => 'payment',
                'date' => $pmt->date,
                'reference' => 'Payment',
                'debit' => 0,
                'credit' => $pmt->amount,
                'balance' => 0,
            ]);

        $transactions = $invoices->concat($payments)->sortBy('date')->values();

        return response()->json([
            'party' => $party,
            'transactions' => $transactions,
            'closing_balance' => $party->current_balance,
        ]);
    }

    public function balanceSheet(Request $request): JsonResponse
    {
        $request->validate(['as_of_date' => 'required|date']);

        $trialBalance = $this->accountingService->getTrialBalance(null, $request->as_of_date);

        $assets = array_filter($trialBalance, fn($r) => $r['account']->type === 'asset');
        $liabilities = array_filter($trialBalance, fn($r) => $r['account']->type === 'liability');
        $equity = array_filter($trialBalance, fn($r) => $r['account']->type === 'equity');

        return response()->json([
            'as_of_date' => $request->as_of_date,
            'assets' => array_values($assets),
            'liabilities' => array_values($liabilities),
            'equity' => array_values($equity),
            'total_assets' => array_sum(array_column(array_values($assets), 'debit')),
            'total_liabilities_equity' => array_sum(array_column(array_values($liabilities), 'credit')) + array_sum(array_column(array_values($equity), 'credit')),
        ]);
    }

    public function cashFlow(Request $request): JsonResponse
    {
        $request->validate(['from_date' => 'required|date', 'to_date' => 'required|date']);

        $receipts = Invoice::whereIn('status', ['paid', 'partially_paid'])
            ->whereBetween('date', [$request->from_date, $request->to_date])
            ->sum('amount_paid');

        $payments = PurchaseBill::whereIn('status', ['paid', 'partially_paid'])
            ->whereBetween('date', [$request->from_date, $request->to_date])
            ->sum('amount_paid');

        $expensePayments = Expense::whereBetween('date', [$request->from_date, $request->to_date])
            ->sum('amount');

        return response()->json([
            'period' => ['from' => $request->from_date, 'to' => $request->to_date],
            'operating' => [
                'receipts_from_customers' => $receipts,
                'payments_to_suppliers' => $payments,
                'expense_payments' => $expensePayments,
                'net_operating' => $receipts - $payments - $expensePayments,
            ],
        ]);
    }
}
