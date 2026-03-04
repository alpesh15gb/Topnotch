<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Estimate;
use App\Models\Party;
use Illuminate\Support\Facades\Mail;

class EmailService
{
    public function sendInvoice(Invoice $invoice, string $toEmail = null): void
    {
        $toEmail = $toEmail ?? $invoice->party->email;

        if (!$toEmail) {
            throw new \InvalidArgumentException('No email address for party');
        }

        Mail::send('emails.invoice', ['invoice' => $invoice], function ($m) use ($invoice, $toEmail) {
            $m->to($toEmail)
              ->subject("Invoice #{$invoice->number} from " . config('app.name'));
        });
    }

    public function sendEstimate(Estimate $estimate, string $toEmail = null): void
    {
        $toEmail = $toEmail ?? $estimate->party->email;

        if (!$toEmail) {
            throw new \InvalidArgumentException('No email address for party');
        }

        Mail::send('emails.estimate', ['estimate' => $estimate], function ($m) use ($estimate, $toEmail) {
            $m->to($toEmail)
              ->subject("Estimate #{$estimate->number} from " . config('app.name'));
        });
    }

    public function sendPaymentReminder(Invoice $invoice): void
    {
        $toEmail = $invoice->party->email;

        if (!$toEmail) return;

        Mail::send('emails.payment-reminder', ['invoice' => $invoice], function ($m) use ($invoice, $toEmail) {
            $m->to($toEmail)
              ->subject("Payment Reminder: Invoice #{$invoice->number}");
        });
    }

    public function sendPartyStatement(Party $party, array $transactions, string $toEmail = null): void
    {
        $toEmail = $toEmail ?? $party->email;

        if (!$toEmail) {
            throw new \InvalidArgumentException('No email address for party');
        }

        Mail::send('emails.party-statement', compact('party', 'transactions'), function ($m) use ($party, $toEmail) {
            $m->to($toEmail)
              ->subject("Account Statement for " . $party->name);
        });
    }
}
