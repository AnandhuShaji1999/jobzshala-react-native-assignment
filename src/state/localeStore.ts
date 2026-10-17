import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Locale } from '@/i18n/strings';

interface LocaleState {
  locale: Locale;
  toggleLocale: () => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'en',
      toggleLocale: () => set((state) => ({ locale: state.locale === 'en' ? 'hi' : 'en' })),
    }),
    {
      name: 'jobzshala-locale',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
