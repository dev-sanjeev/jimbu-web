import * as SecureStore from '@/shared/secureStorage';
import { create } from 'zustand';
const STORAGE_KEY = 'auth_flow';
async function saveToStorage(state) {
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(state));
}
export const useAuthFlowStore = create((set, get) => ({
    email: null,
    mode: null,
    otpCode: null,
    setFlow: async (email, mode) => {
        set({ email, mode, otpCode: null });
        await saveToStorage({ email, mode, otpCode: null });
    },
    setOtpCode: async (otpCode) => {
        const { email, mode } = get();
        set({ otpCode });
        await saveToStorage({ email, mode, otpCode });
    },
    clearOtpCode: async () => {
        const { email, mode } = get();
        set({ otpCode: null });
        await saveToStorage({ email, mode, otpCode: null });
    },
    clearFlow: async () => {
        set({ email: null, mode: null, otpCode: null });
        await SecureStore.deleteItemAsync(STORAGE_KEY);
    },
    hydrateFlow: async () => {
        const raw = await SecureStore.getItemAsync(STORAGE_KEY);
        if (!raw)
            return;
        try {
            const parsed = JSON.parse(raw);
            set({
                email: parsed.email ?? null,
                mode: parsed.mode ?? null,
                otpCode: parsed.otpCode ?? null,
            });
        }
        catch {
            // ignore corrupt storage
        }
    },
}));
