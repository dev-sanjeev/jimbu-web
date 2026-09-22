import { getDeviceId, getDeviceName } from '@/services/device.service';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';
// ─── 1. Fail-fast validation ──────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL;
if (!BASE_URL) {
    throw new Error('Core Configuration Failure: VITE_API_URL is undefined. ' +
        'Copy .env.example to .env and set the backend URL.');
}
// ─── 3. Memory cache — populated once at boot, interceptor stays synchronous ──
let cachedDeviceId = null;
let cachedDeviceName = null;
export const initializeDeviceMetadata = async () => {
    try {
        cachedDeviceId = await getDeviceId();
        cachedDeviceName = getDeviceName();
    }
    catch (error) {
        console.error('[apiClient] Failed to initialize device metadata:', error);
        cachedDeviceId = 'unknown_device';
        cachedDeviceName = 'unknown_name';
    }
};
export function createApiClient(deps) {
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
    client.interceptors.request.use((config) => {
        const token = deps.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (!config.skipDeviceHeaders) {
            const deviceId = deps.getCachedDeviceId();
            const deviceName = deps.getCachedDeviceName();
            if (deviceId)
                config.headers['x-device-id'] = deviceId;
            if (deviceName)
                config.headers['x-device-name'] = deviceName;
        }
        return config;
    }, (error) => Promise.reject(error));
    client.interceptors.response.use((response) => {
        const body = response.data;
        if (body && typeof body === 'object' && body.success === true && 'data' in body) {
            response.data = body.data;
        }
        return response;
    }, async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && originalRequest) {
            // Don't retry the refresh call itself — that would infinite-loop
            const isRefreshCall = originalRequest.url?.includes('/auth/refresh');
            if (!isRefreshCall && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    // No body needed — browser sends the refresh_token cookie automatically
                    await client.post('/auth/refresh', {}, { skipDeviceHeaders: false });
                    return client(originalRequest);
                }
                catch {
                    useAuthStore.getState().logout();
                }
            }
            else {
                useAuthStore.getState().logout();
            }
        }
        const message = error.response?.data?.message ?? error.message ?? 'Unknown error';
        const err = new Error(message);
        err.statusCode = error.response?.status ?? 0;
        return Promise.reject(err);
    });
    return client;
}
// ─── 5. Production singleton ──────────────────────────────────────────────────
export default createApiClient({
    baseURL: BASE_URL,
    getToken: () => useAuthStore.getState().token,
    getCachedDeviceId: () => cachedDeviceId,
    getCachedDeviceName: () => cachedDeviceName,
});
