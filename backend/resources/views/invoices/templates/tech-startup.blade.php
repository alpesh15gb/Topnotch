<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DejaVu Sans', sans-serif; font-size: 11px; color: #1e1b4b; background: #fff; }

    .header { background: #4f46e5; padding: 0; }
    .header-top { display: flex; justify-content: space-between; align-items: stretch; }
    .header-brand { padding: 22px 30px; flex: 1; }
    .header-brand img { max-height: 48px; display: block; margin-bottom: 8px; }
    .brand-name { font-size: 20px; font-weight: bold; color: #fff; letter-spacing: 1px; }
    .brand-sub { font-size: 9px; color: rgba(255,255,255,0.65); margin-top: 3px; font-family: 'DejaVu Sans Mono', monospace; }

    .header-inv { background: #3730a3; padding: 22px 30px; text-align: right; min-width: 220px; display: flex; flex-direction: column; justify-content: center; }
    .inv-label { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.5); }
    .inv-type { font-size: 22px; font-weight: bold; color: #a5b4fc; letter-spacing: 3px; }
    .inv-number { font-family: 'DejaVu Sans Mono', monospace; font-size: 13px; color: #fff; margin-top: 4px; }
    .inv-dates { font-size: 9px; color: rgba(255,255,255,0.65); margin-top: 3px; }

    .accent-bar { height: 3px; background: linear-gradient(to right, #818cf8, #c084fc, #fb7185); }

    .body { padding: 22px 30px; }

    .info-grid { display: flex; gap: 15px; margin-bottom: 20px; }
    .info-card { flex: 1; border: 1px solid #e0e7ff; border-radius: 8px; padding: 12px 14px; background: #fafafe; }
    .info-card .ic-label { font-size: 8px; text-transform: uppercase; letter-spacing: 1.5px; color: #818cf8; margin-bottom: 5px; font-family: 'DejaVu Sans Mono', monospace; }
    .info-card .ic-name { font-size: 13px; font-weight: bold; color: #1e1b4b; }
    .info-card .ic-detail { font-size: 9px; color: #6366f1; margin-top: 2px; }
    .info-card .ic-meta { font-size: 9px; color: #64748b; margin-top: 1px; }
    .info-card-highlight { background: #eef2ff; border-color: #a5b4fc; }

    .meta-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
    .chip { font-family: 'DejaVu Sans Mono', monospace; font-size: 9px; background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe; border-radius: 4px; padding: 3px 10px; }
    .chip strong { color: #3730a3; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 10px; }
    .table-wrap { border: 1px solid #e0e7ff; border-radius: 8px; overflow: hidden; }
    thead tr { background: #4f46e5; }
    thead th { color: #c7d2fe; padding: 9px 8px; text-align: left; font-size: 8px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; font-family: 'DejaVu Sans Mono', monospace; }
    tbody tr { border-bottom: 1px solid #e0e7ff; }
    tbody tr:last-child { border-bottom: none; }
    tbody tr:nth-child(even) td { background: #fafafe; }
    tbody td { padding: 8px; vertical-align: top; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .item-code { font-family: 'DejaVu Sans Mono', monospace; font-size: 9px; background: #eef2ff; color: #4f46e5; padding: 1px 5px; border-radius: 3px; display: inline-block; }
    .item-name { font-weight: bold; color: #1e1b4b; font-size: 10px; margin-bottom: 3px; }
    .item-desc { font-size: 9px; color: #94a3b8; }
    .amount-cell { font-family: 'DejaVu Sans Mono', monospace; font-weight: bold; color: #3730a3; }
    .tax-cell { font-family: 'DejaVu Sans Mono', monospace; font-size: 9px; color: #6366f1; }

    .bottom-grid { display: flex; justify-content: space-between; gap: 20px; }
    .notes-col { flex: 1; }
    .totals-col { width: 260px; }

    .code-block { font-family: 'DejaVu Sans Mono', monospace; background: #1e1b4b; color: #a5b4fc; padding: 12px 14px; border-radius: 8px; font-size: 9px; line-height: 1.7; margin-bottom: 12px; }
    .code-block .cb-label { color: #818cf8; }
    .code-block .cb-val { color: #fff; }
    .code-block .cb-comment { color: #4c1d95; }

    .terms-box { background: #fafafe; border: 1px solid #e0e7ff; border-radius: 6px; padding: 10px 12px; }
    .terms-box h4 { font-size: 8px; text-transform: uppercase; letter-spacing: 1px; color: #818cf8; margin-bottom: 4px; }
    .terms-box p { font-size: 9px; color: #64748b; }

    .totals-box { border: 1px solid #e0e7ff; border-radius: 8px; overflow: hidden; }
    .t-row { display: flex; justify-content: space-between; padding: 6px 12px; border-bottom: 1px solid #e0e7ff; font-size: 10px; }
    .t-row:last-child { border-bottom: none; }
    .t-label { color: #6366f1; font-family: 'DejaVu Sans Mono', monospace; font-size: 9px; }
    .t-val { font-family: 'DejaVu Sans Mono', monospace; font-weight: bold; color: #1e1b4b; }
    .t-row-grand { background: #4f46e5; }
    .t-row-grand .t-label, .t-row-grand .t-val { color: #fff; font-size: 12px; }
    .t-row-balance .t-label, .t-row-balance .t-val { color: #ef4444; font-weight: bold; }
    .t-row-paid .t-val { color: #10b981; }

    .footer { margin-top: 22px; padding-top: 12px; border-top: 2px solid #e0e7ff; display: flex; justify-content: space-between; align-items: flex-end; }
    .footer-note { font-size: 9px; color: #818cf8; font-family: 'DejaVu Sans Mono', monospace; }
    .sig-box { text-align: center; border: 1px solid #e0e7ff; border-radius: 6px; padding: 8px 16px; }
    .sig-box img { max-height: 35px; display: block; margin: 0 auto 4px; }
    .sig-box .sig-label { font-size: 8px; color: #818cf8; text-transform: uppercase; letter-spacing: 1px; }
</style>
</head>
<body>

<div class="header">
    <div class="header-top">
        <div class="header-brand">
            @if($setting?->logo)
            <img src="{{ public_path('storage/' . $setting->logo) }}" alt="Logo">
            @endif
            <div class="brand-name">{{ $setting?->tenant?->name ?? 'TechCorp' }}</div>
            <div class="brand-sub">
                @if($setting?->gstin)GSTIN: {{ $setting->gstin }}@endif
                @if($setting?->address) // {{ $setting->address }}, {{ $setting->city }}@endif
            </div>
            @if($setting?->phone)<div class="brand-sub">TEL: {{ $setting->phone }}</div>@endif
        </div>
        <div class="header-inv">
            <div class="inv-label">Document Type</div>
            <div class="inv-type">INVOICE</div>
            <div class="inv-number">{{ $invoice->number }}</div>
            <div class="inv-dates">{{ $invoice->date->format('d M Y') }}</div>
            @if($invoice->due_date)
            <div class="inv-dates">DUE: {{ $invoice->due_date->format('d M Y') }}</div>
            @endif
        </div>
    </div>
</div>
<div class="accent-bar"></div>

<div class="body">
    <div class="info-grid">
        <div class="info-card info-card-highlight">
            <div class="ic-label">// client</div>
            <div class="ic-name">{{ $invoice->party->name }}</div>
            @if($invoice->party->gstin)<div class="ic-detail">GSTIN: {{ $invoice->party->gstin }}</div>@endif
            @if($invoice->party->billing_address)<div class="ic-meta">{{ $invoice->party->billing_address }}</div>@endif
            @if($invoice->party->city)<div class="ic-meta">{{ $invoice->party->city }}, {{ $invoice->party->state }}</div>@endif
            @if($invoice->party->phone)<div class="ic-meta">Ph: {{ $invoice->party->phone }}</div>@endif
        </div>
        <div class="info-card">
            <div class="ic-label">// vendor</div>
            <div class="ic-name">{{ $setting?->tenant?->name ?? 'Company' }}</div>
            @if($setting?->gstin)<div class="ic-detail">GSTIN: {{ $setting->gstin }}</div>@endif
            @if($setting?->address)<div class="ic-meta">{{ $setting->address }}, {{ $setting->city }}, {{ $setting->state }}</div>@endif
            @if($setting?->phone)<div class="ic-meta">Ph: {{ $setting->phone }}</div>@endif
        </div>
        <div class="info-card" style="background:#f0fdf4; border-color:#a7f3d0;">
            <div class="ic-label" style="color:#059669;">// summary</div>
            <div class="ic-name" style="color:#059669; font-size:18px; font-family:'DejaVu Sans Mono',monospace;">&#8377;{{ number_format($invoice->total, 2) }}</div>
            <div class="ic-meta">Total Due</div>
            @if($invoice->balance > 0)
            <div class="ic-detail" style="color:#ef4444; margin-top:4px;">Balance: &#8377;{{ number_format($invoice->balance, 2) }}</div>
            @else
            <div class="ic-detail" style="color:#059669; margin-top:4px;">STATUS: PAID</div>
            @endif
        </div>
    </div>

    <div class="meta-chips">
        <div class="chip"><strong>INV#</strong> {{ $invoice->number }}</div>
        <div class="chip"><strong>DATE</strong> {{ $invoice->date->format('d/m/Y') }}</div>
        @if($invoice->due_date)<div class="chip"><strong>DUE</strong> {{ $invoice->due_date->format('d/m/Y') }}</div>@endif
        @if($invoice->place_of_supply)<div class="chip"><strong>POS</strong> {{ $invoice->place_of_supply }}</div>@endif
        <div class="chip"><strong>TAX</strong> {{ $invoice->is_igst ? 'IGST' : 'CGST+SGST' }}</div>
    </div>

    <div class="table-wrap">
        <table>
            <thead>
                <tr>
                    <th style="width:4%">#</th>
                    <th style="width:28%">item_description</th>
                    <th style="width:9%">hsn_sac</th>
                    <th class="text-right" style="width:6%">qty</th>
                    <th class="text-right" style="width:9%">unit_rate</th>
                    <th class="text-right" style="width:7%">disc_pct</th>
                    @if($invoice->is_igst)
                    <th class="text-right" style="width:10%">igst_amt</th>
                    @else
                    <th class="text-right" style="width:9%">cgst_amt</th>
                    <th class="text-right" style="width:9%">sgst_amt</th>
                    @endif
                    <th class="text-right" style="width:10%">total_amt</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $idx => $item)
                <tr>
                    <td class="text-center" style="color:#818cf8; font-family:'DejaVu Sans Mono',monospace;">{{ str_pad($idx + 1, 2, '0', STR_PAD_LEFT) }}</td>
                    <td>
                        <div class="item-name">{{ $item->item?->name ?? $item->description }}</div>
                        @if($item->item?->name && $item->description)
                        <div class="item-desc">{{ $item->description }}</div>
                        @endif
                        @if($item->hsn_sac)
                        <div style="margin-top:2px;"><span class="item-code">{{ $item->hsn_sac }}</span></div>
                        @endif
                    </td>
                    <td class="text-center tax-cell">{{ $item->hsn_sac ?? 'N/A' }}</td>
                    <td class="text-right" style="font-family:'DejaVu Sans Mono',monospace;">{{ $item->qty }}</td>
                    <td class="text-right amount-cell">&#8377;{{ number_format($item->unit_price, 2) }}</td>
                    <td class="text-right tax-cell">{{ $item->discount_pct > 0 ? $item->discount_pct . '%' : '0%' }}</td>
                    @if($invoice->is_igst)
                    <td class="text-right tax-cell">{{ $item->igst > 0 ? number_format($item->igst, 2) : '-' }}</td>
                    @else
                    <td class="text-right tax-cell">{{ $item->cgst > 0 ? number_format($item->cgst, 2) : '-' }}</td>
                    <td class="text-right tax-cell">{{ $item->sgst > 0 ? number_format($item->sgst, 2) : '-' }}</td>
                    @endif
                    <td class="text-right amount-cell">&#8377;{{ number_format($item->amount, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="bottom-grid">
        <div class="notes-col">
            @if($invoice->notes)
            <div class="code-block">
                <span class="cb-comment">/* notes */</span><br>
                <span class="cb-label">note: </span><span class="cb-val">{{ $invoice->notes }}</span>
            </div>
            @endif
            @if($setting?->terms_and_conditions)
            <div class="terms-box">
                <h4>// terms_and_conditions</h4>
                <p>{{ $setting->terms_and_conditions }}</p>
            </div>
            @endif
        </div>
        <div class="totals-col">
            <div class="totals-box">
                <div class="t-row"><span class="t-label">subtotal</span><span class="t-val">&#8377;{{ number_format($invoice->subtotal, 2) }}</span></div>
                @if($invoice->discount > 0)
                <div class="t-row"><span class="t-label">discount</span><span class="t-val" style="color:#f59e0b;">-&#8377;{{ number_format($invoice->discount, 2) }}</span></div>
                @endif
                @if($invoice->is_igst)
                <div class="t-row"><span class="t-label">igst</span><span class="t-val">&#8377;{{ number_format($invoice->items->sum('igst'), 2) }}</span></div>
                @else
                <div class="t-row"><span class="t-label">cgst</span><span class="t-val">&#8377;{{ number_format($invoice->items->sum('cgst'), 2) }}</span></div>
                <div class="t-row"><span class="t-label">sgst</span><span class="t-val">&#8377;{{ number_format($invoice->items->sum('sgst'), 2) }}</span></div>
                @endif
                @if($invoice->tcs_amount > 0)
                <div class="t-row"><span class="t-label">tcs_{{ $invoice->tcs_rate }}pct</span><span class="t-val">&#8377;{{ number_format($invoice->tcs_amount, 2) }}</span></div>
                @endif
                <div class="t-row t-row-grand"><span class="t-label">TOTAL</span><span class="t-val">&#8377;{{ number_format($invoice->total, 2) }}</span></div>
                @if($invoice->amount_paid > 0)
                <div class="t-row t-row-paid"><span class="t-label">amount_paid</span><span class="t-val">&#8377;{{ number_format($invoice->amount_paid, 2) }}</span></div>
                <div class="t-row t-row-balance"><span class="t-label">balance_due</span><span class="t-val">&#8377;{{ number_format($invoice->balance, 2) }}</span></div>
                @endif
            </div>
        </div>
    </div>

    <div class="footer">
        <div class="footer-note">
            @if($setting?->invoice_footer_notes)
            // {{ $setting->invoice_footer_notes }}
            @else
            // computer_generated_document | no_signature_required
            @endif
        </div>
        <div class="sig-box">
            @if($setting?->e_signature_path)
            <img src="{{ public_path('storage/' . $setting->e_signature_path) }}" alt="Signature">
            @else
            <div style="height:30px;"></div>
            @endif
            <div class="sig-label">Authorised Sig.</div>
        </div>
    </div>
</div>

</body>
</html>
