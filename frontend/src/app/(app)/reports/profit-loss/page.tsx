'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { TrendingUp, TrendingDown, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

const fmt = (n: number) => '₹' + Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });
const pct = (n: number) => (n >= 0 ? '+' : '') + n.toFixed(1) + '%';

export default function ProfitLossPage() {
    const now = new Date();
    const [fromDate, setFromDate] = useState(format(startOfMonth(now), 'yyyy-MM-dd'));
    const [toDate, setToDate] = useState(format(endOfMonth(now), 'yyyy-MM-dd'));

    const { data, isLoading, refetch } = useQuery({
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
                    <h1 className="text-2xl font-bold text-slate-800">Profit & Loss</h1>
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
                    <button onClick={() => refetch()} className="px-4 py-2 bg-[#0F172A] text-white text-sm rounded-lg hover:bg-[#1e3a5f]">
                        Apply
                    </button>
                </div>
            </div>

            {isLoading ? (
                <LoadingCard />
            ) : data ? (
                <div className="space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <KpiCard label="Revenue" value={data.revenue} positive />
                        <KpiCard label="Gross Profit" value={data.gross_profit} positive={data.gross_profit >= 0}
                            sub={pct(data.gross_margin_pct) + ' margin'} />
                        <KpiCard label="Operating Expenses" value={data.operating_expenses} positive={false} />
                        <KpiCard label="Net Profit" value={data.net_profit} positive={data.net_profit >= 0}
                            sub={pct(data.net_margin_pct) + ' margin'} highlight />
                    </div>

                    {/* P&L Statement */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                            <h2 className="font-semibold text-slate-800">Statement of Profit & Loss</h2>
                            <span className="text-sm text-slate-500">
                                {format(new Date(fromDate), 'dd MMM yyyy')} – {format(new Date(toDate), 'dd MMM yyyy')}
                            </span>
                        </div>
                        <table className="w-full">
                            <tbody>
                                <PLRow label="Gross Revenue (Sales)" amount={data.revenue} className="font-medium" />
                                <PLRow label="Cost of Goods Sold (Purchases)" amount={-data.cogs} deduction />
                                <PLRow label="Gross Profit" amount={data.gross_profit} className="font-bold border-t-2 border-slate-300 bg-slate-50" />
                                <tr><td colSpan={2} className="px-6 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide bg-slate-50/50">Operating Expenses</td></tr>
                                <PLRow label="Other Expenses" amount={-data.operating_expenses} deduction sub />
                                <PLRow label="Net Profit / (Loss)" amount={data.net_profit}
                                    className={cn('font-bold border-t-2 border-slate-300', data.net_profit >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50')} />
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 text-slate-400">Select a date range and click Apply</div>
            )}
        </div>
    );
}

function KpiCard({ label, value, positive, sub, highlight }: { label: string; value: number; positive: boolean; sub?: string; highlight?: boolean }) {
    return (
        <div className={cn('rounded-xl border p-4', highlight ? 'border-[#F59E0B] bg-amber-50' : 'border-slate-200 bg-white')}>
            <p className="text-xs text-slate-500 font-medium">{label}</p>
            <div className="flex items-center gap-2 mt-1">
                {positive ? <TrendingUp size={16} className="text-emerald-500" /> : <TrendingDown size={16} className="text-red-500" />}
                <p className={cn('text-xl font-bold', positive ? 'text-emerald-700' : 'text-red-700')}>{fmt(value)}</p>
            </div>
            {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
    );
}

function PLRow({ label, amount, className, deduction, sub }: { label: string; amount: number; className?: string; deduction?: boolean; sub?: boolean }) {
    return (
        <tr className={cn('border-b border-slate-100', className)}>
            <td className={cn('px-6 py-3 text-slate-700', sub && 'pl-10 text-sm text-slate-500')}>{label}</td>
            <td className={cn('px-6 py-3 text-right font-mono font-medium', deduction || amount < 0 ? 'text-red-600' : 'text-emerald-700')}>
                {deduction ? `(${fmt(Math.abs(amount))})` : fmt(amount)}
            </td>
        </tr>
    );
}

function LoadingCard() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F59E0B]" />
        </div>
    );
}
