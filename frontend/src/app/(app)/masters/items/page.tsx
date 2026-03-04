'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plus, Search, Package, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Item {
    id: number;
    name: string;
    type: 'product' | 'service';
    sku: string | null;
    hsn_sac: string | null;
    sale_price: number | null;
    purchase_price: number | null;
    tax_rate: {
        id: number;
        name: string;
        rate: number;
    } | null;
    unit: {
        id: number;
        name: string;
        short_name: string;
    } | null;
    current_stock: number;
}

export default function ItemsPage() {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    const { data: items, isLoading } = useQuery({
        queryKey: ['items', search, typeFilter],
        queryFn: async () => {
            const res = await api.get('/v1/items', {
                params: { search, type: typeFilter }
            });
            return res.data;
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Items</h1>
                    <p className="text-sm text-slate-500">Manage your products and services</p>
                </div>

                <Link
                    href="/masters/items/new"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] transition-colors"
                >
                    <Plus size={18} />
                    <span>Add Item</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, SKU, HSN..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
                        />
                    </div>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none bg-white min-w-[150px]"
                    >
                        <option value="">All Types</option>
                        <option value="product">Products</option>
                        <option value="service">Services</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                                <th className="px-6 py-3 font-medium">Item Details</th>
                                <th className="px-6 py-3 font-medium">Pricing</th>
                                <th className="px-6 py-3 font-medium">Tax & Unit</th>
                                <th className="px-6 py-3 font-medium text-right">Stock</th>
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
                                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="h-4 bg-slate-200 rounded w-1/2 ml-auto"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : items?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Package size={48} className="text-slate-300 mb-4" />
                                            <p className="text-lg font-medium text-slate-700">No items found</p>
                                            <p className="text-sm mt-1">Try adjusting your search or add a new item.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                items?.data?.map((item: Item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <Link href={`/masters/items/${item.id}`} className="block">
                                                <div className="font-medium text-slate-800 group-hover:text-[#F59E0B] transition-colors flex items-center gap-2">
                                                    <span className={cn(
                                                        "w-2 h-2 rounded-full",
                                                        item.type === 'product' ? "bg-blue-500" : "bg-emerald-500"
                                                    )} />
                                                    {item.name}
                                                </div>
                                                <div className="text-sm text-slate-500 mt-1 flex items-center gap-3">
                                                    {item.sku && <span>SKU: {item.sku}</span>}
                                                    {item.hsn_sac && <span>HSN/SAC: {item.hsn_sac}</span>}
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-1.5 text-slate-700">
                                                <span className="text-slate-400 w-8 inline-block">Sale:</span>
                                                <span className="font-medium">₹{(item.sale_price ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                                                <span className="text-slate-400 w-8 inline-block">Cost:</span>
                                                <span>₹{(item.purchase_price ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded textxs font-medium border border-slate-200">
                                                    {item.tax_rate ? `${item.tax_rate.rate}% GST` : 'Exempt'}
                                                </span>
                                            </div>
                                            <div className="text-slate-500">
                                                Per {item.unit?.short_name || 'Unit'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {item.type === 'product' ? (
                                                <>
                                                    <div className={cn(
                                                        "font-medium text-lg",
                                                        item.current_stock <= 0 ? "text-rose-600" : "text-slate-800"
                                                    )}>
                                                        {item.current_stock}
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        {item.unit?.short_name || 'qty'}
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="text-slate-400 italic text-sm">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
                    <div>Showing {items?.data?.length || 0} items</div>
                    {items?.last_page > 1 && (
                        <div className="flex gap-1">
                            <span>Page {items?.current_page} of {items?.last_page}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
