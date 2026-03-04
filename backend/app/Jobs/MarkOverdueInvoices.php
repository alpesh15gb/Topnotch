<?php

namespace App\Jobs;

use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class MarkOverdueInvoices implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $count = Invoice::whereIn('status', ['posted', 'partially_paid'])
            ->whereNotNull('due_date')
            ->where('due_date', '<', Carbon::today())
            ->update(['status' => 'overdue']);

        logger("Marked {$count} invoices as overdue");
    }
}
