'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plus, Search, FileText, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface PurchaseOrder {
    id: number;
    number: string;
    date: string;
    expected_date: string | null;
    status: 'draft' | 'sent' | 'received' | 'partially_received' | 'cancelled';
    total: number;
    party: { name: string };
}

const STATUS_COLORS: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    sent: 'bg-blue-100 text-blue-700',
    received: 'bg-emerald-100 text-emerald-700',
    partially_received: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-slate-200 text-slate-500',
};

const STATUS_LABELS: Record<string, string> = {
    draft: 'Draft',
    sent: 'Sent',
    received: 'Received',
    partially_received: 'Partially Received',
    cancelled: 'Cancelled',
};

export default function PurchaseOrdersPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const { data: orders, isLoading, isError } = useQuery({
        queryKey: ['purchase_orders', search, statusFilter],
        queryFn: async () => {
            const res = await api.get('/v1/purchase-orders', {
                params: { search: search || undefined, status: statusFilter || undefined }
            });
            return res.data;
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Purchase Orders</h1>
                    <p className="text-sm text-slate-500">Track purchase orders sent to vendors</p>
                </div>
                <Link
                    href="/purchases/purchase-orders/new"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>New PO</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by PO number or supplier..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none bg-white min-w-[180px]"
                    >
                        <option value="">All Statuses</option>
                        {Object.entries(STATUS_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                                <th className="px-6 py-3 font-medium">#</th>
                                <th className="px-6 py-3 font-medium">Supplier</th>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Expected Date</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Total</th>
                                <th className="px-6 py-3 font-medium w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-36"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-200 rounded-full"></div></td>
                                        <td className="px-6 py-4 text-right"><div className="h-4 bg-slate-200 rounded w-20 ml-auto"></div></td>
                                        <td className="px-6 py-4"></td>
                                    </tr>
                                ))
                            ) : isError ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-500">
                                            <AlertCircle size={36} className="text-red-400" />
                                            <p className="font-medium text-slate-700">Failed to load purchase orders</p>
                                            <p className="text-sm">Please try refreshing the page.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : orders?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <FileText size={48} className="text-slate-300" />
                                            <p className="text-lg font-medium text-slate-700">No purchase orders found</p>
                                            <p className="text-sm text-slate-500">Create your first purchase order to get started.</p>
                                            <Link
                                                href="/purchases/purchase-orders/new"
                                                className="mt-2 px-4 py-2 bg-[#F59E0B] text-[#0F172A] font-medium rounded-lg hover:bg-[#D97706] transition-colors"
                                            >
                                                New PO
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders?.data?.map((order: PurchaseOrder) => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <Link href={`/purchases/purchase-orders/${order.id}`} className="font-semibold text-slate-800 group-hover:text-[#F59E0B] transition-colors">
                                                {order.number}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700">
                                            {order.party?.name || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                                            {format(new Date(order.date), 'dd MMM yyyy')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                                            {order.expected_date ? format(new Date(order.expected_date), 'dd MMM yyyy') : '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                'px-2.5 py-1 text-xs font-semibold rounded-full',
                                                STATUS_COLORS[order.status] ?? 'bg-slate-100 text-slate-700'
                                            )}>
                                                {STATUS_LABELS[order.status] ?? order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-slate-800 tabular-nums">
                                            ₹{Number(order.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4"></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
                    <div>Showing {orders?.data?.length || 0} records</div>
                    {orders?.last_page > 1 && (
                        <span>Page {orders?.current_page} of {orders?.last_page}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
