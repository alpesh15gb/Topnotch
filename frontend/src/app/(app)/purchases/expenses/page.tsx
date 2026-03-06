'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plus, Search, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

interface Expense {
    id: number;
    date: string;
    category: string;
    description: string;
    amount: number;
    tax_amount: number;
    account: { name: string } | null;
    party: { name: string } | null;
}

const EXPENSE_CATEGORIES = [
    'Travel',
    'Office',
    'Meals',
    'Utilities',
    'Salaries',
    'Other',
];

export default function ExpensesPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    const { data: expenses, isLoading } = useQuery({
        queryKey: ['expenses', search, category],
        queryFn: async () => {
            const res = await api.get('/v1/expenses', {
                params: { search: search || undefined, category: category || undefined }
            });
            return res.data;
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Expenses</h1>
                    <p className="text-sm text-slate-500">Track and manage business expenses</p>
                </div>
                <Link
                    href="/purchases/expenses/new"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>New Expense</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
                        />
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none bg-white min-w-[150px]"
                    >
                        <option value="">All Categories</option>
                        {EXPENSE_CATEGORIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Category</th>
                                <th className="px-6 py-3 font-medium">Description</th>
                                <th className="px-6 py-3 font-medium">Party</th>
                                <th className="px-6 py-3 font-medium">Account</th>
                                <th className="px-6 py-3 font-medium text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-48"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-28"></div></td>
                                        <td className="px-6 py-4 text-right"><div className="h-4 bg-slate-200 rounded w-20 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : expenses?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <Wallet size={48} className="text-slate-300" />
                                            <p className="text-lg font-medium text-slate-700">No expenses recorded</p>
                                            <p className="text-sm text-slate-500">Start by recording your first business expense.</p>
                                            <Link
                                                href="/purchases/expenses/new"
                                                className="mt-2 px-4 py-2 bg-[#F59E0B] text-[#0F172A] font-medium rounded-lg hover:bg-[#D97706] transition-colors"
                                            >
                                                New Expense
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                expenses?.data?.map((expense: Expense) => (
                                    <tr key={expense.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => router.push(`/purchases/expenses/${expense.id}`)}>
                                        <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                                            {format(new Date(expense.date), 'dd MMM yyyy')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">
                                                {expense.category || '—'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700 max-w-xs truncate">
                                            {expense.description || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {expense.party?.name || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {expense.account?.name || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="font-semibold text-slate-800 tabular-nums">
                                                ₹{Number(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </div>
                                            {expense.tax_amount > 0 && (
                                                <div className="text-xs text-slate-400 mt-0.5">
                                                    Tax: ₹{Number(expense.tax_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
                    <div>Showing {expenses?.data?.length || 0} records</div>
                    {expenses?.last_page > 1 && (
                        <span>Page {expenses?.current_page} of {expenses?.last_page}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
