'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plus, Search, MapPin, Building, Phone } from 'lucide-react';
import Link from 'next/link';

interface Party {
    id: number;
    name: string;
    type: 'customer' | 'supplier' | 'both';
    gstin: string | null;
    phone: string | null;
    email: string | null;
    city: string | null;
    state: string | null;
    balance: number;
}

export default function PartiesPage() {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    const { data: parties, isLoading } = useQuery({
        queryKey: ['parties', search, typeFilter],
        queryFn: async () => {
            const res = await api.get('/v1/parties', {
                params: { search, type: typeFilter }
            });
            return res.data;
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Parties</h1>
                    <p className="text-sm text-slate-500">Manage your customers and suppliers</p>
                </div>

                <Link
                    href="/masters/parties/new"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] transition-colors"
                >
                    <Plus size={18} />
                    <span>Add Party</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, GSTIN, phone..."
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
                        <option value="customer">Customers</option>
                        <option value="supplier">Suppliers</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                                <th className="px-6 py-3 font-medium">Party Details</th>
                                <th className="px-6 py-3 font-medium">Contact</th>
                                <th className="px-6 py-3 font-medium">Location</th>
                                <th className="px-6 py-3 font-medium text-right">Balance</th>
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
                            ) : parties?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Building size={48} className="text-slate-300 mb-4" />
                                            <p className="text-lg font-medium text-slate-700">No parties found</p>
                                            <p className="text-sm mt-1">Try adjusting your search or add a new party.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                parties?.data?.map((party: Party) => (
                                    <tr key={party.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <Link href={`/masters/parties/${party.id}`} className="block">
                                                <div className="font-medium text-slate-800 group-hover:text-[#F59E0B] transition-colors">
                                                    {party.name}
                                                </div>
                                                <div className="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
                                                    <span className={
                                                        party.type === 'customer' ? 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs' :
                                                            party.type === 'supplier' ? 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs' :
                                                                'text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-xs'
                                                    }>
                                                        {party.type.charAt(0).toUpperCase() + party.type.slice(1)}
                                                    </span>
                                                    {party.gstin && <span className="text-slate-400">GSTIN: {party.gstin}</span>}
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {party.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone size={14} className="text-slate-400" />
                                                    <span>{party.phone}</span>
                                                </div>
                                            )}
                                            {party.email && <div className="text-slate-500 mt-0.5">{party.email}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {(party.city || party.state) ? (
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} className="text-slate-400 shrink-0" />
                                                    <span>{[party.city, party.state].filter(Boolean).join(', ')}</span>
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className={`font-medium ${party.balance > 0 ? (party.type === 'customer' ? 'text-emerald-600' : 'text-rose-600') :
                                                    party.balance < 0 ? (party.type === 'customer' ? 'text-rose-600' : 'text-emerald-600') :
                                                        'text-slate-600'
                                                }`}>
                                                ₹{Math.abs(party.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-0.5">
                                                {party.balance > 0 ? 'Dr' : party.balance < 0 ? 'Cr' : ''}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination placeholder */}
                <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
                    <div>Showing {parties?.data?.length || 0} items</div>
                    {parties?.last_page > 1 && (
                        <div className="flex gap-1">
                            {/* Add proper pagination here later */}
                            <span>Page {parties?.current_page} of {parties?.last_page}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
