<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DejaVu Sans', sans-serif; font-size: 10px; color: #0c1a2e; background: #fff; }

    .header { background: #0891b2; padding: 0; }
    .header-inner { padding: 20px 28px; display: flex; justify-content: space-between; align-items: flex-start; }
    .clinic-brand img { max-height: 50px; display: block; margin-bottom: 7px; }
    .clinic-name { font-size: 20px; font-weight: bold; color: #fff; letter-spacing: 0.5px; }
    .clinic-type { font-size: 9px; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 2px; margin-top: 2px; }
    .clinic-info { font-size: 9px; color: rgba(255,255,255,0.75); margin-top: 4px; }

    .inv-side { text-align: right; }
    .inv-cross { font-size: 30px; color: rgba(255,255,255,0.2); line-height: 1; }
    .inv-doc-label { font-size: 8px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.6); margin-top: 4px; }
    .inv-doc-type { font-size: 18px; font-weight: bold; color: #fff; margin-top: 2px; }
    .inv-number { font-size: 12px; color: #a5f3fc; margin-top: 3px; font-weight: bold; }
    .inv-date { font-size: 9px; color: rgba(255,255,255,0.7); margin-top: 2px; }

    .cyan-strip { height: 4px; background: linear-gradient(to right, #0e7490, #06b6d4, #67e8f9); }
    .light-strip { height: 2px; background: #e0f2fe; }

    .patient-section { background: #f0f9ff; border-bottom: 1px solid #bae6fd; display: flex; }
    .patient-col { flex: 1; padding: 12px 16px; border-right: 1px solid #bae6fd; }
    .patient-col:last-child { border-right: none; }
    .pc-head { font-size: 8px; text-transform: uppercase; letter-spacing: 1.5px; color: #0891b2; margin-bottom: 5px; font-weight: bold; }
    .pc-name { font-size: 13px; font-weight: bold; color: #0c1a2e; }
    .pc-gstin { font-size: 9px; color: #0891b2; font-weight: bold; margin-top: 2px; }
    .pc-detail { font-size: 9px; color: #374151; margin-top: 1px; }

    .inv-info-row { background: #0e7490; display: flex; justify-content: space-around; padding: 7px 16px; }
    .iir-item { text-align: center; }
    .iir-label { font-size: 7px; text-transform: uppercase; letter-spacing: 1px; color: #a5f3fc; display: block; }
    .iir-val { font-size: 10px; color: #fff; font-weight: bold; }

    .body { padding: 16px 20px; }

    .section-label { font-size: 8px; text-transform: uppercase; letter-spacing: 1.5px; color: #0891b2; border-bottom: 2px solid #0891b2; padding-bottom: 3px; margin-bottom: 10px; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
    thead th { background: #0891b2; color: #fff; padding: 7px 7px; text-align: left; font-size: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    tbody tr { border-bottom: 1px solid #e0f2fe; }
    tbody tr:nth-child(even) td { background: #f0f9ff; }
    tbody td { padding: 7px; font-size: 9px; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .item-name { font-weight: bold; color: #0c1a2e; font-size: 10px; }
    .item-desc { font-size: 8px; color: #6b7280; margin-top: 1px; }
    .item-badge { display: inline-block; font-size: 7px; background: #e0f2fe; color: #0891b2; padding: 1px 5px; border-radius: 3px; margin-top: 2px; }

    .bottom-layout { display: flex; justify-content: space-between; gap: 15px; }
    .left-col { flex: 1; }
    .right-col { width: 260px; }

    .info-panel { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 5px; padding: 10px 12px; margin-bottom: 10px; }
    .ip-title { font-size: 8px; text-transform: uppercase; letter-spacing: 1px; color: #0891b2; margin-bottom: 5px; font-weight: bold; }
    .ip-body { font-size: 9px; color: #374151; line-height: 1.5; }

    .totals-panel { border: 1px solid #bae6fd; border-radius: 6px; overflow: hidden; }
    .tp-header { background: #0891b2; color: #fff; padding: 6px 12px; font-size: 9px; text-align: center; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
    .tp-row { display: flex; justify-content: space-between; padding: 5px 12px; border-bottom: 1px solid #e0f2fe; font-size: 9px; }
    .tp-row:last-child { border-bottom: none; }
    .tp-label { color: #374151; }
    .tp-value { font-weight: bold; color: #0c1a2e; }
    .tp-total { background: #0e7490; }
    .tp-total .tp-label, .tp-total .tp-value { color: #fff; font-size: 12px; font-weight: bold; }
    .tp-balance .tp-label, .tp-balance .tp-value { color: #dc2626; font-weight: bold; }
    .tp-paid .tp-value { color: #059669; }
    .tp-discount .tp-value { color: #f59e0b; }

    .footer { margin-top: 18px; border-top: 2px solid #0891b2; padding-top: 12px; display: flex; justify-content: space-between; align-items: flex-end; }
    .footer-note { font-size: 8px; color: #6b7280; }
    .footer-note .fn-brand { color: #0891b2; font-weight: bold; font-size: 9px; }
    .sig-box { text-align: center; }
    .sig-box img { max-height: 35px; display: block; margin: 0 auto 4px; }
    .sig-box .sl { font-size: 8px; color: #6b7280; border-top: 1px solid #bae6fd; padding-top: 3px; }
</style>
</head>
<body>

<div class="header">
    <div class="header-inner">
        <div class="clinic-brand">
            @if($setting?->logo)
            <img src="{{ public_path('storage/' . $setting->logo) }}" alt="Logo">
            @endif
            <div class="clinic-name">{{ $setting?->tenant?->name ?? 'Medical Centre' }}</div>
            <div class="clinic-type">Healthcare &amp; Medical Services</div>
            @if($setting?->gstin)<div class="clinic-info">GSTIN: {{ $setting->gstin }}</div>@endif
            @if($setting?->address)<div class="clinic-info">{{ $setting->address }}, {{ $setting->city }}, {{ $setting->state }}</div>@endif
            @if($setting?->phone)<div class="clinic-info">Ph: {{ $setting->phone }}</div>@endif
        </div>
        <div class="inv-side">
            <div class="inv-cross">+</div>
            <div class="inv-doc-label">Invoice Type</div>
            <div class="inv-doc-type">Tax Invoice</div>
            <div class="inv-number">{{ $invoice->number }}</div>
            <div class="inv-date">{{ $invoice->date->format('d M Y') }}</div>
            @if($invoice->due_date)
            <div class="inv-date">Due: {{ $invoice->due_date->format('d M Y') }}</div>
            @endif
        </div>
    </div>
</div>
<div class="cyan-strip"></div>
<div class="light-strip"></div>

<div class="patient-section">
    <div class="patient-col">
        <div class="pc-head">Patient / Bill To</div>
        <div class="pc-name">{{ $invoice->party->name }}</div>
        @if($invoice->party->gstin)<div class="pc-gstin">GSTIN: {{ $invoice->party->gstin }}</div>@endif
        @if($invoice->party->billing_address)<div class="pc-detail">{{ $invoice->party->billing_address }}</div>@endif
        @if($invoice->party->city)<div class="pc-detail">{{ $invoice->party->city }}, {{ $invoice->party->state }}</div>@endif
        @if($invoice->party->phone)<div class="pc-detail">Ph: {{ $invoice->party->phone }}</div>@endif
    </div>
    <div class="patient-col">
        <div class="pc-head">Healthcare Provider</div>
        <div class="pc-name">{{ $setting?->tenant?->name ?? 'Medical Centre' }}</div>
        @if($setting?->gstin)<div class="pc-gstin">GSTIN: {{ $setting->gstin }}</div>@endif
        @if($setting?->address)<div class="pc-detail">{{ $setting->address }}, {{ $setting->city }}, {{ $setting->state }}</div>@endif
        @if($setting?->phone)<div class="pc-detail">Ph: {{ $setting->phone }}</div>@endif
    </div>
    <div class="patient-col">
        <div class="pc-head">Billing Details</div>
        <div class="pc-detail"><strong>Invoice No:</strong> {{ $invoice->number }}</div>
        <div class="pc-detail"><strong>Date:</strong> {{ $invoice->date->format('d M Y') }}</div>
        @if($invoice->due_date)
        <div class="pc-detail"><strong>Due:</strong> {{ $invoice->due_date->format('d M Y') }}</div>
        @endif
        @if($invoice->place_of_supply)
        <div class="pc-detail"><strong>Place of Supply:</strong> {{ $invoice->place_of_supply }}</div>
        @endif
        <div class="pc-detail"><strong>Tax:</strong> {{ $invoice->is_igst ? 'IGST' : 'CGST + SGST' }}</div>
    </div>
</div>

<div class="inv-info-row">
    <div class="iir-item"><span class="iir-label">Invoice</span><span class="iir-val">{{ $invoice->number }}</span></div>
    <div class="iir-item"><span class="iir-label">Date</span><span class="iir-val">{{ $invoice->date->format('d M Y') }}</span></div>
    @if($invoice->due_date)
    <div class="iir-item"><span class="iir-label">Due Date</span><span class="iir-val">{{ $invoice->due_date->format('d M Y') }}</span></div>
    @endif
    <div class="iir-item"><span class="iir-label">Total Amount</span><span class="iir-val">&#8377;{{ number_format($invoice->total, 2) }}</span></div>
    @if($invoice->balance > 0)
    <div class="iir-item"><span class="iir-label">Balance Due</span><span class="iir-val" style="color:#fca5a5;">&#8377;{{ number_format($invoice->balance, 2) }}</span></div>
    @else
    <div class="iir-item"><span class="iir-label">Status</span><span class="iir-val" style="color:#6ee7b7;">PAID</span></div>
    @endif
</div>

<div class="body">
    <div class="section-label">Services / Medicines / Procedures</div>
    <table>
        <thead>
            <tr>
                <th style="width:4%">#</th>
                <th style="width:29%">Description</th>
                <th style="width:9%">HSN/SAC</th>
                <th class="text-right" style="width:6%">Qty</th>
                <th class="text-right" style="width:9%">Rate (&#8377;)</th>
                <th class="text-right" style="width:7%">Disc%</th>
                @if($invoice->is_igst)
                <th class="text-right" style="width:10%">IGST (&#8377;)</th>
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
                <td class="text-center" style="color:#0891b2; font-weight:bold;">{{ $idx + 1 }}</td>
                <td>
                    <div class="item-name">{{ $item->item?->name ?? $item->description }}</div>
                    @if($item->item?->name && $item->description)
                    <div class="item-desc">{{ $item->description }}</div>
                    @endif
                    <div><span class="item-badge">Medical</span></div>
                </td>
                <td class="text-center" style="color:#0891b2;">{{ $item->hsn_sac ?? '-' }}</td>
                <td class="text-right">{{ $item->qty }}</td>
                <td class="text-right">{{ number_format($item->unit_price, 2) }}</td>
                <td class="text-right" style="color:#f59e0b;">{{ $item->discount_pct > 0 ? $item->discount_pct . '%' : '-' }}</td>
                @if($invoice->is_igst)
                <td class="text-right">{{ $item->igst > 0 ? number_format($item->igst, 2) : '-' }}</td>
                @else
                <td class="text-right">{{ $item->cgst > 0 ? number_format($item->cgst, 2) : '-' }}</td>
                <td class="text-right">{{ $item->sgst > 0 ? number_format($item->sgst, 2) : '-' }}</td>
                @endif
                <td class="text-right"><strong style="color:#0e7490;">&#8377;{{ number_format($item->amount, 2) }}</strong></td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="bottom-layout">
        <div class="left-col">
            @if($invoice->notes)
            <div class="info-panel">
                <div class="ip-title">Clinical Notes / Remarks</div>
                <div class="ip-body">{{ $invoice->notes }}</div>
            </div>
            @endif
            @if($setting?->terms_and_conditions)
            <div class="info-panel">
                <div class="ip-title">Terms &amp; Conditions</div>
                <div class="ip-body">{{ $setting->terms_and_conditions }}</div>
            </div>
            @endif
            <div class="info-panel">
                <div class="ip-title">Important Notice</div>
                <div class="ip-body">This invoice is for medical services/goods provided. Please retain for insurance claims and records. All services are subject to applicable GST.</div>
            </div>
        </div>
        <div class="right-col">
            <div class="totals-panel">
                <div class="tp-header">Bill Summary</div>
                <div class="tp-row"><span class="tp-label">Subtotal</span><span class="tp-value">&#8377;{{ number_format($invoice->subtotal, 2) }}</span></div>
                @if($invoice->discount > 0)
                <div class="tp-row tp-discount"><span class="tp-label">Discount</span><span class="tp-value">-&#8377;{{ number_format($invoice->discount, 2) }}</span></div>
                @endif
                @if($invoice->is_igst)
                <div class="tp-row"><span class="tp-label">IGST</span><span class="tp-value">&#8377;{{ number_format($invoice->items->sum('igst'), 2) }}</span></div>
                @else
                <div class="tp-row"><span class="tp-label">CGST</span><span class="tp-value">&#8377;{{ number_format($invoice->items->sum('cgst'), 2) }}</span></div>
                <div class="tp-row"><span class="tp-label">SGST</span><span class="tp-value">&#8377;{{ number_format($invoice->items->sum('sgst'), 2) }}</span></div>
                @endif
                @if($invoice->tcs_amount > 0)
                <div class="tp-row"><span class="tp-label">TCS ({{ $invoice->tcs_rate }}%)</span><span class="tp-value">&#8377;{{ number_format($invoice->tcs_amount, 2) }}</span></div>
                @endif
                <div class="tp-row tp-total"><span class="tp-label">TOTAL</span><span class="tp-value">&#8377;{{ number_format($invoice->total, 2) }}</span></div>
                @if($invoice->amount_paid > 0)
                <div class="tp-row tp-paid"><span class="tp-label">Paid</span><span class="tp-value">&#8377;{{ number_format($invoice->amount_paid, 2) }}</span></div>
                <div class="tp-row tp-balance"><span class="tp-label">Balance</span><span class="tp-value">&#8377;{{ number_format($invoice->balance, 2) }}</span></div>
                @endif
            </div>
        </div>
    </div>

    <div class="footer">
        <div class="footer-note">
            <div class="fn-brand">{{ $setting?->tenant?->name ?? 'Medical Centre' }}</div>
            @if($setting?->invoice_footer_notes)
            <div>{{ $setting->invoice_footer_notes }}</div>
            @else
            <div>Computer generated invoice. Get well soon.</div>
            @endif
        </div>
        <div class="sig-box">
            @if($setting?->e_signature_path)
            <img src="{{ public_path('storage/' . $setting->e_signature_path) }}" alt="Signature">
            @else
            <div style="height:32px;"></div>
            @endif
            <div class="sl">Authorised Signatory</div>
        </div>
    </div>
</div>

</body>
</html>
