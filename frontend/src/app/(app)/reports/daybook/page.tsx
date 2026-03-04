'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { format } from 'date-fns';
import { BookOpen, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function DaybookPage() {
    const today = format(new Date(), 'yyyy-MM-dd');
    const [date, setDate] = useState(today);

    const { data, isLoading } = useQuery({
        queryKey: ['daybook', date],
        queryFn: async () => {
            const res = await api.get('/v1/reports/daybook', { params: { date } });
            return res.data;
        },
        enabled: !!date,
    });

    const totalInvoiced = data?.invoices?.reduce((s: number, i: any) => s + Number(i.total), 0) ?? 0;
    const totalBilled = data?.bills?.reduce((s: number, b: any) => s + Number(b.total), 0) ?? 0;
    const totalExpenses = data?.expenses?.reduce((s: number, e: any) => s + Number(e.amount), 0) ?? 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Day Book</h1>
                    <p className="text-sm text-slate-500">All transactions for a single day</p>
                </div>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
                />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-lg"><ArrowUpRight className="text-emerald-500" size={22} /></div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Sales</p>
                        <p className="text-xl font-bold text-slate-800">₹{totalInvoiced.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                        <p className="text-xs text-slate-400">{data?.invoices?.length ?? 0} invoice(s)</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
                    <div className="p-3 bg-red-50 rounded-lg"><ArrowDownRight className="text-red-500" size={22} /></div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Purchases</p>
                        <p className="text-xl font-bold text-slate-800">₹{totalBilled.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                        <p className="text-xs text-slate-400">{data?.bills?.length ?? 0} bill(s)</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
                    <div className="p-3 bg-amber-50 rounded-lg"><Wallet className="text-amber-500" size={22} /></div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Expenses</p>
                        <p className="text-xl font-bold text-slate-800">₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                        <p className="text-xs text-slate-400">{data?.expenses?.length ?? 0} expense(s)</p>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F59E0B]" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Invoices */}
                    <Section title="Sales Invoices" icon={<ArrowUpRight size={16} className="text-emerald-500" />} count={data?.invoices?.length}>
                        {data?.invoices?.length === 0 ? (
                            <EmptyRow message="No invoices on this date" />
                        ) : data?.invoices?.map((inv: any) => (
                            <tr key={inv.id} className="hover:bg-slate-50">
                                <td className="px-5 py-3">
                                    <Link href={`/sales/invoices/${inv.id}`} className="font-medium text-slate-800 hover:text-[#F59E0B]">{inv.number}</Link>
                                    <div className="text-xs text-slate-400 mt-0.5">{inv.party?.name}</div>
                                </td>
                                <td className="px-5 py-3"><StatusBadge status={inv.status} /></td>
                                <td className="px-5 py-3 text-right font-semibold text-emerald-600">
                                    ₹{Number(inv.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))}
                    </Section>

                    {/* Bills */}
                    <Section title="Purchase Bills" icon={<ArrowDownRight size={16} className="text-red-500" />} count={data?.bills?.length}>
                        {data?.bills?.length === 0 ? (
                            <EmptyRow message="No purchase bills on this date" />
                        ) : data?.bills?.map((bill: any) => (
                            <tr key={bill.id} className="hover:bg-slate-50">
                                <td className="px-5 py-3">
                                    <Link href={`/purchases/bills/${bill.id}`} className="font-medium text-slate-800 hover:text-[#F59E0B]">{bill.number}</Link>
                                    <div className="text-xs text-slate-400 mt-0.5">{bill.party?.name}</div>
                                </td>
                                <td className="px-5 py-3"><StatusBadge status={bill.status} /></td>
                                <td className="px-5 py-3 text-right font-semibold text-red-600">
                                    ₹{Number(bill.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))}
                    </Section>

                    {/* Expenses */}
                    <Section title="Expenses" icon={<Wallet size={16} className="text-amber-500" />} count={data?.expenses?.length}>
                        {data?.expenses?.length === 0 ? (
                            <EmptyRow message="No expenses on this date" />
                        ) : data?.expenses?.map((exp: any) => (
                            <tr key={exp.id} className="hover:bg-slate-50">
                                <td className="px-5 py-3">
                                    <div className="font-medium text-slate-800">{exp.description}</div>
                                    <div className="text-xs text-slate-400 mt-0.5">{exp.category}</div>
                                </td>
                                <td className="px-5 py-3 text-slate-500 text-sm">{exp.category}</td>
                                <td className="px-5 py-3 text-right font-semibold text-amber-600">
                                    ₹{Number(exp.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))}
                    </Section>
                </div>
            )}
        </div>
    );
}

function Section({ title, icon, count, children }: { title: string; icon: React.ReactNode; count?: number; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-2">
                {icon}
                <h2 className="font-semibold text-slate-700">{title}</h2>
                {count !== undefined && (
                    <span className="ml-auto text-xs text-slate-400">{count} record(s)</span>
                )}
            </div>
            <table className="w-full">
                <thead>
                    <tr className="bg-slate-50 text-xs text-slate-500 font-medium border-b border-slate-200">
                        <th className="px-5 py-2 text-left">Description</th>
                        <th className="px-5 py-2 text-left">Status</th>
                        <th className="px-5 py-2 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">{children}</tbody>
            </table>
        </div>
    );
}

function EmptyRow({ message }: { message: string }) {
    return (
        <tr>
            <td colSpan={3} className="px-5 py-6 text-center text-slate-400 text-sm">{message}</td>
        </tr>
    );
}

const statusColors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-600',
    posted: 'bg-blue-100 text-blue-700',
    paid: 'bg-emerald-100 text-emerald-700',
    partially_paid: 'bg-amber-100 text-amber-700',
    overdue: 'bg-red-100 text-red-700',
    cancelled: 'bg-slate-200 text-slate-400',
};

function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColors[status] ?? 'bg-slate-100 text-slate-600'}`}>
            {status?.replace('_', ' ')}
        </span>
    );
}
