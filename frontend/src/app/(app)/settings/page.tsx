'use client';

import { Settings, Percent, Users, Building, ShieldCheck, Mail, Database } from 'lucide-react';
import Link from 'next/link';

const settingCategories = [
    {
        title: "Organization",
        description: "Manage company details, branding, and billing information.",
        links: [

            { name: "Subscription & Billing", href: "#", icon: <CreditCardIcon size={20} className="text-slate-500" /> },
        ]
    },
    {
        title: "Accounting & Tax",
        description: "Configure chart of accounts, tax rates, and financial year.",
        links: [
            { name: "Tax Rates (GST)", href: "/settings/tax", icon: <Percent size={20} className="text-slate-500" /> },
            { name: "Financial Year", href: "#", icon: <CalendarIcon size={20} className="text-slate-500" /> },
        ]
    },
    {
        title: "Team & Access",
        description: "Manage user accounts, roles, and permissions.",
        links: [
            { name: "Users & Roles", href: "/settings/users", icon: <Users size={20} className="text-slate-500" /> },
            { name: "Security & 2FA", href: "#", icon: <ShieldCheck size={20} className="text-slate-500" /> },
        ]
    },
    {
        title: "System",
        description: "Configure email templates, backups, and app settings.",
        links: [
            { name: "Email Templates", href: "#", icon: <Mail size={20} className="text-slate-500" /> },

        ]
    }
];

// Helper icons
function CreditCardIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg> }
function CalendarIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg> }

export default function SettingsPage() {
    return (
        <div className="space-y-6 pb-12 max-w-5xl">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
                <p className="text-sm text-slate-500">Manage your workspace configuration and preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settingCategories.map((category, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="font-bold text-slate-800">{category.title}</h2>
                            <p className="text-sm text-slate-500 mt-1">{category.description}</p>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {category.links.map((link, linkIdx) => (
                                <Link
                                    key={linkIdx}
                                    href={link.href}
                                    className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors group"
                                >
                                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all text-slate-600">
                                        {link.icon}
                                    </div>
                                    <span className="font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                                        {link.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
