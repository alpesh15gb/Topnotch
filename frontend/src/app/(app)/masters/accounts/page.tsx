'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plus, Search, ChevronRight, ChevronDown, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Account {
    id: number;
    name: string;
    code: string;
    type: string;
    balance: number;
    children?: Account[];
}

export default function AccountsPage() {
    const [search, setSearch] = useState('');
    const [expandedNodes, setExpandedNodes] = useState<Record<number, boolean>>({});

    const { data: accounts, isLoading } = useQuery({
        queryKey: ['accounts', 'tree'],
        queryFn: async () => {
            const res = await api.get('/v1/accounts/tree');
            return res.data;
        }
    });

    const toggleNode = (id: number) => {
        setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderAccountTree = (nodes: Account[], level = 0) => {
        return nodes.map((node) => {
            const isExpanded = expandedNodes[node.id];
            const hasChildren = node.children && node.children.length > 0;

            const matchesSearch = search === '' ||
                node.name.toLowerCase().includes(search.toLowerCase()) ||
                node.code.toLowerCase().includes(search.toLowerCase());

            if (!matchesSearch && search !== '') {
                // Simple search filtering - in a real app, might want to show parents if children match
                // For now, if searching, just flat list matched items (ignoring tree)
                return null;
            }

            return (
                <div key={node.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <div
                        className="flex items-center justify-between py-3 px-4"
                        style={{ paddingLeft: `${(level * 24) + 16}px` }}
                    >
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => hasChildren && toggleNode(node.id)}
                                className={cn(
                                    "p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors",
                                    !hasChildren && "invisible"
                                )}
                            >
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>

                            <div className="flex flex-col">
                                <span className={cn(
                                    "font-medium text-slate-800",
                                    level === 0 && "text-base font-bold",
                                    level === 1 && "text-[15px] font-semibold",
                                    level >= 2 && "text-sm"
                                )}>
                                    {node.name}
                                </span>
                                <span className="text-xs text-slate-500 font-mono mt-0.5">{node.code}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">
                                {node.type}
                            </span>
                            <div className={cn(
                                "w-32 text-right font-medium text-sm",
                                node.balance > 0 ? "text-slate-800" :
                                    node.balance < 0 ? "text-slate-800" :
                                        "text-slate-400"
                            )}>
                                ₹{Math.abs(node.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                <span className="text-[10px] text-slate-400 ml-1">
                                    {node.balance > 0 ? 'Dr' : node.balance < 0 ? 'Cr' : ''}
                                </span>
                            </div>
                        </div>
                    </div>

                    {hasChildren && isExpanded && (
                        <div className="bg-slate-50/50">
                            {renderAccountTree(node.children!, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Chart of Accounts</h1>
                    <p className="text-sm text-slate-500">Manage your accounting ledgers and groups</p>
                </div>

                <Link
                    href="/masters/accounts/new"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] transition-colors"
                >
                    <Plus size={18} />
                    <span>Add Account</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search accounts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                <div className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200 flex px-4">
                    <div className="flex-1 px-8 py-3 font-medium">Account Name</div>
                    <div className="w-32 py-3 font-medium text-center">Type</div>
                    <div className="w-32 py-3 font-medium text-right mr-4">Closing Balance</div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    {isLoading ? (
                        <div className="p-8 space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="animate-pulse flex items-center justify-between">
                                    <div className="flex gap-4 items-center w-1/2">
                                        <div className="w-6 h-6 bg-slate-200 rounded"></div>
                                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                    </div>
                                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                                </div>
                            ))}
                        </div>
                    ) : accounts?.length === 0 ? (
                        <div className="p-16 text-center text-slate-500 flex flex-col items-center">
                            <BookOpen size={48} className="text-slate-300 mb-4" />
                            <p className="text-lg font-medium text-slate-700">No accounts configured</p>
                            <p className="text-sm mt-1">Chart of accounts is empty. Add a new account to begin.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {renderAccountTree(search ? flattenAccounts(accounts, search) : accounts)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper to flat search results
function flattenAccounts(nodes: Account[], searchTerm: string): Account[] {
    let result: Account[] = [];
    const term = searchTerm.toLowerCase();

    nodes.forEach(node => {
        if (node.name.toLowerCase().includes(term) || node.code.toLowerCase().includes(term)) {
            // Return a stripped down version without children for flat searching
            result.push({ ...node, children: [] });
        }
        if (node.children) {
            result = result.concat(flattenAccounts(node.children, searchTerm));
        }
    });

    return result;
}
