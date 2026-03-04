'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plus, Percent, Trash2, Search } from 'lucide-react';

interface TaxRate {
    id: number;
    name: string;
    rate: number;
    type: string;
    cgst_rate?: number;
    sgst_rate?: number;
    igst_rate?: number;
    cess_rate?: number;
    is_active: boolean;
}

export default function TaxRatesPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', rate: '', type: 'GST', cgst_rate: '', sgst_rate: '', igst_rate: '' });

    const { data: taxRates = [], isLoading } = useQuery<TaxRate[]>({
        queryKey: ['tax-rates'],
        queryFn: async () => {
            const res = await api.get('/v1/tax-rates');
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: (data: object) => api.post('/v1/tax-rates', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tax-rates'] });
            setShowForm(false);
            setForm({ name: '', rate: '', type: 'GST', cgst_rate: '', sgst_rate: '', igst_rate: '' });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/v1/tax-rates/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tax-rates'] }),
    });

    const filtered = taxRates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({
            name: form.name,
            rate: parseFloat(form.rate),
            type: form.type,
            cgst_rate: form.cgst_rate ? parseFloat(form.cgst_rate) : null,
            sgst_rate: form.sgst_rate ? parseFloat(form.sgst_rate) : null,
            igst_rate: form.igst_rate ? parseFloat(form.igst_rate) : null,
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tax Rates</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage GST, TDS, and other tax rates</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" /> Add Tax Rate
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">New Tax Rate</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                required
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                placeholder="e.g. GST 18%"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Rate (%)</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                value={form.rate}
                                onChange={e => setForm({ ...form, rate: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                placeholder="18"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={form.type}
                                onChange={e => setForm({ ...form, type: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="GST">GST</option>
                                <option value="TDS">TDS</option>
                                <option value="TCS">TCS</option>
                                <option value="CESS">CESS</option>
                                <option value="none">None</option>
                            </select>
                        </div>
                        {form.type === 'GST' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CGST (%)</label>
                                    <input type="number" step="0.01" value={form.cgst_rate} onChange={e => setForm({ ...form, cgst_rate: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SGST (%)</label>
                                    <input type="number" step="0.01" value={form.sgst_rate} onChange={e => setForm({ ...form, sgst_rate: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">IGST (%)</label>
                                    <input type="number" step="0.01" value={form.igst_rate} onChange={e => setForm({ ...form, igst_rate: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                                </div>
                            </>
                        )}
                        <div className="col-span-2 flex gap-2">
                            <button type="submit" disabled={createMutation.isPending} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                                {createMutation.isPending ? 'Saving...' : 'Save'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 px-4 py-2 rounded-lg text-sm">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search tax rates..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                    </div>
                </div>
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Percent className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No tax rates found</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Type</th>
                                <th className="px-4 py-3 text-right">Rate</th>
                                <th className="px-4 py-3 text-right">CGST</th>
                                <th className="px-4 py-3 text-right">SGST</th>
                                <th className="px-4 py-3 text-right">IGST</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map(tax => (
                                <tr key={tax.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{tax.name}</td>
                                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">{tax.type}</span></td>
                                    <td className="px-4 py-3 text-right">{tax.rate}%</td>
                                    <td className="px-4 py-3 text-right text-gray-500">{tax.cgst_rate ?? '-'}</td>
                                    <td className="px-4 py-3 text-right text-gray-500">{tax.sgst_rate ?? '-'}</td>
                                    <td className="px-4 py-3 text-right text-gray-500">{tax.igst_rate ?? '-'}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => deleteMutation.mutate(tax.id)} className="text-red-500 hover:text-red-700 p-1">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
