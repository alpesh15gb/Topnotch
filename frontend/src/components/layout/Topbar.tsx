'use client';

import { useRouter } from 'next/navigation';
import { Menu, Bell, LogOut, User, ChevronDown, Building2 } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useState } from 'react';

export function Topbar({ title }: { title?: string }) {
  const router = useRouter();
  const { toggleSidebar } = useUIStore();
  const { user, currentTenant, tenants, logout, setTenant } = useAuthStore();
  const { notifications } = useUIStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [tenantMenuOpen, setTenantMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    try {
      await api.post('/v1/auth/logout');
    } catch {}
    logout();
    router.push('/login');
    toast.success('Logged out');
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 gap-4 z-10">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
          <Menu size={20} className="text-gray-600" />
        </button>
        {title && <h1 className="font-semibold text-gray-800 text-sm">{title}</h1>}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Tenant switcher */}
        <div className="relative">
          <button
            onClick={() => setTenantMenuOpen(!tenantMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
          >
            <Building2 size={14} className="text-gray-500" />
            <span className="max-w-32 truncate font-medium">{currentTenant?.name ?? 'Select Company'}</span>
            <ChevronDown size={12} className="text-gray-400" />
          </button>
          {tenantMenuOpen && tenants.length > 1 && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 min-w-48">
              {tenants.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTenant(t); setTenantMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Building2 size={14} />
                  <span className="truncate">{t.name}</span>
                  {currentTenant?.id === t.id && <span className="ml-auto text-[#F59E0B] text-xs">Active</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={18} className="text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 text-sm"
          >
            <div className="w-7 h-7 rounded-full bg-[#0F172A] text-white text-xs flex items-center justify-center font-medium">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <span className="hidden md:block font-medium text-gray-700 max-w-24 truncate">{user?.name}</span>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 min-w-44">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-medium text-sm text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => { setUserMenuOpen(false); router.push('/settings'); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
              >
                <User size={14} /> Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 flex items-center gap-2 text-red-600"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
