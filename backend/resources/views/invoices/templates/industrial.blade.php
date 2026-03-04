<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DejaVu Sans', sans-serif; font-size: 11px; color: #0f172a; background: #fff; }

    .outer { border: 3px solid #334155; }

    .header { background: #334155; padding: 20px 25px; display: flex; justify-content: space-between; align-items: center; }
    .header-left img { max-height: 45px; display: block; margin-bottom: 6px; }
    .company-name { font-size: 22px; font-weight: bold; color: #f1f5f9; text-transform: uppercase; letter-spacing: 2px; }
    .company-gstin { font-size: 9px; color: #94a3b8; margin-top: 2px; text-transform: uppercase; }
    .company-addr { font-size: 9px; color: #94a3b8; margin-top: 1px; }

    .header-right { text-align: right; }
    .inv-type-box { display: inline-block; border: 2px solid #f1f5f9; padding: 5px 16px; }
    .inv-type-text { font-size: 18px; font-weight: bold; color: #f1f5f9; text-transform: uppercase; letter-spacing: 4px; }
    .inv-number { font-size: 14px; font-weight: bold; color: #f1f5f9; margin-top: 6px; }
    .inv-date { font-size: 10px; color: #94a3b8; margin-top: 3px; }

    .sub-header { background: #1e293b; padding: 7px 25px; display: flex; justify-content: space-between; }
    .sh-item { font-size: 9px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
    .sh-item strong { color: #e2e8f0; }

    .parties { display: flex; border-bottom: 3px solid #334155; }
    .party-half { width: 50%; padding: 14px 20px; }
    .party-half:first-child { border-right: 2px solid #334155; }
    .ph-heading { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; border-bottom: 2px solid #334155; padding-bottom: 4px; margin-bottom: 7px; font-weight: bold; }
    .ph-name { font-size: 14px; font-weight: bold; color: #0f172a; text-transform: uppercase; }
    .ph-gstin { font-size: 10px; color: #475569; font-weight: bold; margin-top: 3px; }
    .ph-info { font-size: 9px; color: #475569; margin-top: 2px; }

    .body { padding: 0 0 20px; }

    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #1e293b; }
    thead th { color: #e2e8f0; padding: 9px 8px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 1px; border-right: 1px solid #334155; }
    thead th:last-child { border-right: none; }
    tbody tr { border-bottom: 1px solid #e2e8f0; }
    tbody tr:nth-child(even) { background: #f8fafc; }
    tbody td { padding: 8px; font-size: 10px; border-right: 1px solid #e2e8f0; }
    tbody td:last-child { border-right: none; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .item-name { font-weight: bold; font-size: 11px; text-transform: uppercase; color: #0f172a; }
    .item-desc { font-size: 9px; color: #64748b; margin-top: 1px; }

    .totals-section { border-top: 3px solid #334155; display: flex; }
    .notes-block { flex: 1; padding: 14px 20px; border-right: 2px solid #334155; }
    .nb-heading { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; border-bottom: 2px solid #334155; padding-bottom: 4px; margin-bottom: 7px; font-weight: bold; }
    .nb-text { font-size: 9px; color: #475569; line-height: 1.5; }

    .totals-block { width: 280px; padding: 0; }
    .tt-row { display: flex; justify-content: space-between; padding: 7px 14px; border-bottom: 1px solid #e2e8f0; font-size: 10px; }
    .tt-row:last-child { border-bottom: none; }
    .tt-label { color: #475569; text-transform: uppercase; font-size: 9px; letter-spacing: 0.5px; }
    .tt-value { font-weight: bold; color: #0f172a; font-size: 10px; }
    .tt-grand { background: #334155; }
    .tt-grand .tt-label { color: #e2e8f0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
    .tt-grand .tt-value { color: #f1f5f9; font-size: 14px; }
    .tt-balance .tt-label, .tt-balance .tt-value { color: #dc2626; font-weight: bold; }
    .tt-paid .tt-value { color: #16a34a; }
    .tt-discount .tt-value { color: #ea580c; }

    .sig-footer { border-top: 3px solid #334155; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; }
    .sf-note { font-size: 9px; color: #475569; }
    .sf-sig { text-align: center; }
    .sf-sig img { max-height: 35px; display: block; margin: 0 auto 4px; }
    .sf-sig .ssl { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; border-top: 2px solid #334155; padding-top: 4px; }
</style>
</head>
<body>

<div class="outer">
    <div class="header">
        <div class="header-left">
            @if($setting?->logo)
            <img src="{{ public_path('storage/' . $setting->logo) }}" alt="Logo">
            @endif
            <div class="company-name">{{ $setting?->tenant?->name ?? 'Industrial Corp' }}</div>
            @if($setting?->gstin)<div class="company-gstin">GSTIN: {{ $setting->gstin }}</div>@endif
            @if($setting?->address)<div class="company-addr">{{ $setting->address }}, {{ $setting->city }}, {{ $setting->state }}</div>@endif
            @if($setting?->phone)<div class="company-addr">TEL: {{ $setting->phone }}</div>@endif
        </div>
        <div class="header-right">
            <div class="inv-type-box">
                <div class="inv-type-text">TAX INVOICE</div>
            </div>
            <div class="inv-number">{{ $invoice->number }}</div>
            <div class="inv-date">DATE: {{ $invoice->date->format('d/m/Y') }}</div>
            @if($invoice->due_date)
            <div class="inv-date">DUE: {{ $invoice->due_date->format('d/m/Y') }}</div>
            @endif
        </div>
    </div>

    <div class="sub-header">
        <div class="sh-item">Invoice: <strong>{{ $invoice->number }}</strong></div>
        <div class="sh-item">Date: <strong>{{ $invoice->date->format('d/m/Y') }}</strong></div>
        @if($invoice->due_date)
        <div class="sh-item">Due: <strong>{{ $invoice->due_date->format('d/m/Y') }}</strong></div>
        @endif
        @if($invoice->place_of_supply)
        <div class="sh-item">Place of Supply: <strong>{{ $invoice->place_of_supply }}</strong></div>
        @endif
        <div class="sh-item">Tax: <strong>{{ $invoice->is_igst ? 'IGST' : 'CGST + SGST' }}</strong></div>
        <div class="sh-item">Total: <strong>&#8377;{{ number_format($invoice->total, 2) }}</strong></div>
    </div>

    <div class="parties">
        <div class="party-half">
            <div class="ph-heading">Buyer / Bill To</div>
            <div class="ph-name">{{ $invoice->party->name }}</div>
            @if($invoice->party->gstin)<div class="ph-gstin">GSTIN: {{ $invoice->party->gstin }}</div>@endif
            @if($invoice->party->billing_address)<div class="ph-info">{{ $invoice->party->billing_address }}</div>@endif
            @if($invoice->party->city)<div class="ph-info">{{ $invoice->party->city }}, {{ $invoice->party->state }}</div>@endif
            @if($invoice->party->phone)<div class="ph-info">PH: {{ $invoice->party->phone }}</div>@endif
        </div>
        <div class="party-half">
            <div class="ph-heading">Seller / Dispatch From</div>
            <div class="ph-name">{{ $setting?->tenant?->name ?? 'Company' }}</div>
            @if($setting?->gstin)<div class="ph-gstin">GSTIN: {{ $setting->gstin }}</div>@endif
            @if($setting?->address)<div class="ph-info">{{ $setting->address }}, {{ $setting->city }}, {{ $setting->state }}</div>@endif
            @if($setting?->phone)<div class="ph-info">PH: {{ $setting->phone }}</div>@endif
        </div>
    </div>

    <div class="body">
        <table>
            <thead>
                <tr>
                    <th style="width:4%">SR</th>
                    <th style="width:27%">DESCRIPTION</th>
                    <th style="width:9%">HSN/SAC</th>
                    <th class="text-right" style="width:6%">QTY</th>
                    <th class="text-right" style="width:9%">UNIT RATE</th>
                    <th class="text-right" style="width:7%">DISC%</th>
                    @if($invoice->is_igst)
                    <th class="text-right" style="width:10%">IGST AMT</th>
                    @else
                    <th class="text-right" style="width:9%">CGST AMT</th>
                    <th class="text-right" style="width:9%">SGST AMT</th>
                    @endif
                    <th class="text-right" style="width:10%">TOTAL AMT</th>
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
                    </td>
                    <td class="text-center">{{ $item->hsn_sac ?? '-' }}</td>
                    <td class="text-right" style="font-weight:bold;">{{ $item->qty }}</td>
                    <td class="text-right">&#8377;{{ number_format($item->unit_price, 2) }}</td>
                    <td class="text-right">{{ $item->discount_pct > 0 ? $item->discount_pct . '%' : '-' }}</td>
                    @if($invoice->is_igst)
                    <td class="text-right">{{ $item->igst > 0 ? '&#8377;' . number_format($item->igst, 2) : '-' }}</td>
                    @else
                    <td class="text-right">{{ $item->cgst > 0 ? '&#8377;' . number_format($item->cgst, 2) : '-' }}</td>
                    <td class="text-right">{{ $item->sgst > 0 ? '&#8377;' . number_format($item->sgst, 2) : '-' }}</td>
                    @endif
                    <td class="text-right"><strong>&#8377;{{ number_format($item->amount, 2) }}</strong></td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="totals-section">
        <div class="notes-block">
            @if($invoice->notes)
            <div class="nb-heading">Remarks</div>
            <div class="nb-text">{{ $invoice->notes }}</div>
            @endif
            @if($setting?->terms_and_conditions)
            <div class="nb-heading" style="margin-top:10px;">Terms &amp; Conditions</div>
            <div class="nb-text">{{ $setting->terms_and_conditions }}</div>
            @endif
            @if(!$invoice->notes && !$setting?->terms_and_conditions)
            <div class="nb-heading">Remarks</div>
            <div class="nb-text">No additional remarks.</div>
            @endif
        </div>
        <div class="totals-block">
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

    <div class="sig-footer">
        <div class="sf-note">
            @if($setting?->invoice_footer_notes)
            {{ $setting->invoice_footer_notes }}
            @else
            Computer generated invoice. No manual signature required.
            @endif
        </div>
        <div class="sf-sig">
            @if($setting?->e_signature_path)
            <img src="{{ public_path('storage/' . $setting->e_signature_path) }}" alt="Signature">
            @else
            <div style="height:30px;"></div>
            @endif
            <div class="ssl">Authorised Signatory</div>
        </div>
    </div>
</div>

</body>
</html>
