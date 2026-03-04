'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh',
];

export default function NewPartyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    type: 'customer', name: '', gstin: '', pan: '', email: '', phone: '',
    billing_address: '', city: '', state: '', pincode: '',
    credit_limit: '', payment_terms_days: '', opening_balance: '', balance_type: 'Dr',
  });

  const mutation = useMutation({
    mutationFn: (data: object) => api.post('/v1/parties', data),
    onSuccess: () => router.push('/masters/parties'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = Object.fromEntries(
      Object.entries({
        ...form,
        credit_limit: form.credit_limit ? parseFloat(form.credit_limit) : null,
        payment_terms_days: form.payment_terms_days ? parseInt(form.payment_terms_days) : null,
        opening_balance: form.opening_balance ? parseFloat(form.opening_balance) : null,
      }).map(([k, v]) => [k, v === '' ? null : v])
    );
    mutation.mutate(payload);
  };

  const field = (label: string, key: keyof typeof form, opts?: { type?: string; required?: boolean }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}{opts?.required && <span className="text-red-500 ml-1">*</span>}</label>
      <input
        type={opts?.type || 'text'}
        required={opts?.required}
        value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/masters/parties" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Party</h1>
          <p className="text-gray-500 text-sm">Customer, supplier or both</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Party Type <span className="text-red-500">*</span></label>
          <div className="flex gap-3">
            {['customer','supplier','both'].map(t => (
              <label key={t} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="type" value={t} checked={form.type === t} onChange={e => setForm({ ...form, type: e.target.value })} className="text-blue-600" />
                <span className="text-sm capitalize">{t}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          {field('Party Name', 'name', { required: true })}
          {field('GSTIN', 'gstin')}
          {field('PAN', 'pan')}
          {field('Email', 'email', { type: 'email' })}
          {field('Phone', 'phone')}
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-800">Address</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
            <textarea value={form.billing_address} onChange={e => setForm({ ...form, billing_address: e.target.value })} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {field('City', 'city')}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="">Select state</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {field('Pincode', 'pincode')}
          </div>
        </div>

        {/* Financial */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-800">Financial Details</h3>
          <div className="grid grid-cols-2 gap-4">
            {field('Credit Limit (₹)', 'credit_limit', { type: 'number' })}
            {field('Payment Terms (days)', 'payment_terms_days', { type: 'number' })}
            {field('Opening Balance (₹)', 'opening_balance', { type: 'number' })}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Balance Type</label>
              <select value={form.balance_type} onChange={e => setForm({ ...form, balance_type: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="Dr">Debit (Dr)</option>
                <option value="Cr">Credit (Cr)</option>
              </select>
            </div>
          </div>
        </div>

        {mutation.isError && <p className="text-red-500 text-sm">Failed to save. Please check your inputs.</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={mutation.isPending} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
            {mutation.isPending ? 'Saving...' : 'Save Party'}
          </button>
          <Link href="/masters/parties" className="border border-gray-300 px-6 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
