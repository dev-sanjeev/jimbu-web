import type { ThemeId } from '@/shared/Themes';
import * as SecureStore from '@/shared/secureStorage';
import { create } from 'zustand';

export type { ThemeId };

interface ThemeState {
  themeId: ThemeId;
  setTheme: (id: ThemeId) => Promise<void>;
  hydrateTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  themeId: 'royalBlue',

  setTheme: async (themeId) => {
    await SecureStore.setItemAsync('theme_id', themeId);
    set({ themeId });
  },

  hydrateTheme: async () => {
    const stored = await SecureStore.getItemAsync('theme_id');
    if (stored) {
      set({ themeId: stored as ThemeId });
    }
  },
}));
