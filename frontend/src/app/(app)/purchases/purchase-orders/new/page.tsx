'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import api from '@/lib/api';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Item {
    id: number;
    name: string;
    purchase_price: number | null;
}

interface Party {
    id: number;
    name: string;
}

interface POFormData {
    party_id: number | '';
    date: string;
    expected_date: string;
    notes: string;
    items: {
        item_id: number | '';
        description: string;
        qty: number;
        unit_price: number;
    }[];
}

export default function NewPurchaseOrderPage() {
    const router = useRouter();

    const { control, handleSubmit, watch, setValue } = useForm<POFormData>({
        defaultValues: {
            party_id: '',
            date: new Date().toISOString().split('T')[0],
            expected_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
            notes: '',
            items: [
                { item_id: '', description: '', qty: 1, unit_price: 0 }
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items'
    });

    const watchItems = watch('items');

    const { data: parties } = useQuery({
        queryKey: ['parties', 'suppliers'],
        queryFn: async () => (await api.get('/v1/parties?type=supplier')).data.data as Party[]
    });

    const { data: itemsList } = useQuery({
        queryKey: ['items', 'products'],
        queryFn: async () => (await api.get('/v1/items?type=product')).data.data as Item[]
    });

    const subtotal = useMemo(() => {
        return watchItems.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.unit_price) || 0), 0);
    }, [watchItems]);

    const handleItemSelect = (index: number, itemId: number) => {
        const item = itemsList?.find(i => i.id === itemId);
        if (item) {
            setValue(`items.${index}.description`, item.name);
            setValue(`items.${index}.unit_price`, item.purchase_price || 0);
        }
    };

    const saveMutation = useMutation({
        mutationFn: async (data: POFormData) => {
            return api.post('/v1/purchase-orders', data);
        },
        onSuccess: () => {
            toast.success('Purchase Order created successfully');
            router.push('/purchases/purchase-orders');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to create purchase order');
        }
    });

    const onSubmit = (data: POFormData) => {
        saveMutation.mutate(data);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-24">
            <div className="flex items-center gap-4">
                <Link href="/purchases/purchase-orders" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">New Purchase Order</h1>
                    <p className="text-sm text-slate-500">Draft a new PO for suppliers</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1 md:col-span-3 lg:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Supplier <span className="text-red-500">*</span></label>
                        <Controller
                            control={control}
                            name="party_id"
                            rules={{ required: 'Supplier is required' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <select
                                        {...field}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent bg-white"
                                        onChange={e => field.onChange(e.target.value ? Number(e.target.value) : '')}
                                    >
                                        <option value="">Select Supplier...</option>
                                        {parties?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                    {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
                                </>
                            )}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Order Date <span className="text-red-500">*</span></label>
                        <Controller control={control} name="date" rules={{ required: true }} render={({ field }) => (
                            <input type="date" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Expected Date</label>
                        <Controller control={control} name="expected_date" render={({ field }) => (
                            <input type="date" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800">Order Items</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                    <th className="px-4 py-3 font-medium w-64">Item</th>
                                    <th className="px-4 py-3 font-medium">Description</th>
                                    <th className="px-4 py-3 font-medium w-32 text-right">Qty</th>
                                    <th className="px-4 py-3 font-medium w-32 text-right">Unit Price</th>
                                    <th className="px-4 py-3 font-medium w-32 text-right">Amount</th>
                                    <th className="w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {fields.map((field, index) => {
                                    const item = watchItems[index];
                                    const lineTotal = (Number(item.qty) || 0) * (Number(item.unit_price) || 0);

                                    return (
                                        <tr key={field.id} className="align-top group hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.item_id`} render={({ field: selectField }) => (
                                                    <select
                                                        {...selectField}
                                                        className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B] bg-white"
                                                        onChange={(e) => {
                                                            const val = e.target.value ? Number(e.target.value) : '';
                                                            selectField.onChange(val);
                                                            if (val !== '') handleItemSelect(index, val);
                                                        }}
                                                    >
                                                        <option value="">Custom Item</option>
                                                        {itemsList?.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                                    </select>
                                                )} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.description`} render={({ field: descField }) => (
                                                    <textarea {...descField} rows={1} className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B] resize-y" placeholder="Item description" required />
                                                )} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.qty`} render={({ field: qtyField }) => (
                                                    <input type="number" step="any" min="0.001" {...qtyField} required className="w-full px-2 py-1.5 text-sm text-right border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B]" />
                                                )} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.unit_price`} render={({ field: priceField }) => (
                                                    <input type="number" step="any" min="0" {...priceField} required className="w-full px-2 py-1.5 text-sm text-right border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B]" />
                                                )} />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="pt-2 font-medium text-slate-800 tabular-nums">
                                                    ₹{lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button type="button" onClick={() => remove(index)} className="pt-1.5 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                        <button type="button" onClick={() => append({ item_id: '', description: '', qty: 1, unit_price: 0 })} className="flex items-center gap-1.5 text-sm font-medium text-[#F59E0B] hover:text-[#D97706] transition-colors">
                            <Plus size={16} /> Add Line Item
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-medium text-slate-700 mb-2">Internal Notes</h3>
                        <Controller control={control} name="notes" render={({ field }) => (
                            <textarea {...field} className="w-full min-h-[100px] px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] resize-none text-sm" placeholder="Terms, delivery instructions..." />
                        )} />
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <span className="text-lg font-bold text-slate-800">Total Amount:</span>
                        <span className="text-3xl font-bold text-[#F59E0B]">
                            ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 px-6 flex justify-end gap-3 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pl-24">
                    <Link href="/purchases/purchase-orders" className="px-6 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium transition-colors">
                        Cancel
                    </Link>
                    <button type="submit" disabled={saveMutation.isPending} className="flex items-center gap-2 px-8 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] font-medium transition-colors disabled:opacity-70">
                        <Save size={18} />
                        {saveMutation.isPending ? 'Saving...' : 'Save Purchase Order'}
                    </button>
                </div>
            </form>
        </div>
    );
}
