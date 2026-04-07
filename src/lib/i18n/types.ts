export type Locale = 'en' | 'yo' | 'ig' | 'ha';

export interface LocaleInfo {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LOCALES: LocaleInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: 'GB' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yoruba', flag: 'NG' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flag: 'NG' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: 'NG' },
];
