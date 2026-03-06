'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const fmt = (n: number) => '₹' + Math.abs(Number(n)).toLocaleString('en-IN', { minimumFractionDigits: 2 });
const pct = (n: number) => Number(n).toFixed(1) + '%';

export default function ProfitLossPage() {
    const now = new Date();
    const [fromDate, setFromDate] = useState(format(startOfMonth(now), 'yyyy-MM-dd'));
    const [toDate, setToDate] = useState(format(endOfMonth(now), 'yyyy-MM-dd'));

    const { data, isLoading } = useQuery({
        queryKey: ['profit-loss', fromDate, toDate],
        queryFn: async () => {
            const res = await api.get('/v1/reports/profit-loss', {
                params: { from_date: fromDate, to_date: toDate },
            });
            return res.data;
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Profit &amp; Loss</h1>
                    <p className="text-sm text-slate-500">Income and expense summary for the selected period</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-2 shadow-sm">
                        <span className="text-xs text-slate-500">From</span>
                        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
                            className="text-sm outline-none" />
                        <span className="text-xs text-slate-400 mx-1">—</span>
                        <span className="text-xs text-slate-500">To</span>
                        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
                            className="text-sm outline-none" />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F59E0B]" />
                </div>
            ) : data ? (
                <div className="space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <KpiCard
                            label="Revenue"
                            value={data.revenue}
                            color="green"
                            sub={`Period total`}
                        />
                        <KpiCard
                            label="Gross Profit"
                            value={data.gross_profit}
                            color={data.gross_profit >= 0 ? 'blue' : 'red'}
                            sub={pct(data.gross_margin) + ' margin'}
                        />
                        <KpiCard
                            label="Operating Expenses"
                            value={data.operating_expenses}
                            color="red"
                            sub="Total OpEx"
                        />
                        <KpiCard
                            label="Net Profit"
                            value={data.net_profit}
                            color={data.net_profit >= 0 ? 'emerald' : 'red'}
                            sub={pct(data.net_margin) + ' margin'}
                            highlight
                        />
                    </div>

                    {/* Revenue & Expenses two-column */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Revenue Section */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 border-b border-slate-200 bg-emerald-50">
                                <h2 className="font-semibold text-emerald-800">Revenue</h2>
                            </div>
                            <table className="w-full">
                                <tbody className="divide-y divide-slate-100">
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-5 py-3 text-sm font-medium text-slate-700">Total Revenue (Sales)</td>
                                        <td className="px-5 py-3 text-right font-mono font-bold text-emerald-700">{fmt(data.revenue)}</td>
                                    </tr>
                                    {data.details?.revenue_breakdown?.map((item: { category: string; amount: number }, i: number) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-5 py-3 pl-9 text-sm text-slate-500">{item.category}</td>
                                            <td className="px-5 py-3 text-right font-mono text-sm text-emerald-600">{fmt(item.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-slate-200 bg-slate-50">
                                        <td className="px-5 py-2.5 text-sm font-bold text-slate-700">Gross Profit</td>
                                        <td className={cn('px-5 py-2.5 text-right font-mono font-bold', data.gross_profit >= 0 ? 'text-emerald-700' : 'text-red-600')}>
                                            {fmt(data.gross_profit)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Expenses Section */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 border-b border-slate-200 bg-red-50">
                                <h2 className="font-semibold text-red-800">Expenses</h2>
                            </div>
                            <table className="w-full">
                                <tbody className="divide-y divide-slate-100">
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-5 py-3 text-sm font-medium text-slate-700">Cost of Goods Sold (COGS)</td>
                                        <td className="px-5 py-3 text-right font-mono font-medium text-red-600">({fmt(data.cogs)})</td>
                                    </tr>
                                    <tr className="bg-slate-50/50">
                                        <td colSpan={2} className="px-5 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Operating Expenses</td>
                                    </tr>
                                    {data.details?.expense_breakdown?.map((item: { category: string; amount: number }, i: number) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-5 py-3 pl-9 text-sm text-slate-500">{item.category}</td>
                                            <td className="px-5 py-3 text-right font-mono text-sm text-red-500">({fmt(item.amount)})</td>
                                        </tr>
                                    ))}
                                    {!data.details?.expense_breakdown?.length && (
                                        <tr>
                                            <td className="px-5 py-3 pl-9 text-sm text-slate-500">Other Expenses</td>
                                            <td className="px-5 py-3 text-right font-mono text-sm text-red-500">({fmt(data.operating_expenses)})</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-slate-200 bg-slate-50">
                                        <td className="px-5 py-2.5 text-sm font-bold text-slate-700">Total Expenses</td>
                                        <td className="px-5 py-2.5 text-right font-mono font-bold text-red-600">
                                            ({fmt(Number(data.cogs) + Number(data.operating_expenses))})
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* P&L Summary Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                            <h2 className="font-semibold text-slate-800">Statement of Profit &amp; Loss</h2>
                            <span className="text-sm text-slate-500">
                                {format(new Date(fromDate + 'T00:00:00'), 'dd MMM yyyy')} — {format(new Date(toDate + 'T00:00:00'), 'dd MMM yyyy')}
                            </span>
                        </div>
                        <table className="w-full">
                            <tbody>
                                <PLRow label="Gross Revenue (Sales)" amount={data.revenue} />
                                <PLRow label="Less: Cost of Goods Sold" amount={data.cogs} deduction sub />
                                <PLRow label="Gross Profit" amount={data.gross_profit} bold borderTop
                                    positive={data.gross_profit >= 0} />
                                <tr><td colSpan={2} className="px-6 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide bg-slate-50/50">Less: Operating Expenses</td></tr>
                                <PLRow label="Operating Expenses" amount={data.operating_expenses} deduction sub />
                                <PLRow label="Net Profit / (Loss)" amount={data.net_profit} bold borderTop
                                    positive={data.net_profit >= 0}
                                    highlight />
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 text-slate-400">Select a date range to load the report</div>
            )}
        </div>
    );
}

function KpiCard({ label, value, color, sub, highlight }: {
    label: string;
    value: number;
    color: 'green' | 'blue' | 'red' | 'emerald';
    sub?: string;
    highlight?: boolean;
}) {
    const colorMap = {
        green: 'text-green-700',
        blue: 'text-blue-700',
        red: 'text-red-600',
        emerald: 'text-emerald-700',
    };
    const iconMap = {
        green: <TrendingUp size={16} className="text-green-500" />,
        blue: <TrendingUp size={16} className="text-blue-500" />,
        red: <TrendingDown size={16} className="text-red-500" />,
        emerald: <TrendingUp size={16} className="text-emerald-500" />,
    };
    return (
        <div className={cn('bg-white rounded-xl border p-5', highlight ? 'border-[#F59E0B] shadow-md' : 'border-slate-200 shadow-sm')}>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
            <div className="flex items-center gap-2 mt-2">
                {iconMap[color]}
                <p className={cn('text-xl font-bold', colorMap[color])}>{fmt(value)}</p>
            </div>
            {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
    );
}

function PLRow({ label, amount, deduction, sub, bold, borderTop, positive, highlight }: {
    label: string;
    amount: number;
    deduction?: boolean;
    sub?: boolean;
    bold?: boolean;
    borderTop?: boolean;
    positive?: boolean;
    highlight?: boolean;
}) {
    const isNeg = deduction || (positive === false);
    return (
        <tr className={cn(
            'border-b border-slate-100',
            borderTop && 'border-t-2 border-slate-300',
            highlight && (positive !== false ? 'bg-emerald-50' : 'bg-red-50'),
            bold && 'bg-slate-50'
        )}>
            <td className={cn('px-6 py-3 text-slate-700', sub && 'pl-10 text-sm text-slate-500', bold && 'font-bold')}>{label}</td>
            <td className={cn(
                'px-6 py-3 text-right font-mono font-medium',
                bold && 'font-bold',
                deduction ? 'text-red-600' : (positive === false ? 'text-red-600' : 'text-emerald-700')
            )}>
                {deduction ? `(${fmt(amount)})` : fmt(amount)}
            </td>
        </tr>
    );
}
