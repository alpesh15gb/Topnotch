<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DejaVu Sans', sans-serif; font-size: 11px; color: #1c1917; background: #fff; }

    .top-strip { height: 8px; background: #f97316; }

    .header { padding: 25px 35px 20px; display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #fed7aa; background: #fff7ed; }
    .brand-col img { max-height: 52px; display: block; margin-bottom: 8px; }
    .agency-name { font-size: 24px; font-weight: bold; color: #c2410c; letter-spacing: -0.5px; }
    .agency-sub { font-size: 9px; color: #92400e; margin-top: 2px; text-transform: uppercase; letter-spacing: 1px; }
    .agency-contact { font-size: 9px; color: #57534e; margin-top: 5px; }

    .doc-col { text-align: right; }
    .doc-pill { display: inline-block; background: #f97316; color: #fff; font-size: 10px; font-weight: bold; letter-spacing: 3px; padding: 5px 16px; border-radius: 2px; text-transform: uppercase; }
    .doc-number { font-size: 22px; font-weight: bold; color: #c2410c; margin-top: 8px; }
    .doc-dates { font-size: 9px; color: #92400e; margin-top: 4px; }

    .orange-div { height: 3px; background: linear-gradient(to right, #f97316, #fb923c, #fed7aa); }

    .body { padding: 20px 35px; }

    .party-grid { display: flex; gap: 0; margin-bottom: 20px; border: 2px solid #fed7aa; border-radius: 6px; overflow: hidden; }
    .party-cell { flex: 1; padding: 14px 16px; }
    .party-cell:first-child { background: #fff7ed; border-right: 2px solid #fed7aa; }
    .party-cell:last-child { background: #fff; }
    .pc-label { font-size: 8px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #f97316; margin-bottom: 5px; }
    .pc-name { font-size: 14px; font-weight: bold; color: #1c1917; }
    .pc-gstin { font-size: 9px; color: #c2410c; font-weight: bold; margin-top: 2px; }
    .pc-info { font-size: 9px; color: #57534e; margin-top: 1px; }

    .kpi-strip { display: flex; gap: 12px; margin-bottom: 20px; }
    .kpi-box { flex: 1; border: 2px solid #fed7aa; border-radius: 5px; padding: 10px 12px; text-align: center; }
    .kpi-box.highlight { background: #f97316; border-color: #f97316; }
    .kpi-label { font-size: 8px; text-transform: uppercase; letter-spacing: 1px; color: #92400e; display: block; margin-bottom: 3px; }
    .kpi-value { font-size: 13px; font-weight: bold; color: #1c1917; }
    .kpi-box.highlight .kpi-label { color: rgba(255,255,255,0.7); }
    .kpi-box.highlight .kpi-value { color: #fff; font-size: 16px; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
    thead { border-bottom: 3px solid #f97316; }
    thead th { padding: 9px 7px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; color: #c2410c; font-weight: bold; background: #fff7ed; }
    tbody tr { border-bottom: 1px solid #fed7aa; }
    tbody tr:last-child { border-bottom: 2px solid #f97316; }
    tbody td { padding: 9px 7px; font-size: 10px; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .item-name { font-weight: bold; color: #1c1917; font-size: 11px; }
    .item-desc { font-size: 9px; color: #78716c; margin-top: 1px; }
    .item-num { display: inline-block; background: #f97316; color: #fff; width: 20px; height: 20px; line-height: 20px; text-align: center; border-radius: 50%; font-size: 9px; font-weight: bold; }

    .bottom-area { display: flex; justify-content: space-between; gap: 20px; }
    .notes-zone { flex: 1; }
    .totals-zone { width: 260px; }

    .note-card { border-left: 4px solid #f97316; padding: 10px 12px; background: #fff7ed; margin-bottom: 10px; border-radius: 0 5px 5px 0; }
    .note-card .nc-title { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #f97316; font-weight: bold; margin-bottom: 4px; }
    .note-card .nc-body { font-size: 9px; color: #57534e; line-height: 1.5; }

    .totals-block { border: 2px solid #fed7aa; border-radius: 6px; overflow: hidden; }
    .tb-row { display: flex; justify-content: space-between; padding: 6px 12px; border-bottom: 1px solid #fed7aa; font-size: 10px; }
    .tb-row:last-child { border-bottom: none; }
    .tb-label { color: #57534e; }
    .tb-value { font-weight: bold; color: #1c1917; }
    .tb-grand { background: #f97316; }
    .tb-grand .tb-label, .tb-grand .tb-value { color: #fff; font-size: 13px; font-weight: bold; }
    .tb-balance .tb-label, .tb-balance .tb-value { color: #ef4444; font-weight: bold; }
    .tb-paid .tb-value { color: #059669; }
    .tb-discount .tb-value { color: #f59e0b; }

    .footer { margin-top: 22px; display: flex; justify-content: space-between; align-items: flex-end; }
    .footer-left { font-size: 9px; color: #78716c; }
    .footer-left .fl-brand { color: #f97316; font-weight: bold; font-size: 10px; }
    .sig-area { text-align: center; border-top: 2px solid #f97316; padding-top: 8px; }
    .sig-area img { max-height: 38px; display: block; margin: 0 auto 4px; }
    .sig-area .sa-label { font-size: 9px; color: #92400e; }

    .bottom-strip { height: 5px; background: #f97316; margin-top: 18px; }
</style>
</head>
<body>

<div class="top-strip"></div>

<div class="header">
    <div class="brand-col">
        @if($setting?->logo)
        <img src="{{ public_path('storage/' . $setting->logo) }}" alt="Logo">
        @endif
        <div class="agency-name">{{ $setting?->tenant?->name ?? 'Creative Agency' }}</div>
        <div class="agency-sub">Creative Solutions &amp; Services</div>
        <div class="agency-contact">
            @if($setting?->gstin)GSTIN: {{ $setting->gstin }}<br>@endif
            @if($setting?->address){{ $setting->address }}, {{ $setting->city }}, {{ $setting->state }}<br>@endif
            @if($setting?->phone)Ph: {{ $setting->phone }}@endif
        </div>
    </div>
    <div class="doc-col">
        <div class="doc-pill">Tax Invoice</div>
        <div class="doc-number">{{ $invoice->number }}</div>
        <div class="doc-dates">
            Date: {{ $invoice->date->format('d M Y') }}<br>
            @if($invoice->due_date)Due: {{ $invoice->due_date->format('d M Y') }}@endif
        </div>
    </div>
</div>

<div class="orange-div"></div>

<div class="body">
    <div class="party-grid">
        <div class="party-cell">
            <div class="pc-label">Billed To</div>
            <div class="pc-name">{{ $invoice->party->name }}</div>
            @if($invoice->party->gstin)<div class="pc-gstin">GSTIN: {{ $invoice->party->gstin }}</div>@endif
            @if($invoice->party->billing_address)<div class="pc-info">{{ $invoice->party->billing_address }}</div>@endif
            @if($invoice->party->city)<div class="pc-info">{{ $invoice->party->city }}, {{ $invoice->party->state }}</div>@endif
            @if($invoice->party->phone)<div class="pc-info">Ph: {{ $invoice->party->phone }}</div>@endif
        </div>
        <div class="party-cell">
            <div class="pc-label">Project Details</div>
            <div class="pc-info"><strong>Invoice:</strong> {{ $invoice->number }}</div>
            <div class="pc-info"><strong>Date:</strong> {{ $invoice->date->format('d M Y') }}</div>
            @if($invoice->due_date)<div class="pc-info"><strong>Due:</strong> {{ $invoice->due_date->format('d M Y') }}</div>@endif
            @if($invoice->place_of_supply)<div class="pc-info"><strong>Place of Supply:</strong> {{ $invoice->place_of_supply }}</div>@endif
            <div class="pc-info"><strong>Tax Type:</strong> {{ $invoice->is_igst ? 'IGST' : 'CGST + SGST' }}</div>
        </div>
    </div>

    <div class="kpi-strip">
        <div class="kpi-box">
            <span class="kpi-label">Invoice No</span>
            <span class="kpi-value">{{ $invoice->number }}</span>
        </div>
        <div class="kpi-box">
            <span class="kpi-label">Items</span>
            <span class="kpi-value">{{ count($invoice->items) }}</span>
        </div>
        <div class="kpi-box">
            <span class="kpi-label">Tax Amount</span>
            <span class="kpi-value">&#8377;{{ number_format($invoice->tax_amount, 2) }}</span>
        </div>
        <div class="kpi-box highlight">
            <span class="kpi-label">Grand Total</span>
            <span class="kpi-value">&#8377;{{ number_format($invoice->total, 2) }}</span>
        </div>
        @if($invoice->balance > 0)
        <div class="kpi-box" style="border-color:#fca5a5;">
            <span class="kpi-label" style="color:#c0392b;">Balance Due</span>
            <span class="kpi-value" style="color:#c0392b;">&#8377;{{ number_format($invoice->balance, 2) }}</span>
        </div>
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th style="width:5%">#</th>
                <th style="width:28%">Deliverable / Description</th>
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
                <td class="text-center"><span class="item-num">{{ $idx + 1 }}</span></td>
                <td>
                    <div class="item-name">{{ $item->item?->name ?? $item->description }}</div>
                    @if($item->item?->name && $item->description)
                    <div class="item-desc">{{ $item->description }}</div>
                    @endif
                </td>
                <td class="text-center" style="color:#c2410c;">{{ $item->hsn_sac ?? '-' }}</td>
                <td class="text-right">{{ $item->qty }}</td>
                <td class="text-right">{{ number_format($item->unit_price, 2) }}</td>
                <td class="text-right" style="color:#f97316;">{{ $item->discount_pct > 0 ? $item->discount_pct . '%' : '-' }}</td>
                @if($invoice->is_igst)
                <td class="text-right">{{ $item->igst > 0 ? number_format($item->igst, 2) : '-' }}</td>
                @else
                <td class="text-right">{{ $item->cgst > 0 ? number_format($item->cgst, 2) : '-' }}</td>
                <td class="text-right">{{ $item->sgst > 0 ? number_format($item->sgst, 2) : '-' }}</td>
                @endif
                <td class="text-right"><strong style="color:#c2410c; font-size:11px;">&#8377;{{ number_format($item->amount, 2) }}</strong></td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="bottom-area">
        <div class="notes-zone">
            @if($invoice->notes)
            <div class="note-card">
                <div class="nc-title">Project Notes</div>
                <div class="nc-body">{{ $invoice->notes }}</div>
            </div>
            @endif
            @if($setting?->terms_and_conditions)
            <div class="note-card">
                <div class="nc-title">Terms &amp; Conditions</div>
                <div class="nc-body">{{ $setting->terms_and_conditions }}</div>
            </div>
            @endif
        </div>
        <div class="totals-zone">
            <div class="totals-block">
                <div class="tb-row"><span class="tb-label">Subtotal</span><span class="tb-value">&#8377;{{ number_format($invoice->subtotal, 2) }}</span></div>
                @if($invoice->discount > 0)
                <div class="tb-row tb-discount"><span class="tb-label">Discount</span><span class="tb-value">-&#8377;{{ number_format($invoice->discount, 2) }}</span></div>
                @endif
                @if($invoice->is_igst)
                <div class="tb-row"><span class="tb-label">IGST</span><span class="tb-value">&#8377;{{ number_format($invoice->items->sum('igst'), 2) }}</span></div>
                @else
                <div class="tb-row"><span class="tb-label">CGST</span><span class="tb-value">&#8377;{{ number_format($invoice->items->sum('cgst'), 2) }}</span></div>
                <div class="tb-row"><span class="tb-label">SGST</span><span class="tb-value">&#8377;{{ number_format($invoice->items->sum('sgst'), 2) }}</span></div>
                @endif
                @if($invoice->tcs_amount > 0)
                <div class="tb-row"><span class="tb-label">TCS ({{ $invoice->tcs_rate }}%)</span><span class="tb-value">&#8377;{{ number_format($invoice->tcs_amount, 2) }}</span></div>
                @endif
                <div class="tb-row tb-grand"><span class="tb-label">TOTAL</span><span class="tb-value">&#8377;{{ number_format($invoice->total, 2) }}</span></div>
                @if($invoice->amount_paid > 0)
                <div class="tb-row tb-paid"><span class="tb-label">Paid</span><span class="tb-value">&#8377;{{ number_format($invoice->amount_paid, 2) }}</span></div>
                <div class="tb-row tb-balance"><span class="tb-label">Balance</span><span class="tb-value">&#8377;{{ number_format($invoice->balance, 2) }}</span></div>
                @endif
            </div>
        </div>
    </div>

    <div class="footer">
        <div class="footer-left">
            <div class="fl-brand">{{ $setting?->tenant?->name ?? 'Agency' }}</div>
            @if($setting?->invoice_footer_notes)
            <div style="margin-top:3px;">{{ $setting->invoice_footer_notes }}</div>
            @else
            <div style="margin-top:3px;">Computer generated invoice. Thank you for your business.</div>
            @endif
        </div>
        <div class="sig-area">
            @if($setting?->e_signature_path)
            <img src="{{ public_path('storage/' . $setting->e_signature_path) }}" alt="Signature">
            @else
            <div style="height:35px;"></div>
            @endif
            <div class="sa-label">Authorised Signatory</div>
        </div>
    </div>
</div>

<div class="bottom-strip"></div>

</body>
</html>
