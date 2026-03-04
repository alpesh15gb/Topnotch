<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DejaVu Sans', sans-serif; font-size: 10px; color: #222; background: #fff; }

    .page-border { border: 2px solid #555; margin: 0; padding: 0; }
    .doc-title { text-align: center; background: #e8e8e8; padding: 6px; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #555; }
    .doc-subtitle { text-align: center; font-size: 8px; color: #555; padding: 3px; border-bottom: 1px solid #ccc; background: #f5f5f5; }

    .header-block { display: flex; border-bottom: 1.5px solid #555; }
    .company-col { width: 60%; padding: 12px 14px; border-right: 1.5px solid #555; }
    .invoice-col { width: 40%; padding: 12px 14px; }

    .company-name-big { font-size: 16px; font-weight: bold; color: #1a1a1a; margin-bottom: 4px; }
    .field-row { display: flex; margin-bottom: 3px; }
    .field-label { font-size: 9px; color: #666; width: 80px; flex-shrink: 0; }
    .field-val { font-size: 9px; color: #222; font-weight: 600; }

    .inv-field { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #eee; }
    .inv-field:last-child { border-bottom: none; }
    .inv-fl { font-size: 9px; color: #666; }
    .inv-fv { font-size: 9px; font-weight: bold; color: #1a1a1a; }

    .parties-block { display: flex; border-bottom: 1.5px solid #555; }
    .bill-col { width: 50%; padding: 10px 14px; border-right: 1.5px solid #555; }
    .supply-col { width: 50%; padding: 10px 14px; }

    .section-head { font-size: 8px; text-transform: uppercase; letter-spacing: 1px; color: #fff; background: #555; padding: 3px 7px; margin-bottom: 6px; display: inline-block; }
    .party-name { font-size: 13px; font-weight: bold; color: #1a1a1a; margin-bottom: 3px; }

    .items-section { border-bottom: 1.5px solid #555; }
    table { width: 100%; border-collapse: collapse; }
    thead th { background: #555; color: #fff; padding: 7px 6px; text-align: center; font-size: 9px; font-weight: bold; border-right: 1px solid #777; }
    thead th:first-child { border-left: none; }
    thead th:last-child { border-right: none; }
    tbody td { padding: 6px; border-bottom: 1px solid #ddd; border-right: 1px solid #ddd; font-size: 9px; }
    tbody td:last-child { border-right: none; }
    tbody tr:last-child td { border-bottom: none; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .item-name { font-weight: bold; font-size: 10px; }
    .item-desc { font-size: 8px; color: #777; margin-top: 1px; }

    .footer-block { display: flex; border-top: 1.5px solid #555; }
    .totals-col-left { width: 60%; padding: 10px 14px; border-right: 1.5px solid #555; }
    .totals-col-right { width: 40%; padding: 0; }

    .tax-summary-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    .tax-summary-table th { background: #e8e8e8; font-size: 8px; padding: 4px 6px; border: 1px solid #ccc; text-align: center; }
    .tax-summary-table td { font-size: 8px; padding: 4px 6px; border: 1px solid #ddd; text-align: center; }

    .totals-right-table { width: 100%; border-collapse: collapse; }
    .totals-right-table tr { border-bottom: 1px solid #ddd; }
    .totals-right-table td { padding: 5px 10px; font-size: 10px; }
    .totals-right-table .tlabel { color: #555; }
    .totals-right-table .tvalue { text-align: right; font-weight: bold; }
    .grand-total-row td { background: #555; color: #fff; font-size: 12px; font-weight: bold; }

    .sig-block { display: flex; border-top: 1.5px solid #555; }
    .notes-part { width: 60%; padding: 10px 14px; border-right: 1.5px solid #555; }
    .sig-part { width: 40%; padding: 10px 14px; text-align: center; }
    .sig-part img { max-height: 40px; margin-bottom: 5px; }
    .sig-line-div { border-top: 1px solid #555; padding-top: 4px; font-size: 9px; color: #555; margin-top: 10px; }

    .amount-words { background: #f5f5f5; border: 1px solid #ddd; padding: 6px 10px; margin: 0 14px 10px; font-size: 9px; }
    .amount-words strong { color: #555; }
</style>
</head>
<body>

<div class="page-border">
    <div class="doc-title">Tax Invoice</div>
    <div class="doc-subtitle">(Original for Recipient)</div>

    <div class="header-block">
        <div class="company-col">
            @if($setting?->logo)
            <img src="{{ public_path('storage/' . $setting->logo) }}" style="max-height:45px; margin-bottom:6px;" alt="Logo">
            @endif
            <div class="company-name-big">{{ $setting?->tenant?->name ?? 'Company Name' }}</div>
            @if($setting?->address)
            <div class="field-row"><span class="field-label">Address:</span><span class="field-val">{{ $setting->address }}, {{ $setting->city }}, {{ $setting->state }}</span></div>
            @endif
            @if($setting?->phone)
            <div class="field-row"><span class="field-label">Phone:</span><span class="field-val">{{ $setting->phone }}</span></div>
            @endif
            @if($setting?->gstin)
            <div class="field-row"><span class="field-label">GSTIN:</span><span class="field-val" style="color:#c0392b; font-size:11px; font-weight:bold;">{{ $setting->gstin }}</span></div>
            @endif
        </div>
        <div class="invoice-col">
            <div class="inv-field"><span class="inv-fl">Invoice Number</span><span class="inv-fv">{{ $invoice->number }}</span></div>
            <div class="inv-field"><span class="inv-fl">Invoice Date</span><span class="inv-fv">{{ $invoice->date->format('d/m/Y') }}</span></div>
            @if($invoice->due_date)
            <div class="inv-field"><span class="inv-fl">Due Date</span><span class="inv-fv">{{ $invoice->due_date->format('d/m/Y') }}</span></div>
            @endif
            <div class="inv-field"><span class="inv-fl">Place of Supply</span><span class="inv-fv">{{ $invoice->place_of_supply ?? '-' }}</span></div>
            <div class="inv-field"><span class="inv-fl">Tax Type</span><span class="inv-fv">{{ $invoice->is_igst ? 'IGST' : 'CGST + SGST' }}</span></div>
            <div class="inv-field" style="margin-top:6px;"><span class="inv-fl">Total Amount</span><span class="inv-fv" style="font-size:13px; color:#c0392b;">&#8377;{{ number_format($invoice->total, 2) }}</span></div>
        </div>
    </div>

    <div class="parties-block">
        <div class="bill-col">
            <span class="section-head">Bill To / Buyer Details</span>
            <div class="party-name">{{ $invoice->party->name }}</div>
            @if($invoice->party->gstin)
            <div class="field-row"><span class="field-label">GSTIN:</span><span class="field-val" style="color:#c0392b;">{{ $invoice->party->gstin }}</span></div>
            @endif
            @if($invoice->party->billing_address)
            <div class="field-row"><span class="field-label">Address:</span><span class="field-val">{{ $invoice->party->billing_address }}</span></div>
            @endif
            @if($invoice->party->city)
            <div class="field-row"><span class="field-label">City/State:</span><span class="field-val">{{ $invoice->party->city }}, {{ $invoice->party->state }}</span></div>
            @endif
            @if($invoice->party->phone)
            <div class="field-row"><span class="field-label">Phone:</span><span class="field-val">{{ $invoice->party->phone }}</span></div>
            @endif
        </div>
        <div class="supply-col">
            <span class="section-head">Dispatch / Supply Details</span>
            @if($invoice->place_of_supply)
            <div class="field-row"><span class="field-label">Place of Supply:</span><span class="field-val">{{ $invoice->place_of_supply }}</span></div>
            @endif
            <div class="field-row" style="margin-top:8px;"><span class="field-label">Invoice Date:</span><span class="field-val">{{ $invoice->date->format('d/m/Y') }}</span></div>
            @if($invoice->due_date)
            <div class="field-row"><span class="field-label">Due Date:</span><span class="field-val">{{ $invoice->due_date->format('d/m/Y') }}</span></div>
            @endif
            <div class="field-row"><span class="field-label">Tax Type:</span><span class="field-val">{{ $invoice->is_igst ? 'IGST (Inter-state)' : 'CGST + SGST (Intra-state)' }}</span></div>
        </div>
    </div>

    <div class="items-section">
        <table>
            <thead>
                <tr>
                    <th style="width:4%">Sr</th>
                    <th style="width:26%">Description of Goods/Services</th>
                    <th style="width:9%">HSN/SAC</th>
                    <th style="width:6%">Qty</th>
                    <th style="width:8%">Unit Rate (&#8377;)</th>
                    <th style="width:6%">Disc%</th>
                    <th style="width:9%">Taxable Value (&#8377;)</th>
                    @if($invoice->is_igst)
                    <th style="width:5%">IGST %</th>
                    <th style="width:8%">IGST Amt (&#8377;)</th>
                    @else
                    <th style="width:5%">CGST %</th>
                    <th style="width:7%">CGST Amt (&#8377;)</th>
                    <th style="width:5%">SGST %</th>
                    <th style="width:7%">SGST Amt (&#8377;)</th>
                    @endif
                    <th style="width:10%">Total (&#8377;)</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $idx => $item)
                <tr>
                    <td class="text-center">{{ $idx + 1 }}</td>
                    <td>
                        <div class="item-name">{{ $item->item?->name ?? $item->description }}</div>
                        @if($item->item?->name && $item->description)
                        <div class="item-desc">{{ $item->description }}</div>
                        @endif
                    </td>
                    <td class="text-center">{{ $item->hsn_sac ?? '-' }}</td>
                    <td class="text-center">{{ $item->qty }}</td>
                    <td class="text-right">{{ number_format($item->unit_price, 2) }}</td>
                    <td class="text-center">{{ $item->discount_pct > 0 ? $item->discount_pct . '%' : '-' }}</td>
                    @php
                        $taxable = $item->unit_price * $item->qty;
                        if($item->discount_pct > 0) $taxable = $taxable - ($taxable * $item->discount_pct / 100);
                    @endphp
                    <td class="text-right">{{ number_format($taxable, 2) }}</td>
                    @if($invoice->is_igst)
                    <td class="text-center">{{ $item->igst > 0 ? round($item->igst / $taxable * 100, 1) . '%' : '-' }}</td>
                    <td class="text-right">{{ $item->igst > 0 ? number_format($item->igst, 2) : '-' }}</td>
                    @else
                    <td class="text-center">{{ $item->cgst > 0 ? round($item->cgst / $taxable * 100, 1) . '%' : '-' }}</td>
                    <td class="text-right">{{ $item->cgst > 0 ? number_format($item->cgst, 2) : '-' }}</td>
                    <td class="text-center">{{ $item->sgst > 0 ? round($item->sgst / $taxable * 100, 1) . '%' : '-' }}</td>
                    <td class="text-right">{{ $item->sgst > 0 ? number_format($item->sgst, 2) : '-' }}</td>
                    @endif
                    <td class="text-right"><strong>{{ number_format($item->amount, 2) }}</strong></td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="footer-block">
        <div class="totals-col-left">
            <div style="font-size:9px; font-weight:bold; color:#555; margin-bottom:5px;">TAX SUMMARY</div>
            @if($invoice->is_igst)
            <table class="tax-summary-table">
                <thead><tr><th>HSN/SAC</th><th>Taxable Value</th><th>IGST Rate</th><th>IGST Amount</th><th>Total Tax</th></tr></thead>
                <tbody>
                    @foreach($invoice->items as $item)
                    @php
                        $tv = $item->unit_price * $item->qty;
                        if($item->discount_pct > 0) $tv = $tv - ($tv * $item->discount_pct / 100);
                        $irate = ($item->igst > 0 && $tv > 0) ? round($item->igst / $tv * 100, 1) : 0;
                    @endphp
                    <tr>
                        <td>{{ $item->hsn_sac ?? '-' }}</td>
                        <td>{{ number_format($tv, 2) }}</td>
                        <td>{{ $irate }}%</td>
                        <td>{{ number_format($item->igst, 2) }}</td>
                        <td>{{ number_format($item->igst, 2) }}</td>
                    </tr>
                    @endforeach
                    <tr style="background:#e8e8e8; font-weight:bold;">
                        <td>Total</td>
                        <td>{{ number_format($invoice->subtotal - $invoice->discount, 2) }}</td>
                        <td>-</td>
                        <td>{{ number_format($invoice->items->sum('igst'), 2) }}</td>
                        <td>{{ number_format($invoice->tax_amount, 2) }}</td>
                    </tr>
                </tbody>
            </table>
            @else
            <table class="tax-summary-table">
                <thead><tr><th>HSN/SAC</th><th>Taxable Value</th><th>CGST %</th><th>CGST Amt</th><th>SGST %</th><th>SGST Amt</th><th>Total Tax</th></tr></thead>
                <tbody>
                    @foreach($invoice->items as $item)
                    @php
                        $tv = $item->unit_price * $item->qty;
                        if($item->discount_pct > 0) $tv = $tv - ($tv * $item->discount_pct / 100);
                        $crate = ($item->cgst > 0 && $tv > 0) ? round($item->cgst / $tv * 100, 1) : 0;
                        $srate = ($item->sgst > 0 && $tv > 0) ? round($item->sgst / $tv * 100, 1) : 0;
                    @endphp
                    <tr>
                        <td>{{ $item->hsn_sac ?? '-' }}</td>
                        <td>{{ number_format($tv, 2) }}</td>
                        <td>{{ $crate }}%</td>
                        <td>{{ number_format($item->cgst, 2) }}</td>
                        <td>{{ $srate }}%</td>
                        <td>{{ number_format($item->sgst, 2) }}</td>
                        <td>{{ number_format($item->cgst + $item->sgst, 2) }}</td>
                    </tr>
                    @endforeach
                    <tr style="background:#e8e8e8; font-weight:bold;">
                        <td>Total</td>
                        <td>{{ number_format($invoice->subtotal - $invoice->discount, 2) }}</td>
                        <td>-</td>
                        <td>{{ number_format($invoice->items->sum('cgst'), 2) }}</td>
                        <td>-</td>
                        <td>{{ number_format($invoice->items->sum('sgst'), 2) }}</td>
                        <td>{{ number_format($invoice->tax_amount, 2) }}</td>
                    </tr>
                </tbody>
            </table>
            @endif
        </div>
        <div class="totals-col-right">
            <table class="totals-right-table">
                <tr><td class="tlabel">Subtotal</td><td class="tvalue">&#8377;{{ number_format($invoice->subtotal, 2) }}</td></tr>
                @if($invoice->discount > 0)
                <tr><td class="tlabel">Discount</td><td class="tvalue">-&#8377;{{ number_format($invoice->discount, 2) }}</td></tr>
                @endif
                @if($invoice->is_igst)
                <tr><td class="tlabel">IGST</td><td class="tvalue">&#8377;{{ number_format($invoice->items->sum('igst'), 2) }}</td></tr>
                @else
                <tr><td class="tlabel">CGST</td><td class="tvalue">&#8377;{{ number_format($invoice->items->sum('cgst'), 2) }}</td></tr>
                <tr><td class="tlabel">SGST</td><td class="tvalue">&#8377;{{ number_format($invoice->items->sum('sgst'), 2) }}</td></tr>
                @endif
                @if($invoice->tcs_amount > 0)
                <tr><td class="tlabel">TCS @ {{ $invoice->tcs_rate }}%</td><td class="tvalue">&#8377;{{ number_format($invoice->tcs_amount, 2) }}</td></tr>
                @endif
                <tr class="grand-total-row"><td class="tlabel" style="color:#fff;">Grand Total</td><td class="tvalue" style="color:#fff;">&#8377;{{ number_format($invoice->total, 2) }}</td></tr>
                @if($invoice->amount_paid > 0)
                <tr><td class="tlabel">Amount Paid</td><td class="tvalue" style="color:#27ae60;">&#8377;{{ number_format($invoice->amount_paid, 2) }}</td></tr>
                <tr><td class="tlabel">Balance Due</td><td class="tvalue" style="color:#c0392b; font-weight:bold;">&#8377;{{ number_format($invoice->balance, 2) }}</td></tr>
                @endif
            </table>
        </div>
    </div>

    <div class="sig-block">
        <div class="notes-part">
            @if($invoice->notes)
            <div style="margin-bottom:8px;"><strong style="font-size:9px;">Notes:</strong><br><span style="font-size:9px; color:#555;">{{ $invoice->notes }}</span></div>
            @endif
            @if($setting?->terms_and_conditions)
            <div><strong style="font-size:9px;">Terms &amp; Conditions:</strong><br><span style="font-size:8px; color:#777;">{{ $setting->terms_and_conditions }}</span></div>
            @endif
            @if($setting?->invoice_footer_notes)
            <div style="margin-top:8px; font-size:9px; color:#888;">{{ $setting->invoice_footer_notes }}</div>
            @endif
        </div>
        <div class="sig-part">
            <div style="font-size:9px; color:#555; margin-bottom:8px;">For <strong>{{ $setting?->tenant?->name ?? 'Company' }}</strong></div>
            @if($setting?->e_signature_path)
            <img src="{{ public_path('storage/' . $setting->e_signature_path) }}" alt="Signature">
            @else
            <div style="height:40px;"></div>
            @endif
            <div class="sig-line-div">Authorised Signatory</div>
        </div>
    </div>
</div>

</body>
</html>
