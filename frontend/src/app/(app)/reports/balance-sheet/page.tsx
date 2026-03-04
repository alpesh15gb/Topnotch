'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { format } from 'date-fns';
import { Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

const fmt = (n: number) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

export default function BalanceSheetPage() {
    const [asOfDate, setAsOfDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [applied, setApplied] = useState(format(new Date(), 'yyyy-MM-dd'));

    const { data, isLoading } = useQuery({
        queryKey: ['balance-sheet', applied],
        queryFn: async () => {
            const res = await api.get('/v1/reports/balance-sheet', { params: { as_of_date: applied } });
            return res.data;
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Balance Sheet</h1>
                    <p className="text-sm text-slate-500">Financial snapshot of assets, liabilities and equity</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-2 shadow-sm">
                        <span className="text-xs text-slate-500">As of</span>
                        <input type="date" value={asOfDate} onChange={(e) => setAsOfDate(e.target.value)}
                            className="text-sm outline-none" />
                    </div>
                    <button onClick={() => setApplied(asOfDate)}
                        className="px-4 py-2 bg-[#0F172A] text-white text-sm rounded-lg hover:bg-[#1e3a5f]">
                        Apply
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F59E0B]" />
                </div>
            ) : data ? (
                <div className="space-y-4">
                    {/* Balance check */}
                    <div className={cn(
                        'rounded-xl border p-4 flex items-center gap-3',
                        Math.abs(data.total_assets - data.total_liabilities_equity) < 0.01
                            ? 'border-emerald-200 bg-emerald-50'
                            : 'border-red-200 bg-red-50'
                    )}>
                        <Scale size={20} className={data.total_assets === data.total_liabilities_equity ? 'text-emerald-600' : 'text-red-600'} />
                        <span className="text-sm font-medium text-slate-700">
                            Total Assets: <strong>{fmt(data.total_assets)}</strong>
                            &nbsp;=&nbsp;
                            Total Liabilities + Equity: <strong>{fmt(data.total_liabilities_equity)}</strong>
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AccountSection title="Assets" color="emerald" rows={data.assets} totalKey="debit" />
                        <div className="space-y-4">
                            <AccountSection title="Liabilities" color="red" rows={data.liabilities} totalKey="credit" />
                            <AccountSection title="Equity" color="blue" rows={data.equity} totalKey="credit" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 text-slate-400">Select a date and click Apply</div>
            )}
        </div>
    );
}

function AccountSection({ title, color, rows, totalKey }: {
    title: string;
    color: 'emerald' | 'red' | 'blue';
    rows: any[];
    totalKey: 'debit' | 'credit';
}) {
    const total = rows?.reduce((s: number, r: any) => s + Number(r[totalKey] ?? 0), 0) ?? 0;
    const colorMap = { emerald: 'text-emerald-700 bg-emerald-50 border-emerald-200', red: 'text-red-700 bg-red-50 border-red-200', blue: 'text-blue-700 bg-blue-50 border-blue-200' };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className={cn('px-5 py-3 border-b font-semibold text-sm', colorMap[color])}>
                {title}
            </div>
            <table className="w-full">
                <thead>
                    <tr className="bg-slate-50 text-xs text-slate-500 border-b border-slate-200">
                        <th className="px-5 py-2 text-left font-medium">Account</th>
                        <th className="px-5 py-2 text-right font-medium">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {rows?.length === 0 ? (
                        <tr><td colSpan={2} className="px-5 py-4 text-center text-slate-400 text-sm">No accounts</td></tr>
                    ) : rows?.map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50">
                            <td className="px-5 py-2.5 text-sm text-slate-700">{row.account?.name ?? row.account}</td>
                            <td className="px-5 py-2.5 text-right text-sm font-mono font-medium text-slate-800">
                                {fmt(Number(row[totalKey] ?? 0))}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold">
                        <td className="px-5 py-2.5 text-sm">Total {title}</td>
                        <td className="px-5 py-2.5 text-right text-sm font-mono">{fmt(total)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}
