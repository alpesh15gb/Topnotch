'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plus, Search, Building2 } from 'lucide-react';
import Link from 'next/link';

interface Loan {
    id: number;
    name: string;
    type: 'secured' | 'unsecured';
    lender: string;
    principal_amount: number;
    remaining_balance: number;
    interest_rate: number;
}

export default function LoansPage() {
    const [search, setSearch] = useState('');

    const { data: loans, isLoading } = useQuery({
        queryKey: ['loans', search],
        queryFn: async () => {
            const res = await api.get('/v1/loans', {
                params: { search }
            }).catch(() => ({ data: { data: [], current_page: 1, last_page: 1 } })); // Mock fallback
            return res.data;
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Loans & Borrowings</h1>
                    <p className="text-sm text-slate-500">Manage business loans, EDIs, and credit facilities</p>
                </div>

                <Link
                    href="/banking/loans/new"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>Add Loan Account</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by loan name, lender..."
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
                                <th className="px-6 py-3 font-medium">Loan Details</th>
                                <th className="px-6 py-3 font-medium">Type</th>
                                <th className="px-6 py-3 font-medium text-right">Principal</th>
                                <th className="px-6 py-3 font-medium text-right">Remaining Balance</th>
                                <th className="px-6 py-3 font-medium w-32 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-full"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-full"></div></td>
                                        <td className="px-6 py-4"></td>
                                    </tr>
                                ))
                            ) : loans?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Building2 size={48} className="text-slate-300 mb-4" />
                                            <p className="text-lg font-medium text-slate-700">No active loans found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                loans?.data?.map((loan: Loan) => (
                                    <tr key={loan.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800">{loan.name}</div>
                                            <div className="text-sm text-slate-500 mt-0.5">{loan.lender} ({loan.interest_rate}% p.a)</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 capitalize">
                                            {loan.type}
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-slate-800">
                                            ₹{loan.principal_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-rose-600">
                                            ₹{loan.remaining_balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/banking/loans/${loan.id}`}
                                                className="text-sm text-[#F59E0B] hover:text-[#D97706] font-medium"
                                            >
                                                View Ledgers
                                            </Link>
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
