'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
    IndianRupee,
    TrendingUp,
    TrendingDown,
    ShoppingBag,
    CreditCard
} from 'lucide-react';

interface KPIData {
    label: string;
    value: number;
    trend: number;
    icon: React.ElementType;
    className: string;
}

export default function DashboardPage() {
    const { data: salesSummary, isLoading: loadingSales } = useQuery({
        queryKey: ['dashboard', 'sales-summary'],
        queryFn: async () => {
            const res = await api.get('/v1/reports/sales/summary');
            return res.data;
        }
    });

    const { data: outstanding, isLoading: loadingOutstanding } = useQuery({
        queryKey: ['dashboard', 'outstanding'],
        queryFn: async () => {
            const res = await api.get('/v1/reports/sales/outstanding');
            return res.data;
        }
    });

    const kpis: KPIData[] = [
        {
            label: "Total Revenue (This Month)",
            value: salesSummary?.total_revenue || 0,
            trend: 12.5,
            icon: IndianRupee,
            className: "text-[#F59E0B] bg-[#FFFBEB]",
        },
        {
            label: "Pending Receivables",
            value: outstanding?.total_outstanding || 0,
            trend: -2.4,
            icon: TrendingUp,
            className: "text-blue-600 bg-blue-50",
        },
        {
            label: "Total Purchases",
            value: 0, // Placeholder mapping
            trend: 4.1,
            icon: ShoppingBag,
            className: "text-emerald-600 bg-emerald-50",
        },
        {
            label: "Total Expenses",
            value: 0, // Placeholder mapping
            trend: -1.2,
            icon: CreditCard,
            className: "text-rose-600 bg-rose-50",
        }
    ];

    if (loadingSales || loadingOutstanding) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 w-48 bg-slate-200 rounded-md"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                <div className="flex gap-2 text-sm text-slate-500">
                    <span>Overview of your business</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 flex items-start justify-between shadow-sm hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{kpi.label}</p>
                            <h3 className="text-2xl font-bold text-slate-800">
                                ₹{kpi.value.toLocaleString('en-IN')}
                            </h3>

                            <div className="flex items-center gap-2 mt-4 text-sm">
                                <span className={`flex items-center gap-0.5 font-medium ${kpi.trend > 0 ? 'text-emerald-600' : 'text-rose-600'
                                    }`}>
                                    {kpi.trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    {Math.abs(kpi.trend)}%
                                </span>
                                <span className="text-slate-400">vs last month</span>
                            </div>
                        </div>

                        <div className={`p-3 rounded-lg ${kpi.className}`}>
                            <kpi.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Revenue Trend</h3>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg text-slate-400">
                        Chart Component Placeholder (Recharts)
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Invoices</h3>
                    <div className="space-y-4">
                        <div className="text-center py-8 text-slate-500 text-sm">
                            List of recent invoices will appear here
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
