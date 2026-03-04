'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
  company_name: z.string().min(2, 'Company name required'),
  subdomain: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, hyphens'),
  gstin: z.string().length(15).optional().or(z.literal('')),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const res = await api.post('/v1/auth/register', data);
      setAuth(res.data.user, res.data.token, [res.data.tenant]);
      toast.success('Account created! Welcome to TopNotch.');
      router.push('/dashboard');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, key: keyof RegisterForm, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...register(key)}
        type={type}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
      />
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]?.message as string}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1e3a5f] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#0F172A]">TopNotch</h1>
          <p className="text-gray-500 mt-1">Start your free account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {field('Your Name', 'name', 'text', 'Raj Kumar')}
            {field('Email', 'email', 'email', 'raj@company.com')}
          </div>
          {field('Company Name', 'company_name', 'text', 'Acme Pvt Ltd')}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subdomain</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#F59E0B]">
              <input
                {...register('subdomain')}
                type="text"
                placeholder="acme"
                className="flex-1 px-3 py-2 focus:outline-none"
              />
              <span className="px-3 py-2 bg-gray-50 text-gray-500 text-sm border-l">.topnotch.app</span>
            </div>
            {errors.subdomain && <p className="text-red-500 text-xs mt-1">{errors.subdomain.message}</p>}
          </div>
          {field('GSTIN (optional)', 'gstin', 'text', '22AAAAA0000A1Z5')}
          <div className="grid grid-cols-2 gap-4">
            {field('Password', 'password', 'password', '••••••••')}
            {field('Confirm Password', 'password_confirmation', 'password', '••••••••')}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F172A] text-white py-2.5 rounded-lg font-medium hover:bg-[#1e3a5f] transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-[#F59E0B] hover:underline font-medium">Sign in</a>
        </p>
      </div>
    </div>
  );
}
