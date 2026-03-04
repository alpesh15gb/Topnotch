<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Expense;
use App\Models\InvoiceItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class RecurringService
{
    public function __construct(private NumberingService $numberingService) {}

    public function processRecurringInvoices(): int
    {
        $count = 0;
        $today = Carbon::today();

        Invoice::where('is_recurring', true)
            ->where('status', '!=', 'cancelled')
            ->whereDate('next_recurring_date', '<=', $today)
            ->chunk(50, function ($invoices) use (&$count, $today) {
                foreach ($invoices as $invoice) {
                    DB::transaction(function () use ($invoice, $today, &$count) {
                        // Clone invoice
                        $newInvoice = $invoice->replicate([
                            'number', 'status', 'amount_paid', 'balance', 'irn', 'created_at', 'updated_at',
                        ]);
                        $newInvoice->number = $this->numberingService->generateInvoiceNumber($invoice->series_prefix);
                        $newInvoice->date = $today;
                        $newInvoice->due_date = $invoice->due_date
                            ? $today->copy()->addDays($invoice->due_date->diffInDays($invoice->date))
                            : null;
                        $newInvoice->status = 'draft';
                        $newInvoice->amount_paid = 0;
                        $newInvoice->balance = $invoice->total;
                        $newInvoice->save();

                        // Clone items
                        foreach ($invoice->items as $item) {
                            $newItem = $item->replicate(['invoice_id', 'created_at', 'updated_at']);
                            $newItem->invoice_id = $newInvoice->id;
                            $newItem->save();
                        }

                        // Update next recurring date
                        $invoice->next_recurring_date = $this->nextDate($invoice->next_recurring_date, $invoice->recurring_frequency);
                        $invoice->save();

                        $count++;
                    });
                }
            });

        return $count;
    }

    public function processRecurringExpenses(): int
    {
        $count = 0;
        $today = Carbon::today();

        Expense::where('is_recurring', true)
            ->whereDate('next_recurring_date', '<=', $today)
            ->chunk(50, function ($expenses) use (&$count, $today) {
                foreach ($expenses as $expense) {
                    $newExpense = $expense->replicate(['created_at', 'updated_at', 'receipt_path']);
                    $newExpense->date = $today;
                    $newExpense->next_recurring_date = $this->nextDate($expense->next_recurring_date, $expense->recurring_frequency);
                    $newExpense->save();

                    $expense->next_recurring_date = $newExpense->next_recurring_date;
                    $expense->save();

                    $count++;
                }
            });

        return $count;
    }

    private function nextDate(string $currentDate, string $frequency): Carbon
    {
        $date = Carbon::parse($currentDate);

        return match ($frequency) {
            'daily' => $date->addDay(),
            'weekly' => $date->addWeek(),
            'monthly' => $date->addMonth(),
            'quarterly' => $date->addMonths(3),
            'yearly' => $date->addYear(),
            default => $date->addMonth(),
        };
    }
}
