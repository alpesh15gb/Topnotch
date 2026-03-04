'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Users, Truck, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const fmt = (n: number) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

export default function OutstandingPage() {
    const [tab, setTab] = useState<'receivables' | 'payables'>('receivables');

    const { data: receivables, isLoading: loadingRec } = useQuery({
        queryKey: ['outstanding-receivables'],
        queryFn: async () => {
            const res = await api.get('/v1/reports/sales/outstanding');
            return res.data;
        },
    });

    const { data: payables, isLoading: loadingPay } = useQuery({
        queryKey: ['outstanding-payables'],
        queryFn: async () => {
            const res = await api.get('/v1/reports/purchases/outstanding');
            return res.data;
        },
    });

    const isLoading = tab === 'receivables' ? loadingRec : loadingPay;
    const rows = tab === 'receivables' ? receivables : payables;

    const totalReceivables = receivables?.reduce((s: number, r: any) => s + Number(r.total_outstanding), 0) ?? 0;
    const totalPayables = payables?.reduce((s: number, r: any) => s + Number(r.total_outstanding), 0) ?? 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Outstanding</h1>
                <p className="text-sm text-slate-500">Pending receivables from customers and payables to vendors</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => setTab('receivables')}
                    className={cn('rounded-xl border p-4 flex items-center gap-4 text-left transition-all',
                        tab === 'receivables' ? 'border-emerald-400 bg-emerald-50 shadow-sm' : 'border-slate-200 bg-white hover:border-emerald-300')}>
                    <div className="p-3 bg-emerald-100 rounded-lg"><ArrowUpRight className="text-emerald-600" size={22} /></div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Receivables (Customers)</p>
                        <p className="text-xl font-bold text-emerald-700">{fmt(totalReceivables)}</p>
                        <p className="text-xs text-slate-400">{receivables?.length ?? 0} customer(s)</p>
                    </div>
                </button>
                <button onClick={() => setTab('payables')}
                    className={cn('rounded-xl border p-4 flex items-center gap-4 text-left transition-all',
                        tab === 'payables' ? 'border-red-400 bg-red-50 shadow-sm' : 'border-slate-200 bg-white hover:border-red-300')}>
                    <div className="p-3 bg-red-100 rounded-lg"><ArrowDownRight className="text-red-600" size={22} /></div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Payables (Vendors)</p>
                        <p className="text-xl font-bold text-red-700">{fmt(totalPayables)}</p>
                        <p className="text-xs text-slate-400">{payables?.length ?? 0} vendor(s)</p>
                    </div>
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-2">
                    {tab === 'receivables'
                        ? <><Users size={16} className="text-emerald-500" /><h2 className="font-semibold text-slate-700">Customer Receivables</h2></>
                        : <><Truck size={16} className="text-red-500" /><h2 className="font-semibold text-slate-700">Vendor Payables</h2></>
                    }
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 text-xs text-slate-500 font-medium border-b border-slate-200">
                            <th className="px-5 py-3 text-left">{tab === 'receivables' ? 'Customer' : 'Vendor'}</th>
                            <th className="px-5 py-3 text-center">{tab === 'receivables' ? 'Invoices' : 'Bills'}</th>
                            <th className="px-5 py-3 text-center">Oldest</th>
                            <th className="px-5 py-3 text-right">Outstanding</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-5 py-4"><div className="h-4 bg-slate-200 rounded w-2/3" /></td>
                                    <td className="px-5 py-4"><div className="h-4 bg-slate-200 rounded w-8 mx-auto" /></td>
                                    <td className="px-5 py-4"><div className="h-4 bg-slate-200 rounded w-20 mx-auto" /></td>
                                    <td className="px-5 py-4"><div className="h-4 bg-slate-200 rounded w-24 ml-auto" /></td>
                                </tr>
                            ))
                        ) : rows?.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-5 py-12 text-center text-slate-400">
                                    No outstanding {tab === 'receivables' ? 'receivables' : 'payables'} 🎉
                                </td>
                            </tr>
                        ) : rows?.map((row: any, i: number) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-5 py-4">
                                    <Link href={`/masters/parties/${row.party?.id}`}
                                        className="font-medium text-slate-800 hover:text-[#F59E0B]">
                                        {row.party?.name}
                                    </Link>
                                </td>
                                <td className="px-5 py-4 text-center text-sm text-slate-600">
                                    {row.invoices_count ?? row.bills_count ?? 0}
                                </td>
                                <td className="px-5 py-4 text-center text-sm text-slate-500">
                                    {row.oldest_invoice_date ? new Date(row.oldest_invoice_date).toLocaleDateString('en-IN') : '—'}
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <span className={cn('font-bold', tab === 'receivables' ? 'text-emerald-700' : 'text-red-700')}>
                                        {fmt(row.total_outstanding)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    {rows?.length > 0 && (
                        <tfoot>
                            <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold">
                                <td className="px-5 py-3 text-sm">Total</td>
                                <td colSpan={2} />
                                <td className={cn('px-5 py-3 text-right text-sm', tab === 'receivables' ? 'text-emerald-700' : 'text-red-700')}>
                                    {fmt(tab === 'receivables' ? totalReceivables : totalPayables)}
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );
}
