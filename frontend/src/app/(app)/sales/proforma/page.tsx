'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plus, Search, FileText, Download, Send, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ProformaInvoice {
    id: number;
    number: string;
    date: string;
    status: 'draft' | 'sent' | 'invoiced' | 'cancelled';
    total: number;
    party: {
        id: number;
        name: string;
        type: string;
    };
}

const statusColors = {
    draft: 'bg-slate-100 text-slate-700',
    sent: 'bg-blue-100 text-blue-700',
    invoiced: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-slate-200 text-slate-500',
};

const statusLabels = {
    draft: 'Draft',
    sent: 'Sent',
    invoiced: 'Invoiced',
    cancelled: 'Cancelled',
};

export default function ProformaInvoicesPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const { data: proformas, isLoading } = useQuery({
        queryKey: ['proforma_invoices', search, statusFilter],
        queryFn: async () => {
            const res = await api.get('/v1/proforma-invoices', {
                params: { search, status: statusFilter }
            });
            return res.data;
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Proforma Invoices</h1>
                    <p className="text-sm text-slate-500">Manage preliminary bills before generating a final tax invoice</p>
                </div>

                <Link
                    href="/sales/proforma/new"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>New Proforma</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by proforma number, customer..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none bg-white min-w-[150px]"
                    >
                        <option value="">All Statuses</option>
                        {Object.entries(statusLabels).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                                <th className="px-6 py-3 font-medium">Proforma Info</th>
                                <th className="px-6 py-3 font-medium">Customer</th>
                                <th className="px-6 py-3 font-medium">Status</th>
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
                            ) : proformas?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText size={48} className="text-slate-300 mb-4" />
                                            <p className="text-lg font-medium text-slate-700">No proforma invoices found</p>
                                            <Link
                                                href="/sales/proforma/new"
                                                className="mt-4 px-4 py-2 bg-[#F59E0B] text-[#0F172A] font-medium rounded-lg hover:bg-[#D97706] transition-colors"
                                            >
                                                Create Proforma
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                proformas?.data?.map((proforma: ProformaInvoice) => (
                                    <tr key={proforma.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <Link href={`/sales/proforma/${proforma.id}`} className="block">
                                                <div className="font-bold text-slate-800 group-hover:text-[#F59E0B] transition-colors">
                                                    {proforma.number}
                                                </div>
                                                <div className="text-sm text-slate-500 mt-0.5">
                                                    {format(new Date(proforma.date), 'dd MMM yyyy')}
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/masters/parties/${proforma.party.id}`} className="font-medium text-slate-700 hover:text-blue-600 transition-colors">
                                                {proforma.party.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 text-xs font-semibold rounded-full border border-transparent",
                                                statusColors[proforma.status]
                                            )}>
                                                {statusLabels[proforma.status]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="font-semibold text-slate-800">
                                                ₹{proforma.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="flex justify-end gap-2">
                                                {['draft', 'sent'].includes(proforma.status) && (
                                                    <button
                                                        title="Convert to Final Invoice"
                                                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                                                    >
                                                        <CheckCircle2 size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    title="Download PDF"
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                >
                                                    <Download size={18} />
                                                </button>
                                                <button
                                                    title="Send Email"
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                                                >
                                                    <Send size={18} />
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
                    <div>Showing {proformas?.data?.length || 0} records</div>
                    {proformas?.last_page > 1 && (
                        <div className="flex gap-1">
                            <span>Page {proformas?.current_page} of {proformas?.last_page}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
