'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plus, Search, FileSignature, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Cheque {
    id: number;
    number: string;
    date: string;
    type: 'issued' | 'received';
    status: 'pending' | 'cleared' | 'bounced' | 'cancelled';
    amount: number;
    party: {
        name: string;
    };
    bank_account: {
        name: string;
    };
}

const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    cleared: 'bg-emerald-100 text-emerald-700',
    bounced: 'bg-red-100 text-red-700',
    cancelled: 'bg-slate-200 text-slate-500',
};

const typeColors = {
    issued: 'text-rose-600 bg-rose-50 border-rose-200',
    received: 'text-emerald-600 bg-emerald-50 border-emerald-200',
};

export default function ChequesPage() {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('');

    const { data: cheques, isLoading } = useQuery({
        queryKey: ['cheques', search, filterType],
        queryFn: async () => {
            const res = await api.get('/v1/cheques', {
                params: { search, type: filterType }
            }).catch(() => ({ data: { data: [], current_page: 1, last_page: 1 } })); // Mock fallback
            return res.data;
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Cheque Management</h1>
                    <p className="text-sm text-slate-500">Track all post-dated and current cheques issued or received</p>
                </div>

                <Link
                    href="/banking/cheques/new"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>Record Cheque</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by cheque number, party..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
                        />
                    </div>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none bg-white min-w-[150px]"
                    >
                        <option value="">All Types</option>
                        <option value="issued">Issued (Outgoing)</option>
                        <option value="received">Received (Incoming)</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                                <th className="px-6 py-3 font-medium">Cheque Info</th>
                                <th className="px-6 py-3 font-medium">Party / Bank</th>
                                <th className="px-6 py-3 font-medium">Type & Status</th>
                                <th className="px-6 py-3 font-medium text-right">Amount</th>
                                <th className="px-6 py-3 font-medium w-12" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-full"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-200 rounded-full"></div></td>
                                        <td className="px-6 py-4 text-right"><div className="h-4 bg-slate-200 rounded w-1/2 ml-auto mb-2"></div></td>
                                        <td className="px-6 py-4"></td>
                                    </tr>
                                ))
                            ) : cheques?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileSignature size={48} className="text-slate-300 mb-4" />
                                            <p className="text-lg font-medium text-slate-700">No cheques found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                cheques?.data?.map((cheque: Cheque) => (
                                    <tr key={cheque.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800">
                                                #{cheque.number}
                                            </div>
                                            <div className="text-sm text-slate-500 mt-0.5">
                                                {format(new Date(cheque.date), 'dd MMM yyyy')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-700">
                                                {cheque.party.name}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-0.5">
                                                {cheque.bank_account.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className={cn(
                                                    "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border",
                                                    typeColors[cheque.type]
                                                )}>
                                                    {cheque.type}
                                                </span>
                                                <span className={cn(
                                                    "px-2 py-0.5 text-xs font-semibold rounded-full",
                                                    statusColors[cheque.status]
                                                )}>
                                                    {cheque.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className={cn(
                                                "font-bold",
                                                cheque.type === 'received' ? "text-emerald-600" : "text-slate-800"
                                            )}>
                                                {cheque.type === 'received' ? '+' : '-'} ₹{cheque.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="flex justify-end gap-2">
                                                {cheque.status === 'pending' && (
                                                    <>
                                                        <button
                                                            title="Mark Cleared"
                                                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                        <button
                                                            title="Mark Bounced"
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
