<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\PurchaseBill;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class GstService
{
    /**
     * Compute GSTR-1 data for a given period (YYYY-MM).
     */
    public function computeGSTR1(string $period): array
    {
        [$year, $month] = explode('-', $period);

        $invoices = Invoice::whereYear('date', $year)
            ->whereMonth('date', $month)
            ->whereIn('status', ['posted', 'partially_paid', 'paid', 'overdue'])
            ->with(['party', 'items.taxRate'])
            ->get();

        $b2b = []; // B2B invoices (GSTIN registered)
        $b2c = []; // B2C invoices
        $hsn = []; // HSN-wise summary
        $nilRated = [];

        foreach ($invoices as $invoice) {
            $isB2B = !empty($invoice->party->gstin);

            $entry = [
                'invoice_no' => $invoice->number,
                'invoice_date' => $invoice->date->format('d-m-Y'),
                'party_name' => $invoice->party->name,
                'gstin' => $invoice->party->gstin,
                'place_of_supply' => $invoice->place_of_supply,
                'taxable_value' => $invoice->subtotal - $invoice->discount,
                'cgst' => 0,
                'sgst' => 0,
                'igst' => 0,
                'total' => $invoice->total,
            ];

            foreach ($invoice->items as $item) {
                $entry['cgst'] += $item->cgst;
                $entry['sgst'] += $item->sgst;
                $entry['igst'] += $item->igst;

                // HSN summary
                $hsn_code = $item->hsn_sac ?? 'MISC';
                if (!isset($hsn[$hsn_code])) {
                    $hsn[$hsn_code] = ['qty' => 0, 'taxable_value' => 0, 'cgst' => 0, 'sgst' => 0, 'igst' => 0];
                }
                $hsn[$hsn_code]['qty'] += $item->qty;
                $hsn[$hsn_code]['taxable_value'] += $item->amount;
                $hsn[$hsn_code]['cgst'] += $item->cgst;
                $hsn[$hsn_code]['sgst'] += $item->sgst;
                $hsn[$hsn_code]['igst'] += $item->igst;
            }

            if ($isB2B) {
                $b2b[] = $entry;
            } else {
                $b2c[] = $entry;
            }
        }

        return [
            'period' => $period,
            'b2b' => $b2b,
            'b2c' => $b2c,
            'hsn' => $hsn,
            'nil_rated' => $nilRated,
            'total_invoices' => count($invoices),
            'total_taxable_value' => $invoices->sum('subtotal'),
            'total_tax' => $invoices->sum('tax_amount'),
        ];
    }

    /**
     * Compute GSTR-2 data (purchase register).
     */
    public function computeGSTR2(string $period): array
    {
        [$year, $month] = explode('-', $period);

        $bills = PurchaseBill::whereYear('date', $year)
            ->whereMonth('date', $month)
            ->whereIn('status', ['posted', 'partially_paid', 'paid'])
            ->with(['party', 'items.taxRate'])
            ->get();

        $b2b = [];
        foreach ($bills as $bill) {
            $entry = [
                'bill_no' => $bill->number,
                'supplier_invoice_no' => $bill->supplier_invoice_no,
                'date' => $bill->date->format('d-m-Y'),
                'supplier_name' => $bill->party->name,
                'gstin' => $bill->party->gstin,
                'taxable_value' => $bill->subtotal,
                'cgst' => $bill->items->sum('cgst'),
                'sgst' => $bill->items->sum('sgst'),
                'igst' => $bill->items->sum('igst'),
                'itc_eligible' => $bill->itc_eligible,
                'total' => $bill->total,
            ];
            $b2b[] = $entry;
        }

        return [
            'period' => $period,
            'b2b' => $b2b,
            'total_bills' => count($bills),
            'total_taxable_value' => $bills->sum('subtotal'),
            'total_itc' => $bills->where('itc_eligible', true)->sum('tax_amount'),
        ];
    }

    /**
     * Compute GSTR-3B summary.
     */
    public function computeGSTR3B(string $period): array
    {
        $gstr1 = $this->computeGSTR1($period);
        $gstr2 = $this->computeGSTR2($period);

        $outwardTax = [
            'taxable_value' => collect($gstr1['b2b'])->sum('taxable_value') + collect($gstr1['b2c'])->sum('taxable_value'),
            'cgst' => collect($gstr1['b2b'])->sum('cgst') + collect($gstr1['b2c'])->sum('cgst'),
            'sgst' => collect($gstr1['b2b'])->sum('sgst') + collect($gstr1['b2c'])->sum('sgst'),
            'igst' => collect($gstr1['b2b'])->sum('igst') + collect($gstr1['b2c'])->sum('igst'),
        ];

        $itcAvailable = [
            'cgst' => collect($gstr2['b2b'])->where('itc_eligible', true)->sum('cgst'),
            'sgst' => collect($gstr2['b2b'])->where('itc_eligible', true)->sum('sgst'),
            'igst' => collect($gstr2['b2b'])->where('itc_eligible', true)->sum('igst'),
        ];

        $taxPayable = [
            'cgst' => max(0, $outwardTax['cgst'] - $itcAvailable['cgst']),
            'sgst' => max(0, $outwardTax['sgst'] - $itcAvailable['sgst']),
            'igst' => max(0, $outwardTax['igst'] - $itcAvailable['igst']),
        ];

        return [
            'period' => $period,
            'outward_tax' => $outwardTax,
            'itc_available' => $itcAvailable,
            'tax_payable' => $taxPayable,
            'total_tax_payable' => array_sum($taxPayable),
        ];
    }

    public function exportJSON(string $returnType, string $period): array
    {
        return match ($returnType) {
            'GSTR1' => $this->computeGSTR1($period),
            'GSTR2' => $this->computeGSTR2($period),
            'GSTR3B' => $this->computeGSTR3B($period),
            default => throw new \InvalidArgumentException("Unknown return type: {$returnType}"),
        };
    }
}
