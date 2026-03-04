'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Search, ArrowRightLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function FundTransfersPage() {
    const [search, setSearch] = useState('');

    const { data: transfers, isLoading } = useQuery({
        queryKey: ['fund_transfers', search],
        queryFn: async () => {
            const res = await api.get('/v1/fund-transfers', {
                params: { search }
            }).catch(() => ({ data: { data: [], current_page: 1, last_page: 1 } })); // Mock fallback
            return res.data;
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Fund Transfers (Contra)</h1>
                    <p className="text-sm text-slate-500">Record transfers between company bank and cash accounts</p>
                </div>

                <Link
                    href="/banking/fund-transfers/new"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#F59E0B] text-[#0F172A] font-bold rounded-lg hover:bg-[#D97706] transition-colors shadow-sm"
                >
                    <ArrowRightLeft size={18} />
                    <span>New Transfer</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search transfers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                                <th className="px-6 py-3 font-medium">Date & Ref</th>
                                <th className="px-6 py-3 font-medium">From Account</th>
                                <th className="px-6 py-3 font-medium">To Account</th>
                                <th className="px-6 py-3 font-medium text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {isLoading ? (
                                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">Loading...</td></tr>
                            ) : transfers?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <ArrowRightLeft size={48} className="text-slate-300 mb-4" />
                                            <p className="text-lg font-medium text-slate-700">No recent transfers</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                transfers?.data?.map((transfer: any) => (
                                    <tr key={transfer.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800">
                                                {format(new Date(transfer.date), 'dd MMM yyyy')}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-0.5">Ref: {transfer.reference_number || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-rose-600">
                                            {transfer.from_account.name}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-emerald-600 flex items-center gap-2">
                                            <ArrowRight size={14} className="text-slate-400" />
                                            {transfer.to_account.name}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-800">
                                            ₹{transfer.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
