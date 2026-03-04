<?php

namespace App\Jobs;

use App\Models\Invoice;
use App\Services\EmailService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendInvoiceEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 60;

    public function __construct(
        public readonly Invoice $invoice,
        public readonly ?string $toEmail = null,
    ) {}

    public function handle(EmailService $emailService): void
    {
        $emailService->sendInvoice($this->invoice, $this->toEmail);
    }
}
