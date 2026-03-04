'use client';

import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Bell, Menu, Search, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function TopNavbar() {
    const { user, logout } = useAuthStore();
    const { toggleSidebar } = useUIStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10 transition-all">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                >
                    <Menu size={20} />
                </button>

                <div className="hidden md:flex items-center relative">
                    <Search size={16} className="absolute left-3 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] focus:bg-white transition-all w-64"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="p-2 text-slate-500 hover:text-[#F59E0B] relative">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                </button>

                <div className="h-8 w-px bg-slate-200 mx-2" />

                <div className="flex items-center gap-3 relative group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-700">{user?.name || 'User'}</p>
                        <p className="text-xs text-slate-500">{user?.is_super_admin ? 'Super Admin' : 'Admin'}</p>
                    </div>
                    <div className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-600">
                        <UserIcon size={18} />
                    </div>

                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                        <div className="p-2">
                            <button
                                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
                                onClick={() => router.push('/settings')}
                            >
                                Profile Settings
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md mt-1"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
