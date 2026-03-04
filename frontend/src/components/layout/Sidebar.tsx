'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import {
  LayoutDashboard, FileText, ShoppingCart, Wallet, BarChart3,
  Users, Settings, Database, Package, ChevronDown, ChevronRight,
  TrendingUp, CreditCard, Receipt, ArrowLeftRight, Building2, Tag, Percent
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: 'Sales',
    icon: <TrendingUp size={18} />,
    children: [
      { label: 'Estimates', href: '/sales/estimates' },
      { label: 'Sale Orders', href: '/sales/sale-orders' },
      { label: 'Proforma Invoices', href: '/sales/proforma' },
      { label: 'Invoices', href: '/sales/invoices' },
    ],
  },
  {
    label: 'Purchases',
    icon: <ShoppingCart size={18} />,
    children: [
      { label: 'Purchase Orders', href: '/purchases/purchase-orders' },
      { label: 'Bills', href: '/purchases/bills' },
      { label: 'Expenses', href: '/purchases/expenses' },
    ],
  },
  {
    label: 'Cash & Bank',
    icon: <Wallet size={18} />,
    children: [
      { label: 'Bank Accounts', href: '/banking/accounts' },
      { label: 'Cheques', href: '/banking/cheques' },
      { label: 'Loans', href: '/banking/loans' },
      { label: 'Fund Transfers', href: '/banking/fund-transfers' },
    ],
  },
  {
    label: 'Reports',
    icon: <BarChart3 size={18} />,
    children: [
      { label: 'Sales Report', href: '/reports/sales' },
      { label: 'Purchase Report', href: '/reports/purchases' },
      { label: 'Daybook', href: '/reports/daybook' },
      { label: 'Profit & Loss', href: '/reports/profit-loss' },
      { label: 'Balance Sheet', href: '/reports/balance-sheet' },
      { label: 'Cash Flow', href: '/reports/cash-flow' },
      { label: 'Party Statement', href: '/reports/party-statement' },
      { label: 'GSTR-1', href: '/reports/gstr1' },
      { label: 'GSTR-3B', href: '/reports/gstr3b' },
    ],
  },
  {
    label: 'Masters',
    icon: <Database size={18} />,
    children: [
      { label: 'Parties', href: '/masters/parties' },
      { label: 'Items', href: '/masters/items' },
      { label: 'Accounts (COA)', href: '/masters/accounts' },
      { label: 'Tax Rates', href: '/masters/tax-rates' },
    ],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings size={18} />,
  },
  {
    label: 'Backup',
    href: '/backup',
    icon: <Database size={18} />,
  },
];

function NavGroup({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = item.href
    ? pathname === item.href || pathname.startsWith(item.href + '/')
    : item.children?.some((c) => pathname.startsWith(c.href));

  const [open, setOpen] = useState(isActive ?? false);

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          pathname === item.href || pathname.startsWith(item.href + '/')
            ? 'bg-[#F59E0B] text-[#0F172A]'
            : 'text-slate-300 hover:bg-white/10 hover:text-white'
        )}
      >
        {item.icon}
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          isActive ? 'text-[#F59E0B]' : 'text-slate-300 hover:bg-white/10 hover:text-white'
        )}
      >
        {item.icon}
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </>
        )}
      </button>
      {!collapsed && open && item.children && (
        <div className="ml-7 mt-1 space-y-1">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                'block px-3 py-1.5 rounded-md text-sm transition-colors',
                pathname === child.href || pathname.startsWith(child.href + '/')
                  ? 'text-[#F59E0B] font-medium'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const { sidebarOpen } = useUIStore();
  const collapsed = !sidebarOpen;

  return (
    <aside
      className={cn(
        'h-screen bg-[#0F172A] flex flex-col sidebar-transition overflow-hidden',
        collapsed ? 'w-14' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 bg-[#F59E0B] rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-[#0F172A] font-bold text-sm">TN</span>
        </div>
        {!collapsed && (
          <span className="text-white font-bold text-lg tracking-tight">TopNotch</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <NavGroup key={item.label} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 border-t border-white/10 pt-4">
        <div className={cn('flex items-center gap-3 px-3 py-2 text-slate-400 text-sm', collapsed && 'justify-center')}>
          <Building2 size={16} />
          {!collapsed && <span className="truncate text-xs">Demo Company</span>}
        </div>
      </div>
    </aside>
  );
}
