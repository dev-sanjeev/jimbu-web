import * as SecureStore from '@/shared/secureStorage';
import { create } from 'zustand';
export const useThemeStore = create((set) => ({
    themeId: 'royalBlue',
    setTheme: async (themeId) => {
        await SecureStore.setItemAsync('theme_id', themeId);
        set({ themeId });
    },
    hydrateTheme: async () => {
        const stored = await SecureStore.getItemAsync('theme_id');
        if (stored) {
            set({ themeId: stored });
        }
    },
}));
