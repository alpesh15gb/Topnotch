'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ArrowLeft, Edit, AlertCircle, X, Package } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ItemDetail {
    id: number;
    name: string;
    type: 'product' | 'service';
    sku: string | null;
    hsn_sac: string | null;
    sale_price: number | null;
    purchase_price: number | null;
    tax_rate: { id: number; name: string; rate: number } | null;
    unit: { id: number; name: string; short_name: string } | null;
    category: { id: number; name: string } | null;
    current_stock: number;
    opening_stock: number;
    track_stock: boolean;
    stock_alert_qty: number | null;
    description: string | null;
    is_active: boolean;
}

const fmt = (n: number | null) => '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

export default function ItemDetailPage() {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const router = useRouter();

    const [showStockModal, setShowStockModal] = useState(false);
    const [stockForm, setStockForm] = useState({
        qty: '',
        type: 'add',
        reason: '',
    });

    const { data: item, isLoading, isError } = useQuery<ItemDetail>({
        queryKey: ['item', id],
        queryFn: () => api.get(`/v1/items/${id}`).then(r => r.data),
        enabled: !!id,
    });

    const stockMutation = useMutation({
        mutationFn: (payload: typeof stockForm) =>
            api.post(`/v1/items/${id}/stock-adjustment`, {
                ...payload,
                qty: Number(payload.qty),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['item', id] });
            queryClient.invalidateQueries({ queryKey: ['items'] });
            setShowStockModal(false);
            toast.success('Stock adjusted successfully');
            setStockForm({ qty: '', type: 'add', reason: '' });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to adjust stock');
        },
    });

    const handleStockSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        stockMutation.mutate(stockForm);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F59E0B]" />
            </div>
        );
    }

    if (isError || !item) {
        return <div className="text-center py-20 text-red-500">Failed to load data</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/masters/items"
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-800">{item.name}</h1>
                            <span className={cn(
                                'px-2.5 py-1 text-xs font-semibold rounded-full',
                                item.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            )}>
                                {item.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5 capitalize flex items-center gap-2">
                            <span className={cn("w-2 h-2 rounded-full", item.type === 'product' ? "bg-blue-500" : "bg-emerald-500")} />
                            {item.type} {item.category && `• ${item.category.name}`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {item.type === 'product' && (
                        <button
                            onClick={() => setShowStockModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] transition-colors font-medium text-sm shadow-sm"
                        >
                            <Package size={16} />
                            Stock Adjustment
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-base font-semibold text-slate-800 mb-4">Item Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500">SKU / Item Code</p>
                                <p className="text-slate-800 font-medium mt-1">{item.sku || '—'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">HSN / SAC</p>
                                <p className="text-slate-800 font-medium mt-1">{item.hsn_sac || '—'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Unit</p>
                                <p className="text-slate-800 font-medium mt-1">{item.unit?.name || '—'} {item.unit && `(${item.unit.short_name})`}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Tax Rate</p>
                                <p className="text-slate-800 font-medium mt-1">{item.tax_rate ? `${item.tax_rate.rate}% GST` : 'Exempt'}</p>
                            </div>
                            {item.description && (
                                <div className="col-span-2">
                                    <p className="text-sm font-medium text-slate-500">Description</p>
                                    <p className="text-sm text-slate-700 mt-1">{item.description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-base font-semibold text-slate-800 mb-4">Pricing</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Sale Price</p>
                                <p className="text-xl font-bold text-slate-800 mt-1">{fmt(item.sale_price)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Purchase Price</p>
                                <p className="text-xl font-bold text-slate-800 mt-1">{fmt(item.purchase_price)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Details (Stock) */}
                <div className="space-y-6">
                    {item.type === 'product' && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-base font-semibold text-slate-800 mb-4">Inventory</h2>

                            <div className="mb-6">
                                <p className="text-sm font-medium text-slate-500 mb-1">Current Stock</p>
                                <div className="flex items-end gap-2">
                                    <span className={cn(
                                        "text-4xl font-bold tracking-tight",
                                        item.current_stock <= (item.stock_alert_qty || 0) ? "text-rose-600" : "text-emerald-600"
                                    )}>
                                        {item.current_stock}
                                    </span>
                                    <span className="text-slate-500 mb-1 font-medium">{item.unit?.short_name}</span>
                                </div>
                                {item.current_stock <= (item.stock_alert_qty || 0) && (
                                    <p className="text-xs text-rose-600 mt-2 flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        Low stock alert
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Stock Tracking</span>
                                    <span className="font-medium text-slate-800">{item.track_stock ? 'Enabled' : 'Disabled'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Opening Stock</span>
                                    <span className="font-medium text-slate-800">{item.opening_stock || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Low Stock Alert</span>
                                    <span className="font-medium text-slate-800">{item.stock_alert_qty || '—'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Stock Adjustment Modal */}
            {showStockModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800">Stock Adjustment</h3>
                            <button
                                onClick={() => setShowStockModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleStockSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setStockForm(p => ({ ...p, type: 'add' }))}
                                    className={cn(
                                        "py-2 text-sm font-medium rounded-md transition-all",
                                        stockForm.type === 'add' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    Add (+)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStockForm(p => ({ ...p, type: 'subtract' }))}
                                    className={cn(
                                        "py-2 text-sm font-medium rounded-md transition-all",
                                        stockForm.type === 'subtract' ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    Reduce (-)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStockForm(p => ({ ...p, type: 'set' }))}
                                    className={cn(
                                        "py-2 text-sm font-medium rounded-md transition-all",
                                        stockForm.type === 'set' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    Set (=)
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={stockForm.qty}
                                        onChange={e => setStockForm(p => ({ ...p, qty: e.target.value }))}
                                        required
                                        placeholder="e.g. 10"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none text-sm"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                        {item.unit?.short_name}
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-1.5">
                                    {stockForm.type === 'add' && `Will add to current stock (${item.current_stock})`}
                                    {stockForm.type === 'subtract' && `Will reduce from current stock (${item.current_stock})`}
                                    {stockForm.type === 'set' && `Will overwrite current stock (${item.current_stock})`}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Reason (Optional)</label>
                                <textarea
                                    value={stockForm.reason}
                                    onChange={e => setStockForm(p => ({ ...p, reason: e.target.value }))}
                                    rows={2}
                                    placeholder="Damage, return, physical count..."
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none text-sm resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowStockModal(false)}
                                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={stockMutation.isPending || !stockForm.qty}
                                    className="px-6 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] font-medium text-sm disabled:opacity-60 transition-colors"
                                >
                                    {stockMutation.isPending ? 'Saving...' : 'Adjust Stock'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
