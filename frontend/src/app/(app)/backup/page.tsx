'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { Database, Download, RefreshCw } from 'lucide-react';

interface Backup {
  id: number;
  filename: string;
  size: number;
  created_at: string;
  status: string;
}

export default function BackupPage() {
  const { data: backups = [], isLoading, refetch } = useQuery<Backup[]>({
    queryKey: ['backups'],
    queryFn: async () => {
      const res = await api.get('/v1/backups');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: () => api.post('/v1/backups'),
    onSuccess: () => refetch(),
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backup & Data</h1>
          <p className="text-gray-500 text-sm mt-1">Manage data backups</p>
        </div>
        <button
          onClick={() => createMutation.mutate()}
          disabled={createMutation.isPending}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
        >
          <Database className="w-4 h-4" />
          {createMutation.isPending ? 'Creating...' : 'Create Backup'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : backups.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Database className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No backups yet. Create your first backup.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Filename</th>
                <th className="px-4 py-3 text-left">Size</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {backups.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{b.filename}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatSize(b.size)}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">{b.status}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(b.created_at).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-blue-600 hover:text-blue-800 p-1"><Download className="w-4 h-4" /></button>
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
