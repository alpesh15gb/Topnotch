'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { useUIStore } from '@/store/uiStore';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated, user, isHydrated } = useAuthStore();
    const { sidebarOpen } = useUIStore();

    useEffect(() => {
        if (isHydrated && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isHydrated, router]);

    if (!isHydrated || !isAuthenticated) {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <TopNavbar />
                <main className="flex-1 p-6 overflow-auto pt-20">
                    {children}
                </main>
            </div>
        </div>
    );
}
