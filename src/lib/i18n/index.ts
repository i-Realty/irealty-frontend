import { create } from 'zustand';
import type { Locale } from './types';
import en, { type TranslationKey } from './translations/en';
import yo from './translations/yo';
import ig from './translations/ig';
import ha from './translations/ha';

const translations: Record<Locale, Record<TranslationKey, string>> = {
  en,
  yo,
  ig,
  ha,
};

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  return (localStorage.getItem('irealty-locale') as Locale) || 'en';
}

export const useI18n = create<I18nState>((set, get) => ({
  locale: getStoredLocale(),

  setLocale: (locale) => {
    localStorage.setItem('irealty-locale', locale);
    // Update html lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
    set({ locale });
  },

  t: (key) => {
    const { locale } = get();
    return translations[locale]?.[key] ?? translations.en[key] ?? key;
  },
}));

// Re-export types for convenience
export type { TranslationKey } from './translations/en';
export type { Locale, LocaleInfo } from './types';
export { SUPPORTED_LOCALES } from './types';
