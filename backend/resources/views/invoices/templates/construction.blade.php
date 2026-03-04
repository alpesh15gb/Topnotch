<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DejaVu Sans', sans-serif; font-size: 10px; color: #1c1917; background: #fff; }

    .hazard-strip { height: 10px; background: repeating-linear-gradient(45deg, #d97706 0px, #d97706 12px, #1c1917 12px, #1c1917 24px); }

    .header { background: #1c1917; padding: 18px 28px; display: flex; justify-content: space-between; align-items: center; }
    .company-left img { max-height: 48px; display: block; margin-bottom: 6px; }
    .company-name { font-size: 22px; font-weight: bold; color: #d97706; text-transform: uppercase; letter-spacing: 2px; }
    .company-sub { font-size: 9px; color: #a8a29e; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
    .company-info { font-size: 9px; color: #a8a29e; margin-top: 4px; }

    .invoice-right { text-align: right; }
    .inv-badge { display: inline-block; background: #d97706; color: #1c1917; font-size: 11px; font-weight: bold; padding: 4px 14px; text-transform: uppercase; letter-spacing: 2px; }
    .inv-number { font-size: 18px; font-weight: bold; color: #fff; margin-top: 5px; }
    .inv-date { font-size: 9px; color: #a8a29e; margin-top: 3px; }

    .hazard-strip-thin { height: 4px; background: repeating-linear-gradient(45deg, #d97706 0px, #d97706 8px, #1c1917 8px, #1c1917 16px); }

    .project-info { background: #292524; display: flex; justify-content: space-around; padding: 8px 20px; }
    .pi-item { text-align: center; }
    .pi-label { font-size: 7px; text-transform: uppercase; letter-spacing: 1px; color: #a8a29e; display: block; }
    .pi-value { font-size: 10px; font-weight: bold; color: #fef3c7; }

    .parties-row { display: flex; border: 2px solid #d97706; border-top: none; }
    .party-block { flex: 1; padding: 12px 15px; }
    .party-block:first-child { border-right: 2px solid #d97706; }
    .pb-heading { font-size: 8px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #d97706; border-bottom: 1px solid #d97706; padding-bottom: 4px; margin-bottom: 6px; }
    .pb-name { font-size: 13px; font-weight: bold; color: #1c1917; text-transform: uppercase; }
    .pb-gstin { font-size: 9px; color: #d97706; font-weight: bold; margin-top: 2px; }
    .pb-info { font-size: 9px; color: #44403c; margin-top: 1px; }

    .body { padding: 0; }

    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #292524; }
    thead th { color: #d97706; padding: 8px 7px; text-align: left; font-size: 8px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: bold; border-right: 1px solid #44403c; }
    thead th:last-child { border-right: none; }
    tbody tr { border-bottom: 1px solid #e7e5e4; }
    tbody tr:nth-child(even) td { background: #fafaf9; }
    tbody td { padding: 8px 7px; font-size: 9px; border-right: 1px solid #e7e5e4; }
    tbody td:last-child { border-right: none; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .item-name { font-weight: bold; color: #1c1917; font-size: 10px; text-transform: uppercase; }
    .item-desc { font-size: 8px; color: #78716c; margin-top: 1px; }
    .material-tag { display: inline-block; background: #fef3c7; color: #92400e; font-size: 7px; padding: 1px 4px; border-radius: 2px; margin-top: 1px; font-weight: bold; }
    .labor-tag { display: inline-block; background: #dcfce7; color: #15803d; font-size: 7px; padding: 1px 4px; border-radius: 2px; margin-top: 1px; font-weight: bold; }

    .totals-area { border-top: 3px solid #d97706; display: flex; }
    .remarks-section { flex: 1; padding: 14px 18px; border-right: 2px solid #d97706; }
    .rs-heading { font-size: 8px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #d97706; border-bottom: 1px solid #d97706; padding-bottom: 4px; margin-bottom: 8px; }
    .rs-text { font-size: 9px; color: #44403c; line-height: 1.5; }

    .totals-section { width: 280px; }
    .tt-row { display: flex; justify-content: space-between; padding: 6px 14px; border-bottom: 1px solid #e7e5e4; font-size: 9px; }
    .tt-row:last-child { border-bottom: none; }
    .tt-label { color: #44403c; text-transform: uppercase; font-size: 8px; letter-spacing: 0.5px; }
    .tt-value { font-weight: bold; color: #1c1917; }
    .tt-grand { background: #d97706; }
    .tt-grand .tt-label { color: #1c1917; font-size: 11px; font-weight: bold; }
    .tt-grand .tt-value { color: #1c1917; font-size: 13px; }
    .tt-balance .tt-label, .tt-balance .tt-value { color: #dc2626; font-weight: bold; }
    .tt-paid .tt-value { color: #16a34a; }
    .tt-discount .tt-value { color: #d97706; }

    .footer { background: #292524; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; }
    .footer-note { font-size: 8px; color: #a8a29e; }
    .sig-area { text-align: center; }
    .sig-area img { max-height: 32px; display: block; margin: 0 auto 3px; }
    .sig-area .sl { font-size: 8px; color: #a8a29e; border-top: 1px solid #44403c; padding-top: 3px; text-transform: uppercase; letter-spacing: 1px; }

    .hazard-bottom { height: 8px; background: repeating-linear-gradient(45deg, #d97706 0px, #d97706 10px, #1c1917 10px, #1c1917 20px); }
</style>
</head>
<body>

<div class="hazard-strip"></div>

<div class="header">
    <div class="company-left">
        @if($setting?->logo)
        <img src="{{ public_path('storage/' . $setting->logo) }}" alt="Logo">
        @endif
        <div class="company-name">{{ $setting?->tenant?->name ?? 'Construction Co.' }}</div>
        <div class="company-sub">Builders &amp; Contractors</div>
        <div class="company-info">
            @if($setting?->gstin)GSTIN: {{ $setting->gstin }}<br>@endif
            @if($setting?->address){{ $setting->address }}, {{ $setting->city }}, {{ $setting->state }}<br>@endif
            @if($setting?->phone)Ph: {{ $setting->phone }}@endif
        </div>
    </div>
    <div class="invoice-right">
        <div class="inv-badge">Tax Invoice</div>
        <div class="inv-number">{{ $invoice->number }}</div>
        <div class="inv-date">Date: {{ $invoice->date->format('d/m/Y') }}</div>
        @if($invoice->due_date)
        <div class="inv-date">Due: {{ $invoice->due_date->format('d/m/Y') }}</div>
        @endif
    </div>
</div>

<div class="hazard-strip-thin"></div>

<div class="project-info">
    <div class="pi-item"><span class="pi-label">Invoice No</span><span class="pi-value">{{ $invoice->number }}</span></div>
    <div class="pi-item"><span class="pi-label">Invoice Date</span><span class="pi-value">{{ $invoice->date->format('d/m/Y') }}</span></div>
    @if($invoice->due_date)
    <div class="pi-item"><span class="pi-label">Due Date</span><span class="pi-value">{{ $invoice->due_date->format('d/m/Y') }}</span></div>
    @endif
    @if($invoice->place_of_supply)
    <div class="pi-item"><span class="pi-label">Project / Site</span><span class="pi-value">{{ $invoice->place_of_supply }}</span></div>
    @endif
    <div class="pi-item"><span class="pi-label">Tax Type</span><span class="pi-value">{{ $invoice->is_igst ? 'IGST' : 'CGST+SGST' }}</span></div>
    <div class="pi-item"><span class="pi-label">Grand Total</span><span class="pi-value">&#8377;{{ number_format($invoice->total, 2) }}</span></div>
</div>

<div class="parties-row">
    <div class="party-block">
        <div class="pb-heading">Client / Bill To</div>
        <div class="pb-name">{{ $invoice->party->name }}</div>
        @if($invoice->party->gstin)<div class="pb-gstin">GSTIN: {{ $invoice->party->gstin }}</div>@endif
        @if($invoice->party->billing_address)<div class="pb-info">{{ $invoice->party->billing_address }}</div>@endif
        @if($invoice->party->city)<div class="pb-info">{{ $invoice->party->city }}, {{ $invoice->party->state }}</div>@endif
        @if($invoice->party->phone)<div class="pb-info">Ph: {{ $invoice->party->phone }}</div>@endif
    </div>
    <div class="party-block">
        <div class="pb-heading">Contractor / From</div>
        <div class="pb-name">{{ $setting?->tenant?->name ?? 'Contractor' }}</div>
        @if($setting?->gstin)<div class="pb-gstin">GSTIN: {{ $setting->gstin }}</div>@endif
        @if($setting?->address)<div class="pb-info">{{ $setting->address }}, {{ $setting->city }}, {{ $setting->state }}</div>@endif
        @if($setting?->phone)<div class="pb-info">Ph: {{ $setting->phone }}</div>@endif
    </div>
</div>

<div class="body">
    <table>
        <thead>
            <tr>
                <th style="width:4%">SR</th>
                <th style="width:26%">Description of Work / Material</th>
                <th style="width:8%">HSN/SAC</th>
                <th class="text-right" style="width:6%">Qty</th>
                <th style="width:6%">Unit</th>
                <th class="text-right" style="width:9%">Rate (&#8377;)</th>
                <th class="text-right" style="width:6%">Disc%</th>
                @if($invoice->is_igst)
                <th class="text-right" style="width:9%">IGST (&#8377;)</th>
                @else
                <th class="text-right" style="width:8%">CGST (&#8377;)</th>
                <th class="text-right" style="width:8%">SGST (&#8377;)</th>
                @endif
                <th class="text-right" style="width:10%">Amount (&#8377;)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $idx => $item)
            <tr>
                <td class="text-center" style="font-weight:bold;">{{ $idx + 1 }}</td>
                <td>
                    <div class="item-name">{{ $item->item?->name ?? $item->description }}</div>
                    @if($item->item?->name && $item->description)
                    <div class="item-desc">{{ $item->description }}</div>
                    @endif
                    <div>
                        @if($idx % 2 == 0)
                        <span class="material-tag">MATERIAL</span>
                        @else
                        <span class="labor-tag">LABOUR</span>
                        @endif
                    </div>
                </td>
                <td class="text-center">{{ $item->hsn_sac ?? '-' }}</td>
                <td class="text-right" style="font-weight:bold;">{{ $item->qty }}</td>
                <td class="text-center" style="color:#78716c;">Nos</td>
                <td class="text-right">{{ number_format($item->unit_price, 2) }}</td>
                <td class="text-right" style="color:#d97706;">{{ $item->discount_pct > 0 ? $item->discount_pct . '%' : '-' }}</td>
                @if($invoice->is_igst)
                <td class="text-right">{{ $item->igst > 0 ? number_format($item->igst, 2) : '-' }}</td>
                @else
                <td class="text-right">{{ $item->cgst > 0 ? number_format($item->cgst, 2) : '-' }}</td>
                <td class="text-right">{{ $item->sgst > 0 ? number_format($item->sgst, 2) : '-' }}</td>
                @endif
                <td class="text-right"><strong>&#8377;{{ number_format($item->amount, 2) }}</strong></td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>

<div class="totals-area">
    <div class="remarks-section">
        @if($invoice->notes)
        <div class="rs-heading">Site / Work Notes</div>
        <div class="rs-text" style="margin-bottom:10px;">{{ $invoice->notes }}</div>
        @endif
        @if($setting?->terms_and_conditions)
        <div class="rs-heading">Terms &amp; Conditions</div>
        <div class="rs-text">{{ $setting->terms_and_conditions }}</div>
        @endif
        @if(!$invoice->notes && !$setting?->terms_and_conditions)
        <div class="rs-heading">Work Certificate</div>
        <div class="rs-text">Work completed as per specifications and to the satisfaction of the client.</div>
        @endif
    </div>
    <div class="totals-section">
        <div class="tt-row"><span class="tt-label">Subtotal</span><span class="tt-value">&#8377;{{ number_format($invoice->subtotal, 2) }}</span></div>
        @if($invoice->discount > 0)
        <div class="tt-row tt-discount"><span class="tt-label">Discount</span><span class="tt-value">-&#8377;{{ number_format($invoice->discount, 2) }}</span></div>
        @endif
        @if($invoice->is_igst)
        <div class="tt-row"><span class="tt-label">IGST</span><span class="tt-value">&#8377;{{ number_format($invoice->items->sum('igst'), 2) }}</span></div>
        @else
        <div class="tt-row"><span class="tt-label">CGST</span><span class="tt-value">&#8377;{{ number_format($invoice->items->sum('cgst'), 2) }}</span></div>
        <div class="tt-row"><span class="tt-label">SGST</span><span class="tt-value">&#8377;{{ number_format($invoice->items->sum('sgst'), 2) }}</span></div>
        @endif
        @if($invoice->tcs_amount > 0)
        <div class="tt-row"><span class="tt-label">TCS ({{ $invoice->tcs_rate }}%)</span><span class="tt-value">&#8377;{{ number_format($invoice->tcs_amount, 2) }}</span></div>
        @endif
        <div class="tt-row tt-grand"><span class="tt-label">GRAND TOTAL</span><span class="tt-value">&#8377;{{ number_format($invoice->total, 2) }}</span></div>
        @if($invoice->amount_paid > 0)
        <div class="tt-row tt-paid"><span class="tt-label">Amount Paid</span><span class="tt-value">&#8377;{{ number_format($invoice->amount_paid, 2) }}</span></div>
        <div class="tt-row tt-balance"><span class="tt-label">Balance Due</span><span class="tt-value">&#8377;{{ number_format($invoice->balance, 2) }}</span></div>
        @endif
    </div>
</div>

<div class="footer">
    <div class="footer-note">
        @if($setting?->invoice_footer_notes)
        {{ $setting->invoice_footer_notes }}
        @else
        Computer generated invoice. Subject to our standard terms and conditions.
        @endif
    </div>
    <div class="sig-area">
        @if($setting?->e_signature_path)
        <img src="{{ public_path('storage/' . $setting->e_signature_path) }}" alt="Signature">
        @else
        <div style="height:28px;"></div>
        @endif
        <div class="sl">Authorised Signatory</div>
    </div>
</div>

<div class="hazard-bottom"></div>

</body>
</html>
