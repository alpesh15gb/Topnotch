'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
    IndianRupee, TrendingUp, TrendingDown, ShoppingBag, CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-600',
    posted: 'bg-blue-100 text-blue-700',
    partially_paid: 'bg-amber-100 text-amber-700',
    paid: 'bg-emerald-100 text-emerald-700',
    overdue: 'bg-rose-100 text-rose-700',
    cancelled: 'bg-slate-200 text-slate-500',
};

const fmt = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function DashboardPage() {
    const now = new Date();

    const { data: salesSummary } = useQuery({
        queryKey: ['dashboard', 'sales-summary'],
        queryFn: async () => (await api.get('/v1/reports/sales/summary')).data,
    });

    const { data: outstanding } = useQuery({
        queryKey: ['dashboard', 'outstanding'],
        queryFn: async () => (await api.get('/v1/reports/sales/outstanding')).data,
    });

    const { data: purchaseSummary } = useQuery({
        queryKey: ['dashboard', 'purchase-summary'],
        queryFn: async () => (await api.get('/v1/reports/purchases/summary')).data.catch?.(() => null) || (await api.get('/v1/reports/purchases/summary')).data,
    });

    // Last 6 months revenue chart data
    const { data: chartData } = useQuery({
        queryKey: ['dashboard', 'chart'],
        queryFn: async () => {
            const months = Array.from({ length: 6 }, (_, i) => {
                const d = subMonths(now, 5 - i);
                return {
                    label: format(d, 'MMM'),
                    from: format(startOfMonth(d), 'yyyy-MM-dd'),
                    to: format(endOfMonth(d), 'yyyy-MM-dd'),
                };
            });
            const results = await Promise.all(
                months.map(m =>
                    api.get('/v1/reports/sales/summary', { params: { from_date: m.from, to_date: m.to } })
                        .then(r => ({ month: m.label, revenue: r.data?.total_revenue || 0 }))
                        .catch(() => ({ month: m.label, revenue: 0 }))
                )
            );
            return results;
        },
        staleTime: 5 * 60 * 1000,
    });

    // Recent invoices
    const { data: recentInvoices } = useQuery({
        queryKey: ['dashboard', 'recent-invoices'],
        queryFn: async () => {
            const res = await api.get('/v1/invoices', { params: { per_page: 6, sort: 'latest' } });
            return res.data?.data || [];
        },
    });

    const kpis = [
        {
            label: 'Revenue (This Month)',
            value: salesSummary?.total_revenue || 0,
            icon: IndianRupee,
            iconClass: 'text-[#F59E0B] bg-[#FFFBEB]',
        },
        {
            label: 'Pending Receivables',
            value: outstanding?.total_outstanding || 0,
            icon: TrendingUp,
            iconClass: 'text-blue-600 bg-blue-50',
        },
        {
            label: 'Total Purchases',
            value: purchaseSummary?.total_purchases || 0,
            icon: ShoppingBag,
            iconClass: 'text-emerald-600 bg-emerald-50',
        },
        {
            label: 'Total Expenses',
            value: salesSummary?.total_expenses || 0,
            icon: CreditCard,
            iconClass: 'text-rose-600 bg-rose-50',
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                <p className="text-sm text-slate-500">{format(now, 'dd MMMM yyyy')}</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 flex items-start justify-between shadow-sm hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{kpi.label}</p>
                            <h3 className="text-2xl font-bold text-slate-800">{fmt(kpi.value)}</h3>
                        </div>
                        <div className={cn('p-3 rounded-lg', kpi.iconClass)}>
                            <kpi.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart + Recent Invoices */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Revenue Trend Chart */}
                <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Revenue Trend (Last 6 Months)</h3>
                    {chartData && chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={v => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`}
                                />
                                <Tooltip
                                    formatter={(v: number) => [fmt(v), 'Revenue']}
                                    contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#F59E0B"
                                    strokeWidth={2.5}
                                    fill="url(#revGrad)"
                                    dot={{ fill: '#F59E0B', r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-60 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F59E0B]" />
                        </div>
                    )}
                </div>

                {/* Recent Invoices */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800">Recent Invoices</h3>
                        <Link href="/sales/invoices" className="text-xs text-[#F59E0B] font-semibold hover:underline">
                            View All
                        </Link>
                    </div>
                    {!recentInvoices ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse flex justify-between">
                                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                                </div>
                            ))}
                        </div>
                    ) : recentInvoices.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm text-center py-8">
                            No invoices yet.<br />
                            <Link href="/sales/invoices/new" className="text-[#F59E0B] font-medium mt-1 inline-block">Create one</Link>
                        </div>
                    ) : (
                        <div className="space-y-3 flex-1">
                            {recentInvoices.map((inv: any) => (
                                <Link
                                    key={inv.id}
                                    href={`/sales/invoices/${inv.id}`}
                                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 hover:opacity-80 transition-opacity"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{inv.number}</p>
                                        <p className="text-xs text-slate-500 truncate">{inv.party?.name}</p>
                                    </div>
                                    <div className="flex flex-col items-end ml-3 shrink-0">
                                        <span className="text-sm font-bold text-slate-800">
                                            {fmt(inv.total || inv.total_amount || 0)}
                                        </span>
                                        <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5', statusColors[inv.status] || statusColors.draft)}>
                                            {inv.status?.replace('_', ' ')}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'New Invoice', href: '/sales/invoices/new', color: 'bg-amber-50 border-amber-200 text-amber-700' },
                    { label: 'New Purchase Bill', href: '/purchases/bills/new', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
                    { label: 'Add Expense', href: '/purchases/expenses/new', color: 'bg-rose-50 border-rose-200 text-rose-700' },
                    { label: 'New Estimate', href: '/sales/estimates/new', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                ].map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn('border rounded-xl p-4 text-sm font-semibold text-center hover:shadow-md transition-shadow', link.color)}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
