'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import api from '@/lib/api';
import { Save, UploadCloud, Building2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface CompanyProfileData {
    name: string;
    email: string;
    phone: string;
    website: string;
    gstin: string;
    pan_number: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
}

export default function CompanyProfilePage() {
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [signatureFile, setSignatureFile] = useState<File | null>(null);

    const { data: profile, isLoading } = useQuery({
        queryKey: ['company_settings'],
        queryFn: async () => {
            const res = await api.get('/v1/settings/company');
            return res.data;
        }
    });

    const { control, handleSubmit, reset } = useForm<CompanyProfileData>({
        defaultValues: {
            name: '', email: '', phone: '', website: '', gstin: '',
            pan_number: '', address: '', city: '', state: '', pincode: ''
        },
        values: profile || undefined,
    });

    const saveMutation = useMutation({
        mutationFn: async (data: CompanyProfileData) => {
            await api.put('/v1/settings/company', data);

            if (logoFile) {
                const formData = new FormData();
                formData.append('logo', logoFile);
                await api.post('/v1/settings/company/logo', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (signatureFile) {
                const formData = new FormData();
                formData.append('signature', signatureFile);
                await api.post('/v1/settings/company/signature', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
        },
        onSuccess: () => {
            toast.success('Company profile updated successfully');
        },
        onError: () => {
            toast.error('Failed to update company profile');
        }
    });

    const onSubmit = (data: CompanyProfileData) => {
        saveMutation.mutate(data);
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading profile...</div>;

    return (
        <div className="max-w-4xl space-y-6 pb-12">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Company Profile</h1>
                <p className="text-sm text-slate-500">Manage your business details, branding, and tax information</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="col-span-1 md:col-span-2 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Building2 className="text-[#F59E0B]" size={20} />
                        <h2 className="text-lg font-bold text-slate-800">Basic Information</h2>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Company / Trade Name <span className="text-red-500">*</span></label>
                        <Controller control={control} name="name" rules={{ required: true }} render={({ field }) => (
                            <input type="text" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <Controller control={control} name="email" render={({ field }) => (
                            <input type="email" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                        <Controller control={control} name="phone" render={({ field }) => (
                            <input type="text" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">GSTIN</label>
                        <Controller control={control} name="gstin" render={({ field }) => (
                            <input type="text" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] uppercase" placeholder="e.g. 22AAAAA0000A1Z5" />
                        )} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">PAN Number</label>
                        <Controller control={control} name="pan_number" render={({ field }) => (
                            <input type="text" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] uppercase" />
                        )} />
                    </div>

                    <div className="col-span-1 md:col-span-2 flex items-center gap-2 border-b border-slate-100 pb-2 mt-4">
                        <MapPin className="text-[#F59E0B]" size={20} />
                        <h2 className="text-lg font-bold text-slate-800">Registered Address</h2>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
                        <Controller control={control} name="address" render={({ field }) => (
                            <textarea {...field} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] resize-none" />
                        )} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                        <Controller control={control} name="city" render={({ field }) => (
                            <input type="text" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">State / Province</label>
                        <Controller control={control} name="state" render={({ field }) => (
                            <input type="text" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">PIN / ZIP Code</label>
                        <Controller control={control} name="pincode" render={({ field }) => (
                            <input type="text" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>

                    <div className="col-span-1 md:col-span-2 flex items-center gap-2 border-b border-slate-100 pb-2 mt-4">
                        <UploadCloud className="text-[#F59E0B]" size={20} />
                        <h2 className="text-lg font-bold text-slate-800">Branding & Assets</h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Company Logo (For Invoices)</label>
                        <input type="file" accept="image/png, image/jpeg" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">E-Signature (For Invoices)</label>
                        <input type="file" accept="image/png, image/jpeg" onChange={(e) => setSignatureFile(e.target.files?.[0] || null)} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>

                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saveMutation.isPending}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] font-medium transition-colors disabled:opacity-70"
                    >
                        <Save size={18} />
                        {saveMutation.isPending ? 'Saving Profile...' : 'Save Profile Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
}
