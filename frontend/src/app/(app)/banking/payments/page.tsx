'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plus, Search, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Payment {
    id: number;
    payment_number: string;
    date: string;
    amount: number;
    payment_mode: string;
    reference_number?: string;
    party: {
        id: number;
        name: string;
    };
    bills: { number: string; amount_applied: number }[];
}

export default function PaymentsPage() {
    const [search, setSearch] = useState('');

    const { data: payments, isLoading } = useQuery({
        queryKey: ['payments', search],
        queryFn: async () => {
            const res = await api.get('/v1/payments', {
                params: { search }
            }).catch(() => ({ data: { data: [], current_page: 1, last_page: 1 } }));
            return res.data;
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Payments Made</h1>
                    <p className="text-sm text-slate-500">Record money paid to vendors and suppliers</p>
                </div>

                <Link
                    href="/banking/payments/new"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>Record Payment</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by payment number, vendor..."
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
                                <th className="px-6 py-3 font-medium">Date & No.</th>
                                <th className="px-6 py-3 font-medium">Vendor</th>
                                <th className="px-6 py-3 font-medium">Payment Mode</th>
                                <th className="px-6 py-3 font-medium text-right">Amount Paid</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-full"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                                        <td className="px-6 py-4 text-right"><div className="h-4 bg-slate-200 rounded w-1/2 ml-auto mb-2"></div></td>
                                    </tr>
                                ))
                            ) : payments?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <ArrowUpRight size={48} className="text-rose-300 mb-4" />
                                            <p className="text-lg font-medium text-slate-700">No payments found</p>
                                            <Link
                                                href="/banking/payments/new"
                                                className="mt-4 px-4 py-2 bg-[#F59E0B] text-[#0F172A] font-medium rounded-lg hover:bg-[#D97706] transition-colors"
                                            >
                                                Record Money Out
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                payments?.data?.map((payment: Payment) => (
                                    <tr key={payment.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800">
                                                {payment.payment_number}
                                            </div>
                                            <div className="text-sm text-slate-500 mt-0.5">
                                                {format(new Date(payment.date), 'dd MMM yyyy')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/masters/parties/${payment.party.id}`} className="font-medium text-slate-700 hover:text-blue-600 transition-colors">
                                                {payment.party.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <span className="capitalize">{payment.payment_mode}</span>
                                            {payment.reference_number && <span className="text-slate-400 block text-xs">Ref: {payment.reference_number}</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="font-bold text-rose-600">
                                                ₹{payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
