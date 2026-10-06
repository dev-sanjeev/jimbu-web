import apiClient from '@/apiClient';
import { create } from 'zustand';

export interface AuthUser {
  sub: string;
  username: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  setUser: (partial: Partial<AuthUser>) => void;
  clearSession: () => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrating: true,

  setUser: (partial) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : state.user,
    })),

  // State-only reset — called by apiClient when refresh fails (no server call).
  clearSession: () => set({ user: null, isAuthenticated: false }),

  logout: async () => {
    try {
      // Use apiClient — device headers attached automatically by request interceptor.
      // Native fetch was used before to avoid a circular dep; that's resolved now.
      await apiClient.post('/auth/logout');
    } catch {
      // ignore — clear local state regardless
    }
    set({ user: null, isAuthenticated: false });
  },

  hydrate: async () => {
    try {
      // The apiClient interceptor handles 401 → /auth/refresh → retry automatically.
      const res = await apiClient.get<AuthUser>('/auth/me');
      set({ user: res.data, isAuthenticated: true, isHydrating: false });
    } catch {
      set({ user: null, isAuthenticated: false, isHydrating: false });
    }
  },
}));
