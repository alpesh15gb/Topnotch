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

    const balanced = data ? Math.abs(Number(data.total_assets) - Number(data.total_liabilities_equity)) < 0.01 : true;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Balance Sheet</h1>
                    <p className="text-sm text-slate-500">Financial position as of a specific date</p>
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
                <div className="space-y-5">
                    {/* Balance Check Banner */}
                    <div className={cn(
                        'rounded-xl border p-4 flex items-center gap-3',
                        balanced ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
                    )}>
                        <Scale size={20} className={balanced ? 'text-emerald-600' : 'text-red-600'} />
                        <div className="text-sm font-medium text-slate-700">
                            <span>Total Assets: <strong className="text-slate-900">{fmt(data.total_assets)}</strong></span>
                            <span className="mx-3 text-slate-400">=</span>
                            <span>Total Liabilities + Equity: <strong className="text-slate-900">{fmt(data.total_liabilities_equity)}</strong></span>
                            {!balanced && <span className="ml-3 text-red-600 font-semibold">— Balance mismatch!</span>}
                        </div>
                    </div>

                    {/* Three-column layout: Assets | Liabilities | Equity */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {/* Assets */}
                        <div className="space-y-4">
                            <BSSection
                                title="Current Assets"
                                color="emerald"
                                items={data.assets?.current ?? []}
                            />
                            <BSSection
                                title="Fixed Assets"
                                color="emerald"
                                items={data.assets?.fixed ?? []}
                            />
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex justify-between items-center">
                                <span className="font-bold text-emerald-800">Total Assets</span>
                                <span className="font-bold text-emerald-800 font-mono">{fmt(data.assets?.total ?? data.total_assets)}</span>
                            </div>
                        </div>

                        {/* Liabilities */}
                        <div className="space-y-4">
                            <BSSection
                                title="Current Liabilities"
                                color="red"
                                items={data.liabilities?.current ?? []}
                            />
                            <BSSection
                                title="Long-term Liabilities"
                                color="red"
                                items={data.liabilities?.long_term ?? []}
                            />
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex justify-between items-center">
                                <span className="font-bold text-red-800">Total Liabilities</span>
                                <span className="font-bold text-red-800 font-mono">{fmt(data.liabilities?.total ?? 0)}</span>
                            </div>
                        </div>

                        {/* Equity */}
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-5 py-3 border-b border-slate-200 bg-blue-50">
                                    <h3 className="font-semibold text-sm text-blue-800">Equity</h3>
                                </div>
                                <table className="w-full">
                                    <tbody className="divide-y divide-slate-100">
                                        <tr className="hover:bg-slate-50">
                                            <td className="px-5 py-2.5 text-sm text-slate-700">Capital</td>
                                            <td className="px-5 py-2.5 text-right text-sm font-mono font-medium text-slate-800">{fmt(data.equity?.capital ?? 0)}</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50">
                                            <td className="px-5 py-2.5 text-sm text-slate-700">Retained Earnings</td>
                                            <td className="px-5 py-2.5 text-right text-sm font-mono font-medium text-slate-800">{fmt(data.equity?.retained_earnings ?? 0)}</td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 border-slate-200 bg-slate-50">
                                            <td className="px-5 py-2.5 text-sm font-bold text-slate-700">Total Equity</td>
                                            <td className="px-5 py-2.5 text-right text-sm font-mono font-bold text-blue-700">{fmt(data.equity?.total ?? 0)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex justify-between items-center">
                                <span className="font-bold text-blue-800">Liabilities + Equity</span>
                                <span className="font-bold text-blue-800 font-mono">{fmt(data.total_liabilities_equity)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 text-slate-400">Select a date and click Apply</div>
            )}
        </div>
    );
}

function BSSection({ title, color, items }: {
    title: string;
    color: 'emerald' | 'red' | 'blue';
    items: { name: string; balance: number }[];
}) {
    const total = items.reduce((s, r) => s + Number(r.balance), 0);
    const headerBg = { emerald: 'bg-emerald-50 text-emerald-800', red: 'bg-red-50 text-red-800', blue: 'bg-blue-50 text-blue-800' };
    const totalColor = { emerald: 'text-emerald-700', red: 'text-red-700', blue: 'text-blue-700' };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className={cn('px-5 py-3 border-b border-slate-200 font-semibold text-sm', headerBg[color])}>
                {title}
            </div>
            <table className="w-full">
                <tbody className="divide-y divide-slate-100">
                    {items.length === 0 ? (
                        <tr><td colSpan={2} className="px-5 py-4 text-center text-slate-400 text-sm">No accounts</td></tr>
                    ) : items.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                            <td className="px-5 py-2.5 text-sm text-slate-700">{item.name}</td>
                            <td className="px-5 py-2.5 text-right text-sm font-mono font-medium text-slate-800">{fmt(item.balance)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="border-t border-slate-200 bg-slate-50">
                        <td className="px-5 py-2 text-xs font-bold text-slate-500 uppercase">Subtotal</td>
                        <td className={cn('px-5 py-2 text-right text-sm font-mono font-bold', totalColor[color])}>{fmt(total)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}
