'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { DownloadCloud, Cloud, ShieldCheck, DatabaseBackup } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Backup {
    id: number;
    filename: string;
    size: string;
    created_at: string;
    type: 'local' | 'google_drive';
}

export default function BackupsPage() {
    const { data: backups, isLoading, refetch } = useQuery({
        queryKey: ['backups'],
        queryFn: async () => {
            const res = await api.get('/v1/backups').catch(() => ({
                data: []
            }));
            return res.data;
        }
    });

    const generateLocalMutation = useMutation({
        mutationFn: async () => {
            await api.post('/v1/backups/local');
        },
        onSuccess: () => {
            toast.success('Local backup triggered successfully');
            refetch();
        },
        onError: () => toast.error('Failed to trigger local backup')
    });

    const generateDriveMutation = useMutation({
        mutationFn: async () => {
            await api.post('/v1/backups/google-drive');
        },
        onSuccess: () => {
            toast.success('Google Drive backup triggered successfully');
            refetch();
        },
        onError: () => toast.error('Failed to trigger Drive backup')
    });

    return (
        <div className="max-w-4xl space-y-6 pb-12">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Database Backups</h1>
                <p className="text-sm text-slate-500">Securely backup your financial data and prevent data loss</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <DatabaseBackup size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">Local Server Backup</h3>
                            <p className="text-sm text-slate-500 mt-1">Generate a manual backup of the database to be stored securely on the local server disk.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => generateLocalMutation.mutate()}
                        disabled={generateLocalMutation.isPending}
                        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors border border-slate-300 disabled:opacity-50"
                    >
                        {generateLocalMutation.isPending ? 'Generating...' : 'Trigger Local Backup Now'}
                    </button>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 border-t-4 border-t-[#F59E0B] shadow-sm">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-amber-50 text-[#F59E0B] rounded-lg">
                            <Cloud size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">Google Drive Sync</h3>
                            <p className="text-sm text-slate-500 mt-1">Safely encrypt and push a copy of your financial data to a connected Google Drive account.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => generateDriveMutation.mutate()}
                        disabled={generateDriveMutation.isPending}
                        className="w-full py-2.5 bg-[#0F172A] hover:bg-[#1e3a5f] text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                        {generateDriveMutation.isPending ? 'Syncing to Drive...' : 'Backup to Google Drive'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-8">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <ShieldCheck className="text-emerald-500" size={20} />
                        Recent Backups Map
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                                <th className="px-6 py-3 font-medium">Date & Time</th>
                                <th className="px-6 py-3 font-medium">Type</th>
                                <th className="px-6 py-3 font-medium">File Size</th>
                                <th className="px-6 py-3 font-medium w-32 border-l border-slate-200">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {isLoading ? (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading backup history...</td></tr>
                            ) : backups?.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-sm">No backups have been taken yet.</td></tr>
                            ) : (
                                backups?.map((backup: Backup) => (
                                    <tr key={backup.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {format(new Date(backup.created_at), 'dd MMM yyyy, HH:mm')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full uppercase">
                                                {backup.type.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 text-sm">
                                            {backup.size}
                                        </td>
                                        <td className="px-6 py-4 border-l border-slate-200">
                                            <button className="flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:text-blue-800">
                                                <DownloadCloud size={16} />
                                                Download
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
