'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { Receipt, BarChart3, CreditCard, Clock, TrendingUp, DollarSign, FileSpreadsheet } from 'lucide-react';

const fmt = (n: number) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

export default function SalesReportPage() {
    const now = new Date();
    const [fromDate, setFromDate] = useState(format(startOfMonth(now), 'yyyy-MM-dd'));
    const [toDate, setToDate] = useState(format(endOfMonth(now), 'yyyy-MM-dd'));
    const [applied, setApplied] = useState({ from: format(startOfMonth(now), 'yyyy-MM-dd'), to: format(endOfMonth(now), 'yyyy-MM-dd') });

    const { data, isLoading } = useQuery({
        queryKey: ['sales-report', applied.from, applied.to],
        queryFn: async () => {
            const res = await api.get('/v1/reports/sales/summary', {
                params: { from_date: applied.from, to_date: applied.to },
            });
            return res.data;
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Sales Report</h1>
                    <p className="text-sm text-slate-500">Detailed sales performance for the selected period</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-2 shadow-sm">
                        <span className="text-xs text-slate-500">From</span>
                        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="text-sm outline-none" />
                        <span className="text-xs text-slate-400 mx-1">—</span>
                        <span className="text-xs text-slate-500">To</span>
                        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="text-sm outline-none" />
                    </div>
                    <button onClick={() => setApplied({ from: fromDate, to: toDate })}
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
                <div className="space-y-6">
                    {/* 6 KPI Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <MetricCard label="Total Invoices" value={data.total_invoices} icon={<Receipt size={20} className="text-blue-500" />} isCount bg="bg-blue-50" />
                        <MetricCard label="Sales Amount (Subtotal)" value={data.sales} icon={<BarChart3 size={20} className="text-violet-500" />} bg="bg-violet-50" />
                        <MetricCard label="Tax Collected (GST)" value={data.tax} icon={<TrendingUp size={20} className="text-rose-500" />} bg="bg-rose-50" />
                        <MetricCard label="Revenue Collected" value={data.collected} icon={<CreditCard size={20} className="text-emerald-500" />} bg="bg-emerald-50" />
                        <MetricCard label="Outstanding" value={data.outstanding} icon={<Clock size={20} className="text-amber-500" />} bg="bg-amber-50" />
                        <MetricCard label="Total Revenue (with GST)" value={data.revenue} icon={<DollarSign size={20} className="text-slate-600" />} bg="bg-slate-50" bold />
                    </div>

                    {/* Export Button */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-800">Export Data</h3>
                                <p className="text-sm text-slate-500 mt-0.5">Download sales data for further analysis</p>
                            </div>
                            <div className="relative group">
                                <button
                                    disabled
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-lg cursor-not-allowed text-sm font-medium border border-slate-200"
                                >
                                    <FileSpreadsheet size={16} />
                                    Export to Excel
                                </button>
                                <div className="absolute right-0 top-full mt-1 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    Coming soon
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Note */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                        <p className="font-semibold mb-1">Detailed Invoice-level Breakdown</p>
                        <p>Detailed invoice-level breakdown is available in <strong>Sales → Invoices</strong>. Use the filters there to view individual transactions for the period.</p>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 text-slate-400">Select a period and click Apply</div>
            )}
        </div>
    );
}

function MetricCard({ label, value, icon, isCount, bg, bold }: {
    label: string;
    value: number;
    icon: React.ReactNode;
    isCount?: boolean;
    bg?: string;
    bold?: boolean;
}) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className={`inline-flex p-2 rounded-lg mb-3 ${bg ?? 'bg-slate-50'}`}>
                {icon}
            </div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
            <p className={`text-xl mt-1 ${bold ? 'font-extrabold text-slate-900' : 'font-bold text-slate-800'}`}>
                {isCount ? Number(value).toLocaleString('en-IN') : ('₹' + Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2 }))}
            </p>
        </div>
    );
}
