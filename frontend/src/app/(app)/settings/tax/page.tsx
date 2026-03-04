'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plus, ArrowLeft, Trash2, Edit2 } from 'lucide-react';
import Link from 'next/link';

interface TaxRate {
    id: number;
    name: string;
    rate: number;
    type: string;
    is_active: boolean;
}

export default function TaxSettingsPage() {
    const { data: taxRates, isLoading } = useQuery({
        queryKey: ['tax-rates'],
        queryFn: async () => (await api.get('/v1/tax-rates')).data as TaxRate[]
    });

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <Link href="/settings" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex-1 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Tax Rates (GST)</h1>
                        <p className="text-sm text-slate-500">Configure standard tax slabs used in invoices and bills</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] font-medium text-sm transition-colors shadow-sm">
                        <Plus size={16} /> New Tax Rate
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                            <th className="px-6 py-3 font-medium">Name / Label</th>
                            <th className="px-6 py-3 font-medium text-right">Tax Rate (%)</th>
                            <th className="px-6 py-3 font-medium text-center">Status</th>
                            <th className="px-6 py-3 font-medium w-24"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/4 ml-auto"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/3 mx-auto"></div></td>
                                    <td className="px-6 py-4"></td>
                                </tr>
                            ))
                        ) : taxRates?.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No custom tax rates found.</td>
                            </tr>
                        ) : (
                            taxRates?.map((rate) => (
                                <tr key={rate.id} className="hover:bg-slate-50 group">
                                    <td className="px-6 py-4 font-medium text-slate-800">{rate.name}</td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-700">{rate.rate}%</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${rate.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {rate.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-red-500 rounded">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
