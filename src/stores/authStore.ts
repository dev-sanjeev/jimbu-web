import * as SecureStore from '@/shared/secureStorage';
import { create } from 'zustand';

export interface AuthUser {
  sub: string;
  username: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  setToken: (accessToken: string, refreshToken: string) => Promise<void>;
  setUser: (partial: Partial<AuthUser>) => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

function decodeJwtPayload(token: string): AuthUser | null {
  try {
    const base64Payload = token.split('.')[1];
    const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return JSON.parse(atob(padded)) as AuthUser;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isHydrating: true,

  setToken: async (accessToken, refreshToken) => {
    const user = decodeJwtPayload(accessToken);
    if (!user) {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      set({ token: null, refreshToken: null, user: null, isAuthenticated: false });
      return;
    }
    await SecureStore.setItemAsync('access_token', accessToken);
    await SecureStore.setItemAsync('refresh_token', refreshToken);
    set({ token: accessToken, refreshToken, user, isAuthenticated: true });
  },

  setUser: (partial) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : state.user,
    })),

  logout: async () => {
    const { token } = get();
    const BASE_URL = import.meta.env.VITE_API_URL as string;
    const deviceId = localStorage.getItem('device_id') ?? '';
    try {
      // Use fetch directly to avoid circular dep with apiClient and infinite
      // recursion when the 401 handler itself calls logout().
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(deviceId ? { 'x-device-id': deviceId } : {}),
        },
      });
    } catch {
      // ignore — clear local state regardless
    }
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    set({ token: null, refreshToken: null, user: null, isAuthenticated: false });
  },

  hydrate: async () => {
    try {
      // Try localStorage first (email/password and mobile flows)
      const token = await SecureStore.getItemAsync('access_token');
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      const user = token ? decodeJwtPayload(token) : null;
      if (token && user) {
        set({ token, refreshToken, user, isAuthenticated: true, isHydrating: false });
        return;
      }
      if (token) {
        await SecureStore.deleteItemAsync('access_token');
        await SecureStore.deleteItemAsync('refresh_token');
      }

      // No localStorage token — try cookie-based auth (Google OAuth web flow)
      const BASE_URL = import.meta.env.VITE_API_URL as string;
      const res = await fetch(`${BASE_URL}/auth/me`, { credentials: 'include' });
      if (res.ok) {
        // Backend wraps all responses in { success, statusCode, data }
        const json = await res.json();
        const cookieUser = (json?.data ?? json) as AuthUser;
        set({ token: null, refreshToken: null, user: cookieUser, isAuthenticated: true, isHydrating: false });
        return;
      }

      set({ token: null, refreshToken: null, user: null, isAuthenticated: false, isHydrating: false });
    } catch (error) {
      console.error('[authStore] Failed to hydrate session:', error);
      set({ token: null, refreshToken: null, user: null, isAuthenticated: false, isHydrating: false });
    }
  },
}));
