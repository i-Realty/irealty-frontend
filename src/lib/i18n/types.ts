export type Locale = 'en' | 'fr';

export interface LocaleInfo {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LOCALES: LocaleInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: 'GB' },
  { code: 'fr', name: 'French', nativeName: 'Francais', flag: 'FR' },
];
