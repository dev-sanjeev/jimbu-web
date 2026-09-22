import { getDeviceId, getDeviceName } from '@/services/device.service';
import { useAuthStore } from '@/stores/authStore';
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

// ─── 1. Fail-fast validation ──────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL as string | undefined;
if (!BASE_URL) {
  throw new Error(
    'Core Configuration Failure: VITE_API_URL is undefined. ' +
      'Copy .env.example to .env and set the backend URL.',
  );
}

// ─── 2. Opt-out flag for device headers per request ───────────────────────────
declare module 'axios' {
  interface AxiosRequestConfig {
    skipDeviceHeaders?: boolean;
  }
}

// ─── 3. Memory cache — populated once at boot, interceptor stays synchronous ──
let cachedDeviceId: string | null = null;
let cachedDeviceName: string | null = null;

export const initializeDeviceMetadata = async (): Promise<void> => {
  try {
    cachedDeviceId = await getDeviceId();
    cachedDeviceName = getDeviceName();
  } catch (error) {
    console.error('[apiClient] Failed to initialize device metadata:', error);
    cachedDeviceId = 'unknown_device';
    cachedDeviceName = 'unknown_name';
  }
};

// ─── 4. Factory ───────────────────────────────────────────────────────────────
export interface ApiClientDeps {
  baseURL: string;
  getToken: () => string | null;
  getCachedDeviceId: () => string | null;
  getCachedDeviceName: () => string | null;
}

export function createApiClient(deps: ApiClientDeps): AxiosInstance {
  const isNgrokTunnel = /\bngrok\b/.test(deps.baseURL);

  const client = axios.create({
    baseURL: deps.baseURL,
    timeout: 15000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      ...(isNgrokTunnel ? { 'ngrok-skip-browser-warning': 'true' } : {}),
    },
  });

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = deps.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (!config.skipDeviceHeaders) {
        const deviceId = deps.getCachedDeviceId();
        const deviceName = deps.getCachedDeviceName();
        if (deviceId) config.headers['x-device-id'] = deviceId;
        if (deviceName) config.headers['x-device-name'] = deviceName;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response) => {
      const body = response.data;
      if (body && typeof body === 'object' && body.success === true && 'data' in body) {
        response.data = body.data;
      }
      return response;
    },
    async (error: AxiosError<{ message?: string }>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && originalRequest) {
        // Don't retry the refresh call itself — that would infinite-loop
        const isRefreshCall = originalRequest.url?.includes('/auth/refresh');
        if (!isRefreshCall && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            // No body needed — browser sends the refresh_token cookie automatically
            await client.post('/auth/refresh', {}, { skipDeviceHeaders: false });
            return client(originalRequest);
          } catch {
            useAuthStore.getState().logout();
          }
        } else {
          useAuthStore.getState().logout();
        }
      }

      const message = error.response?.data?.message ?? error.message ?? 'Unknown error';
      const err = new Error(message) as Error & { statusCode: number };
      err.statusCode = error.response?.status ?? 0;
      return Promise.reject(err);
    },
  );

  return client;
}

// ─── 5. Production singleton ──────────────────────────────────────────────────
export default createApiClient({
  baseURL: BASE_URL,
  getToken: () => useAuthStore.getState().token,
  getCachedDeviceId: () => cachedDeviceId,
  getCachedDeviceName: () => cachedDeviceName,
});
