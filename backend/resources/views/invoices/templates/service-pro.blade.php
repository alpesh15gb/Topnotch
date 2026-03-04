<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DejaVu Sans', sans-serif; font-size: 11px; color: #1f2937; background: #fff; }

    .header { padding: 0; }
    .header-top { background: #0d9488; padding: 24px 32px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand-area img { max-height: 50px; display: block; margin-bottom: 7px; }
    .brand-name { font-size: 20px; font-weight: bold; color: #fff; }
    .brand-gstin { font-size: 9px; color: rgba(255,255,255,0.75); margin-top: 2px; }
    .brand-address { font-size: 9px; color: rgba(255,255,255,0.65); margin-top: 2px; }

    .invoice-meta-right { text-align: right; }
    .inv-doc-type { font-size: 9px; text-transform: uppercase; letter-spacing: 3px; color: rgba(255,255,255,0.6); }
    .inv-number-big { font-size: 24px; font-weight: bold; color: #fff; margin-top: 3px; }
    .inv-date-info { font-size: 10px; color: rgba(255,255,255,0.75); margin-top: 5px; }

    .teal-accent-strip { height: 5px; background: #0f766e; }
    .white-accent-strip { height: 3px; background: #99f6e4; }

    .parties-row { display: flex; background: #f0fdfa; border-bottom: 1px solid #99f6e4; }
    .party-block { flex: 1; padding: 14px 20px; }
    .party-block:first-child { border-right: 1px solid #99f6e4; }
    .pb-title { font-size: 8px; text-transform: uppercase; letter-spacing: 1.5px; color: #0d9488; margin-bottom: 6px; font-weight: bold; }
    .pb-name { font-size: 13px; font-weight: bold; color: #134e4a; }
    .pb-info { font-size: 9px; color: #374151; margin-top: 2px; }
    .pb-gstin { font-size: 9px; color: #0d9488; font-weight: bold; margin-top: 3px; }

    .invoice-details-bar { background: #134e4a; display: flex; justify-content: space-between; padding: 8px 20px; }
    .idb-item { text-align: center; }
    .idb-label { font-size: 7px; text-transform: uppercase; letter-spacing: 1px; color: #99f6e4; display: block; }
    .idb-value { font-size: 10px; color: #fff; font-weight: bold; }

    .body { padding: 18px 20px; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
    thead th { background: #0d9488; color: #fff; padding: 8px 7px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
    tbody tr { border-bottom: 1px solid #e5e7eb; }
    tbody tr:nth-child(even) td { background: #f0fdfa; }
    tbody td { padding: 8px 7px; font-size: 10px; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .item-name { font-weight: bold; color: #134e4a; }
    .item-desc { font-size: 9px; color: #6b7280; margin-top: 1px; }
    .service-badge { display: inline-block; background: #ccfbf1; color: #0f766e; font-size: 8px; padding: 1px 5px; border-radius: 2px; margin-top: 2px; }

    .bottom-section { display: flex; justify-content: space-between; gap: 15px; }
    .notes-part { flex: 1; }
    .totals-part { width: 270px; }

    .info-card { background: #f0fdfa; border-left: 3px solid #0d9488; border-radius: 4px; padding: 10px 12px; margin-bottom: 10px; }
    .ic-title { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #0d9488; margin-bottom: 4px; }
    .ic-body { font-size: 9px; color: #374151; line-height: 1.5; }

    .totals-card { border: 1px solid #99f6e4; border-radius: 6px; overflow: hidden; }
    .tc-header { background: #0d9488; color: #fff; padding: 7px 12px; font-size: 10px; font-weight: bold; text-align: center; }
    .tc-row { display: flex; justify-content: space-between; padding: 5px 12px; border-bottom: 1px solid #e5e7eb; font-size: 10px; }
    .tc-row:last-child { border-bottom: none; }
    .tc-label { color: #374151; }
    .tc-value { font-weight: bold; color: #134e4a; }
    .tc-total { background: #134e4a; }
    .tc-total .tc-label, .tc-total .tc-value { color: #fff; font-size: 12px; }
    .tc-balance { background: #fef2f2; }
    .tc-balance .tc-label, .tc-balance .tc-value { color: #ef4444; font-weight: bold; }
    .tc-paid .tc-value { color: #059669; }
    .tc-discount .tc-value { color: #f59e0b; }

    .footer { margin-top: 20px; border-top: 2px solid #0d9488; padding-top: 12px; display: flex; justify-content: space-between; align-items: flex-end; }
    .footer-brand { font-size: 9px; color: #6b7280; }
    .footer-brand strong { color: #0d9488; }
    .sig-zone { text-align: center; }
    .sig-zone img { max-height: 38px; display: block; margin: 0 auto 4px; }
    .sig-zone .sz-label { font-size: 9px; color: #6b7280; border-top: 1px solid #99f6e4; padding-top: 4px; }
</style>
</head>
<body>

<div class="header">
    <div class="header-top">
        <div class="brand-area">
            @if($setting?->logo)
            <img src="{{ public_path('storage/' . $setting->logo) }}" alt="Logo">
            @endif
            <div class="brand-name">{{ $setting?->tenant?->name ?? 'Service Pro' }}</div>
            @if($setting?->gstin)<div class="brand-gstin">GSTIN: {{ $setting->gstin }}</div>@endif
            @if($setting?->address)<div class="brand-address">{{ $setting->address }}, {{ $setting->city }}, {{ $setting->state }}</div>@endif
            @if($setting?->phone)<div class="brand-address">Ph: {{ $setting->phone }}</div>@endif
        </div>
        <div class="invoice-meta-right">
            <div class="inv-doc-type">Tax Invoice</div>
            <div class="inv-number-big">{{ $invoice->number }}</div>
            <div class="inv-date-info">Dated: {{ $invoice->date->format('d M Y') }}</div>
            @if($invoice->due_date)
            <div class="inv-date-info">Due: {{ $invoice->due_date->format('d M Y') }}</div>
            @endif
        </div>
    </div>
    <div class="teal-accent-strip"></div>
    <div class="white-accent-strip"></div>
</div>

<div class="parties-row">
    <div class="party-block">
        <div class="pb-title">Client Information</div>
        <div class="pb-name">{{ $invoice->party->name }}</div>
        @if($invoice->party->gstin)<div class="pb-gstin">GSTIN: {{ $invoice->party->gstin }}</div>@endif
        @if($invoice->party->billing_address)<div class="pb-info">{{ $invoice->party->billing_address }}</div>@endif
        @if($invoice->party->city)<div class="pb-info">{{ $invoice->party->city }}, {{ $invoice->party->state }}</div>@endif
        @if($invoice->party->phone)<div class="pb-info">Ph: {{ $invoice->party->phone }}</div>@endif
    </div>
    <div class="party-block">
        <div class="pb-title">Service Provider</div>
        <div class="pb-name">{{ $setting?->tenant?->name ?? 'Company' }}</div>
        @if($setting?->gstin)<div class="pb-gstin">GSTIN: {{ $setting->gstin }}</div>@endif
        @if($setting?->address)<div class="pb-info">{{ $setting->address }}, {{ $setting->city }}, {{ $setting->state }}</div>@endif
        @if($setting?->phone)<div class="pb-info">Ph: {{ $setting->phone }}</div>@endif
    </div>
</div>

<div class="invoice-details-bar">
    <div class="idb-item"><span class="idb-label">Invoice No</span><span class="idb-value">{{ $invoice->number }}</span></div>
    <div class="idb-item"><span class="idb-label">Invoice Date</span><span class="idb-value">{{ $invoice->date->format('d M Y') }}</span></div>
    @if($invoice->due_date)
    <div class="idb-item"><span class="idb-label">Due Date</span><span class="idb-value">{{ $invoice->due_date->format('d M Y') }}</span></div>
    @endif
    @if($invoice->place_of_supply)
    <div class="idb-item"><span class="idb-label">Place of Supply</span><span class="idb-value">{{ $invoice->place_of_supply }}</span></div>
    @endif
    <div class="idb-item"><span class="idb-label">Tax Regime</span><span class="idb-value">{{ $invoice->is_igst ? 'IGST' : 'CGST+SGST' }}</span></div>
    <div class="idb-item"><span class="idb-label">Total</span><span class="idb-value">&#8377;{{ number_format($invoice->total, 2) }}</span></div>
</div>

<div class="body">
    <table>
        <thead>
            <tr>
                <th style="width:4%">#</th>
                <th style="width:30%">Service Description</th>
                <th style="width:8%">HSN/SAC</th>
                <th class="text-right" style="width:6%">Qty</th>
                <th class="text-right" style="width:9%">Rate (&#8377;)</th>
                <th class="text-right" style="width:7%">Disc%</th>
                @if($invoice->is_igst)
                <th class="text-right" style="width:9%">IGST (&#8377;)</th>
                @else
                <th class="text-right" style="width:9%">CGST (&#8377;)</th>
                <th class="text-right" style="width:9%">SGST (&#8377;)</th>
                @endif
                <th class="text-right" style="width:10%">Amount (&#8377;)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $idx => $item)
            <tr>
                <td class="text-center" style="color:#0d9488; font-weight:bold;">{{ $idx + 1 }}</td>
                <td>
                    <div class="item-name">{{ $item->item?->name ?? $item->description }}</div>
                    @if($item->item?->name && $item->description)
                    <div class="item-desc">{{ $item->description }}</div>
                    @endif
                    <div><span class="service-badge">Service</span></div>
                </td>
                <td class="text-center" style="color:#0d9488;">{{ $item->hsn_sac ?? '-' }}</td>
                <td class="text-right">{{ $item->qty }}</td>
                <td class="text-right">{{ number_format($item->unit_price, 2) }}</td>
                <td class="text-right" style="color:#f59e0b;">{{ $item->discount_pct > 0 ? $item->discount_pct . '%' : '-' }}</td>
                @if($invoice->is_igst)
                <td class="text-right">{{ $item->igst > 0 ? number_format($item->igst, 2) : '-' }}</td>
                @else
                <td class="text-right">{{ $item->cgst > 0 ? number_format($item->cgst, 2) : '-' }}</td>
                <td class="text-right">{{ $item->sgst > 0 ? number_format($item->sgst, 2) : '-' }}</td>
                @endif
                <td class="text-right"><strong style="color:#134e4a;">&#8377;{{ number_format($item->amount, 2) }}</strong></td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="bottom-section">
        <div class="notes-part">
            @if($invoice->notes)
            <div class="info-card">
                <div class="ic-title">Notes</div>
                <div class="ic-body">{{ $invoice->notes }}</div>
            </div>
            @endif
            @if($setting?->terms_and_conditions)
            <div class="info-card">
                <div class="ic-title">Terms &amp; Conditions</div>
                <div class="ic-body" style="font-size:8px; color:#6b7280;">{{ $setting->terms_and_conditions }}</div>
            </div>
            @endif
        </div>
        <div class="totals-part">
            <div class="totals-card">
                <div class="tc-header">Invoice Summary</div>
                <div class="tc-row"><span class="tc-label">Subtotal</span><span class="tc-value">&#8377;{{ number_format($invoice->subtotal, 2) }}</span></div>
                @if($invoice->discount > 0)
                <div class="tc-row tc-discount"><span class="tc-label">Discount</span><span class="tc-value">-&#8377;{{ number_format($invoice->discount, 2) }}</span></div>
                @endif
                @if($invoice->is_igst)
                <div class="tc-row"><span class="tc-label">IGST</span><span class="tc-value">&#8377;{{ number_format($invoice->items->sum('igst'), 2) }}</span></div>
                @else
                <div class="tc-row"><span class="tc-label">CGST</span><span class="tc-value">&#8377;{{ number_format($invoice->items->sum('cgst'), 2) }}</span></div>
                <div class="tc-row"><span class="tc-label">SGST</span><span class="tc-value">&#8377;{{ number_format($invoice->items->sum('sgst'), 2) }}</span></div>
                @endif
                @if($invoice->tcs_amount > 0)
                <div class="tc-row"><span class="tc-label">TCS ({{ $invoice->tcs_rate }}%)</span><span class="tc-value">&#8377;{{ number_format($invoice->tcs_amount, 2) }}</span></div>
                @endif
                <div class="tc-row tc-total"><span class="tc-label">Grand Total</span><span class="tc-value">&#8377;{{ number_format($invoice->total, 2) }}</span></div>
                @if($invoice->amount_paid > 0)
                <div class="tc-row tc-paid"><span class="tc-label">Amount Paid</span><span class="tc-value">&#8377;{{ number_format($invoice->amount_paid, 2) }}</span></div>
                <div class="tc-row tc-balance"><span class="tc-label">Balance Due</span><span class="tc-value">&#8377;{{ number_format($invoice->balance, 2) }}</span></div>
                @endif
            </div>
        </div>
    </div>

    <div class="footer">
        <div class="footer-brand">
            @if($setting?->invoice_footer_notes)
            <div>{{ $setting->invoice_footer_notes }}</div>
            @else
            <div>This is a computer generated invoice. No signature required.</div>
            @endif
            <div style="margin-top:3px; color:#0d9488;">Thank you for choosing <strong>{{ $setting?->tenant?->name ?? 'us' }}</strong>!</div>
        </div>
        <div class="sig-zone">
            @if($setting?->e_signature_path)
            <img src="{{ public_path('storage/' . $setting->e_signature_path) }}" alt="Signature">
            @else
            <div style="height:35px;"></div>
            @endif
            <div class="sz-label">Authorised Signatory</div>
        </div>
    </div>
</div>

</body>
</html>
