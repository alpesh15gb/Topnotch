'use client';

import { useState } from 'react';
import { Plus, ArrowLeft, Mail, Shield } from 'lucide-react';
import Link from 'next/link';

export default function UsersSettingsPage() {
    // Mock data as the backend user management might be complex (Tenant Pivots)
    const users = [
        { id: 1, name: 'Alpesh Patel', email: 'admin@topnotch.com', role: 'Owner', status: 'Active', isSelf: true },
        { id: 2, name: 'Accounts Team', email: 'accounts@topnotch.com', role: 'Accountant', status: 'Active', isSelf: false },
        { id: 3, name: 'Sales Rep 1', email: 'sales@topnotch.com', role: 'Sales', status: 'Pending', isSelf: false },
    ];

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center gap-4">
                <Link href="/settings" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex-1 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Users & Roles</h1>
                        <p className="text-sm text-slate-500">Manage team access and permissions</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] font-medium text-sm transition-colors shadow-sm">
                        <Plus size={16} /> Invite User
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                            <th className="px-6 py-3 font-medium">User</th>
                            <th className="px-6 py-3 font-medium px-4">Role</th>
                            <th className="px-6 py-3 font-medium text-center">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 shrink-0">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 flex items-center gap-2">
                                                {user.name}
                                                {user.isSelf && <span className="px-1.5 py-0.5 text-[10px] bg-slate-100 text-slate-500 rounded uppercase font-bold">You</span>}
                                            </div>
                                            <div className="text-sm text-slate-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                                        <Shield size={14} className="text-slate-400" />
                                        {user.role}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {!user.isSelf && (
                                        <div className="flex justify-end gap-3 text-sm font-medium text-blue-600">
                                            {user.status === 'Pending' && <button className="hover:text-blue-800">Resend Invite</button>}
                                            <button className="hover:text-blue-800">Edit</button>
                                            <button className="text-red-500 hover:text-red-700">Revoke</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
