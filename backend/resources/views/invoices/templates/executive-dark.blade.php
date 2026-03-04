<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DejaVu Sans', sans-serif; font-size: 11px; color: #333; background: #fff; }

    .header { background: #2c2c2c; color: #fff; padding: 28px 35px; }
    .header-inner { display: flex; justify-content: space-between; align-items: flex-start; }
    .logo-area img { max-height: 55px; margin-bottom: 8px; }
    .company-name { font-size: 20px; font-weight: bold; color: #c9a227; letter-spacing: 1px; }
    .company-sub { font-size: 9px; color: #aaa; margin-top: 3px; }
    .invoice-badge { text-align: right; }
    .invoice-badge .label { font-size: 26px; font-weight: bold; color: #c9a227; letter-spacing: 3px; }
    .invoice-badge .number { font-size: 13px; color: #ddd; margin-top: 4px; }
    .invoice-badge .dates { font-size: 10px; color: #bbb; margin-top: 4px; }

    .gold-bar { height: 4px; background: linear-gradient(to right, #c9a227, #f5d76e, #c9a227); }

    .body { padding: 25px 35px; }

    .parties-row { display: flex; justify-content: space-between; margin-bottom: 22px; }
    .party-box { width: 48%; background: #f7f7f7; border-left: 4px solid #c9a227; padding: 12px 15px; }
    .party-box .label { font-size: 9px; text-transform: uppercase; color: #888; letter-spacing: 1px; margin-bottom: 5px; }
    .party-box .name { font-size: 14px; font-weight: bold; color: #2c2c2c; }
    .party-box .info { font-size: 10px; color: #555; margin-top: 2px; }

    .meta-bar { display: flex; justify-content: space-between; background: #2c2c2c; color: #fff; padding: 9px 15px; border-radius: 3px; margin-bottom: 18px; }
    .meta-item { text-align: center; }
    .meta-item .ml { font-size: 8px; color: #c9a227; text-transform: uppercase; letter-spacing: 1px; display: block; }
    .meta-item .mv { font-size: 11px; font-weight: bold; color: #fff; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
    thead tr { background: #2c2c2c; }
    thead th { color: #c9a227; padding: 9px 8px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: bold; }
    tbody tr { border-bottom: 1px solid #ebebeb; }
    tbody tr:nth-child(even) td { background: #fafafa; }
    tbody td { padding: 8px; font-size: 10px; color: #333; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .item-name { font-weight: bold; color: #2c2c2c; font-size: 11px; }
    .item-desc { font-size: 9px; color: #888; margin-top: 2px; }

    .bottom-section { display: flex; justify-content: space-between; margin-top: 5px; }
    .notes-area { width: 55%; }
    .totals-area { width: 38%; }

    .totals-table { width: 100%; border-collapse: collapse; }
    .totals-table td { padding: 5px 8px; font-size: 10px; border-bottom: 1px solid #eee; }
    .totals-table .tl { color: #555; }
    .totals-table .tv { text-align: right; color: #333; }
    .totals-table .total-row { background: #2c2c2c; }
    .totals-table .total-row td { color: #c9a227; font-weight: bold; font-size: 12px; border-bottom: none; }
    .totals-table .balance-row td { color: #c0392b; font-weight: bold; }

    .section-title { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 6px; }

    .footer { margin-top: 30px; border-top: 2px solid #2c2c2c; padding-top: 14px; display: flex; justify-content: space-between; align-items: flex-end; }
    .footer-left { font-size: 9px; color: #777; }
    .footer-left .footer-note { font-size: 10px; color: #555; }
    .sig-area { text-align: center; }
    .sig-area img { max-height: 40px; display: block; margin: 0 auto 4px; }
    .sig-area .sig-label { font-size: 9px; color: #888; border-top: 1px solid #bbb; padding-top: 4px; }

    .clearfix::after { content: ''; display: table; clear: both; }
</style>
</head>
<body>

<div class="header">
    <div class="header-inner">
        <div class="logo-area">
            @if($setting?->logo)
            <img src="{{ public_path('storage/' . $setting->logo) }}" alt="Logo">
            @endif
            <div class="company-name">{{ $setting?->tenant?->name ?? 'Company Name' }}</div>
            <div class="company-sub">
                @if($setting?->gstin)GSTIN: {{ $setting->gstin }}@endif
                @if($setting?->address) &nbsp;|&nbsp; {{ $setting->address }}, {{ $setting->city }}, {{ $setting->state }}@endif
            </div>
            @if($setting?->phone)<div class="company-sub">Ph: {{ $setting->phone }}</div>@endif
        </div>
        <div class="invoice-badge">
            <div class="label">TAX INVOICE</div>
            <div class="number">{{ $invoice->number }}</div>
            <div class="dates">Date: {{ $invoice->date->format('d M Y') }}</div>
            @if($invoice->due_date)
            <div class="dates">Due: {{ $invoice->due_date->format('d M Y') }}</div>
            @endif
        </div>
    </div>
</div>
<div class="gold-bar"></div>

<div class="body">
    <div class="parties-row">
        <div class="party-box">
            <div class="label">Bill To</div>
            <div class="name">{{ $invoice->party->name }}</div>
            @if($invoice->party->gstin)<div class="info">GSTIN: {{ $invoice->party->gstin }}</div>@endif
            @if($invoice->party->billing_address)<div class="info">{{ $invoice->party->billing_address }}</div>@endif
            @if($invoice->party->city)<div class="info">{{ $invoice->party->city }}, {{ $invoice->party->state }}</div>@endif
            @if($invoice->party->phone)<div class="info">Ph: {{ $invoice->party->phone }}</div>@endif
        </div>
        <div class="party-box">
            <div class="label">Supply Details</div>
            <div class="info"><strong>Place of Supply:</strong> {{ $invoice->place_of_supply ?? 'N/A' }}</div>
            <div class="info" style="margin-top:6px"><strong>Invoice Date:</strong> {{ $invoice->date->format('d M Y') }}</div>
            @if($invoice->due_date)
            <div class="info"><strong>Due Date:</strong> {{ $invoice->due_date->format('d M Y') }}</div>
            @endif
            <div class="info"><strong>Tax Type:</strong> {{ $invoice->is_igst ? 'IGST' : 'CGST + SGST' }}</div>
        </div>
    </div>

    <div class="meta-bar">
        <div class="meta-item"><span class="ml">Invoice No</span><span class="mv">{{ $invoice->number }}</span></div>
        <div class="meta-item"><span class="ml">Invoice Date</span><span class="mv">{{ $invoice->date->format('d M Y') }}</span></div>
        @if($invoice->due_date)
        <div class="meta-item"><span class="ml">Due Date</span><span class="mv">{{ $invoice->due_date->format('d M Y') }}</span></div>
        @endif
        <div class="meta-item"><span class="ml">Total Amount</span><span class="mv">&#8377;{{ number_format($invoice->total, 2) }}</span></div>
        <div class="meta-item"><span class="ml">Balance Due</span><span class="mv">&#8377;{{ number_format($invoice->balance, 2) }}</span></div>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width:4%">#</th>
                <th style="width:28%">Item / Description</th>
                <th style="width:9%">HSN/SAC</th>
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
                <td class="text-center">{{ $idx + 1 }}</td>
                <td>
                    <div class="item-name">{{ $item->item?->name ?? $item->description }}</div>
                    @if($item->item?->name && $item->description)
                    <div class="item-desc">{{ $item->description }}</div>
                    @endif
                </td>
                <td class="text-center">{{ $item->hsn_sac ?? '-' }}</td>
                <td class="text-right">{{ $item->qty }}</td>
                <td class="text-right">{{ number_format($item->unit_price, 2) }}</td>
                <td class="text-right">{{ $item->discount_pct > 0 ? $item->discount_pct . '%' : '-' }}</td>
                @if($invoice->is_igst)
                <td class="text-right">{{ $item->igst > 0 ? number_format($item->igst, 2) : '-' }}</td>
                @else
                <td class="text-right">{{ $item->cgst > 0 ? number_format($item->cgst, 2) : '-' }}</td>
                <td class="text-right">{{ $item->sgst > 0 ? number_format($item->sgst, 2) : '-' }}</td>
                @endif
                <td class="text-right"><strong>{{ number_format($item->amount, 2) }}</strong></td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="bottom-section">
        <div class="notes-area">
            @if($invoice->notes)
            <div class="section-title">Notes</div>
            <div style="font-size:10px; color:#555; margin-bottom:12px;">{{ $invoice->notes }}</div>
            @endif
            @if($setting?->terms_and_conditions)
            <div class="section-title">Terms &amp; Conditions</div>
            <div style="font-size:9px; color:#777;">{{ $setting->terms_and_conditions }}</div>
            @endif
        </div>
        <div class="totals-area">
            <table class="totals-table">
                <tr><td class="tl">Subtotal</td><td class="tv">&#8377;{{ number_format($invoice->subtotal, 2) }}</td></tr>
                @if($invoice->discount > 0)
                <tr><td class="tl">Discount</td><td class="tv" style="color:#c9a227;">-&#8377;{{ number_format($invoice->discount, 2) }}</td></tr>
                @endif
                @if($invoice->is_igst)
                <tr><td class="tl">IGST</td><td class="tv">&#8377;{{ number_format($invoice->items->sum('igst'), 2) }}</td></tr>
                @else
                <tr><td class="tl">CGST</td><td class="tv">&#8377;{{ number_format($invoice->items->sum('cgst'), 2) }}</td></tr>
                <tr><td class="tl">SGST</td><td class="tv">&#8377;{{ number_format($invoice->items->sum('sgst'), 2) }}</td></tr>
                @endif
                @if($invoice->tcs_amount > 0)
                <tr><td class="tl">TCS ({{ $invoice->tcs_rate }}%)</td><td class="tv">&#8377;{{ number_format($invoice->tcs_amount, 2) }}</td></tr>
                @endif
                <tr class="total-row">
                    <td class="tl" style="color:#c9a227; font-weight:bold;">TOTAL</td>
                    <td class="tv" style="color:#c9a227; font-weight:bold; text-align:right;">&#8377;{{ number_format($invoice->total, 2) }}</td>
                </tr>
                @if($invoice->amount_paid > 0)
                <tr><td class="tl">Amount Paid</td><td class="tv">&#8377;{{ number_format($invoice->amount_paid, 2) }}</td></tr>
                <tr class="balance-row">
                    <td class="tl">Balance Due</td>
                    <td class="tv" style="text-align:right; color:#c0392b; font-weight:bold;">&#8377;{{ number_format($invoice->balance, 2) }}</td>
                </tr>
                @endif
            </table>
        </div>
    </div>

    <div class="footer">
        <div class="footer-left">
            @if($setting?->invoice_footer_notes)
            <div class="footer-note">{{ $setting->invoice_footer_notes }}</div>
            @else
            <div class="footer-note">This is a computer generated invoice.</div>
            @endif
            <div style="margin-top:4px; color:#aaa;">Thank you for your business.</div>
        </div>
        <div class="sig-area">
            @if($setting?->e_signature_path)
            <img src="{{ public_path('storage/' . $setting->e_signature_path) }}" alt="Signature">
            @endif
            <div class="sig-label">Authorised Signatory<br>{{ $setting?->tenant?->name ?? '' }}</div>
        </div>
    </div>
</div>

</body>
</html>
