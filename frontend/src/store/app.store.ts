import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = '@buildmart_language';

interface AppState {
  language: 'en' | 'hi' | 'te';
  setLanguage: (lang: 'en' | 'hi' | 'te') => Promise<void>;
  unreadNotifications: number;
  setUnreadNotifications: (count: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'en',

  setLanguage: async (lang: 'en' | 'hi' | 'te') => {
    try {
      const i18n = (await import('../i18n')).default;
      await i18n.changeLanguage(lang);
    } catch {
      // i18n might not be initialized yet
    }
    await AsyncStorage.setItem(LANGUAGE_KEY, lang).catch(() => {});
    set({ language: lang });
  },

  unreadNotifications: 0,
  setUnreadNotifications: (count: number) => set({ unreadNotifications: count }),
}));
