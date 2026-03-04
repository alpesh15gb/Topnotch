'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plus, Search, Receipt, Download, Paperclip } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Expense {
    id: number;
    date: string;
    category: string;
    amount: number;
    payment_mode: string;
    vendor_name?: string;
    reference_number?: string;
    has_receipt: boolean;
    status: 'draft' | 'posted';
}

const statusColors = {
    draft: 'bg-slate-100 text-slate-700',
    posted: 'bg-emerald-100 text-emerald-700',
};

const statusLabels = {
    draft: 'Draft',
    posted: 'Posted/Paid',
};

export default function ExpensesPage() {
    const [search, setSearch] = useState('');

    const { data: expenses, isLoading } = useQuery({
        queryKey: ['expenses', search],
        queryFn: async () => {
            const res = await api.get('/v1/expenses', {
                params: { search }
            }).catch(() => ({ data: { data: [], current_page: 1, last_page: 1 } }));
            return res.data;
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Expenses</h1>
                    <p className="text-sm text-slate-500">Track and manage direct and indirect business expenses</p>
                </div>

                <Link
                    href="/purchases/expenses/new"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>Record Expense</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search expenses by category or vendor..."
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
                                <th className="px-6 py-3 font-medium">Date & Details</th>
                                <th className="px-6 py-3 font-medium">Category</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Amount</th>
                                <th className="px-6 py-3 font-medium w-12" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="h-4 bg-slate-200 rounded w-1/2 ml-auto mb-2"></div>
                                        </td>
                                        <td className="px-6 py-4"></td>
                                    </tr>
                                ))
                            ) : expenses?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Receipt size={48} className="text-slate-300 mb-4" />
                                            <p className="text-lg font-medium text-slate-700">No expenses found</p>
                                            <p className="text-sm mt-1">Try adjusting filters or record a new expense.</p>
                                            <Link
                                                href="/purchases/expenses/new"
                                                className="mt-4 px-4 py-2 bg-[#F59E0B] text-[#0F172A] font-medium rounded-lg hover:bg-[#D97706] transition-colors"
                                            >
                                                Record Expense
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                expenses?.data?.map((expense: Expense) => (
                                    <tr key={expense.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <Link href={`/purchases/expenses/${expense.id}`} className="block">
                                                <div className="font-bold text-slate-800 group-hover:text-[#F59E0B] transition-colors">
                                                    {format(new Date(expense.date), 'dd MMM yyyy')}
                                                </div>
                                                <div className="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
                                                    {expense.vendor_name || 'No vendor'}

                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-slate-700">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 text-xs font-semibold rounded-full border border-transparent",
                                                statusColors[expense.status]
                                            )}>
                                                {statusLabels[expense.status]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="font-bold text-slate-800">
                                                ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </div>
                                            <div className="text-xs text-slate-400 capitalize mt-0.5">
                                                {expense.payment_mode}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    title="Download PDF"
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                >
                                                    <Download size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
                    <div>Showing {expenses?.data?.length || 0} records</div>
                    {expenses?.last_page > 1 && (
                        <div className="flex gap-1">
                            <span>Page {expenses?.current_page} of {expenses?.last_page}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
