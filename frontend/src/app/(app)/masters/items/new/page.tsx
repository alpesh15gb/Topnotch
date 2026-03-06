'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, Plus, Package } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function NewItemPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: '',
        type: 'product' as 'product' | 'service',
        sku: '',
        hsn_sac: '',
        description: '',
        sale_price: '',
        purchase_price: '',
        tax_rate_id: '',
        unit_id: '',
        track_stock: true,
        opening_stock: '',
        stock_alert_qty: '',
        is_active: true,
    });

    const { data: taxRates } = useQuery({
        queryKey: ['tax-rates'],
        queryFn: () => api.get('/v1/tax-rates').then(r => r.data.data || r.data),
    });

    const { data: units } = useQuery({
        queryKey: ['units'],
        queryFn: () => api.get('/v1/units').then(r => r.data.data || r.data),
    });

    const mutation = useMutation({
        mutationFn: (payload: typeof form) => api.post('/v1/items', {
            ...payload,
            sale_price: payload.sale_price ? Number(payload.sale_price) : null,
            purchase_price: payload.purchase_price ? Number(payload.purchase_price) : null,
            tax_rate_id: payload.tax_rate_id || null,
            unit_id: payload.unit_id || null,
            opening_stock: payload.opening_stock ? Number(payload.opening_stock) : 0,
            stock_alert_qty: payload.stock_alert_qty ? Number(payload.stock_alert_qty) : null,
        }),
        onSuccess: (res) => {
            toast.success('Item created successfully');
            router.push(`/masters/items/${res.data?.id || ''}`);
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to create item');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) return toast.error('Item name is required');
        mutation.mutate(form);
    };

    const field = (key: keyof typeof form, value: string | boolean) =>
        setForm(prev => ({ ...prev, [key]: value }));

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/masters/items" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <ArrowLeft size={20} className="text-slate-600" />
                </Link>
                <div className="flex items-center gap-3">
                    <Package size={22} className="text-slate-500" />
                    <h1 className="text-2xl font-bold text-slate-800">New Item</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Toggle */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-base font-semibold text-slate-800 mb-4">Item Type</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {(['product', 'service'] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => field('type', t)}
                                className={cn(
                                    'py-3 rounded-lg border-2 font-semibold text-sm transition-all capitalize',
                                    form.type === t
                                        ? 'border-[#F59E0B] bg-amber-50 text-[#0F172A]'
                                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Basic Info */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <h2 className="text-base font-semibold text-slate-800">Basic Info</h2>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Item Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => field('name', e.target.value)}
                            placeholder="e.g. Steel Chair, Web Design Service"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">SKU / Item Code</label>
                            <input
                                type="text"
                                value={form.sku}
                                onChange={e => field('sku', e.target.value)}
                                placeholder="e.g. ITM-001"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">HSN / SAC Code</label>
                            <input
                                type="text"
                                value={form.hsn_sac}
                                onChange={e => field('hsn_sac', e.target.value)}
                                placeholder="e.g. 9403 or 998313"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            value={form.description}
                            onChange={e => field('description', e.target.value)}
                            rows={2}
                            placeholder="Optional description..."
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none resize-none"
                        />
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <h2 className="text-base font-semibold text-slate-800">Pricing & Tax</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Sale Price (₹)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.sale_price}
                                onChange={e => field('sale_price', e.target.value)}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Price (₹)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.purchase_price}
                                onChange={e => field('purchase_price', e.target.value)}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">GST Rate</label>
                            <select
                                value={form.tax_rate_id}
                                onChange={e => field('tax_rate_id', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none bg-white"
                            >
                                <option value="">Exempt / None</option>
                                {(taxRates || []).map((tr: any) => (
                                    <option key={tr.id} value={tr.id}>{tr.name} ({tr.rate}%)</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Unit of Measure</label>
                            <select
                                value={form.unit_id}
                                onChange={e => field('unit_id', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none bg-white"
                            >
                                <option value="">Select Unit</option>
                                {(units || []).map((u: any) => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.short_name})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Inventory (products only) */}
                {form.type === 'product' && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-slate-800">Inventory</h2>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.track_stock}
                                    onChange={e => field('track_stock', e.target.checked)}
                                    className="w-4 h-4 accent-[#F59E0B]"
                                />
                                <span className="text-sm font-medium text-slate-700">Track Stock</span>
                            </label>
                        </div>
                        {form.track_stock && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Opening Stock</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.opening_stock}
                                        onChange={e => field('opening_stock', e.target.value)}
                                        placeholder="0"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Low Stock Alert</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.stock_alert_qty}
                                        onChange={e => field('stock_alert_qty', e.target.value)}
                                        placeholder="e.g. 10"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Alert when stock falls below this qty</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <Link
                        href="/masters/items"
                        className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F59E0B] text-[#0F172A] font-bold rounded-lg hover:bg-[#D97706] transition-colors disabled:opacity-60"
                    >
                        <Plus size={18} />
                        {mutation.isPending ? 'Creating...' : 'Create Item'}
                    </button>
                </div>
            </form>
        </div>
    );
}
