import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  is_super_admin: boolean;
}

interface Tenant {
  id: number;
  name: string;
  subdomain: string;
  plan: string;
  status: string;
  pivot?: {
    role: string;
    is_active: boolean;
  };
  setting?: {
    gstin?: string;
    logo?: string;
    currency: string;
    decimal_places: number;
    invoice_prefix: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  currentTenant: Tenant | null;
  tenants: Tenant[];
  setAuth: (user: User, token: string, tenants: Tenant[]) => void;
  setTenant: (tenant: Tenant) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setIsHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      currentTenant: null,
      tenants: [],
      isAuthenticated: false,
      isHydrated: false,
      setIsHydrated: (state) => set({ isHydrated: state }),

      setAuth: (user, token, tenants) => {
        localStorage.setItem('auth_token', token);
        const defaultTenant = tenants[0] ?? null;
        if (defaultTenant) {
          localStorage.setItem('tenant_id', String(defaultTenant.id));
        }
        set({
          user,
          token,
          tenants,
          currentTenant: defaultTenant,
          isAuthenticated: true,
        });
      },

      setTenant: (tenant) => {
        localStorage.setItem('tenant_id', String(tenant.id));
        set({ currentTenant: tenant });
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('tenant_id');
        set({ user: null, token: null, currentTenant: null, tenants: [], isAuthenticated: false });
      },
    }),
    {
      name: 'topnotch-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        currentTenant: state.currentTenant,
        tenants: state.tenants,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
