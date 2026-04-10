'use client';

import { Globe, Check } from 'lucide-react';
import { useI18n, SUPPORTED_LOCALES } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 pb-2 border-b border-gray-100 dark:border-gray-700">
        {t('settings.language')}
      </h3>
      <p className="text-[13px] text-gray-400 dark:text-gray-500 -mt-1">
        {t('settings.languageDesc')}
      </p>
      <div className="grid grid-cols-2 gap-3 mt-1">
        {SUPPORTED_LOCALES.map(({ code, name, nativeName }) => {
          const isActive = locale === code;
          return (
            <button
              key={code}
              onClick={() => setLocale(code)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                isActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
              }`}
            >
              <Globe
                className={`w-5 h-5 shrink-0 ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div
                  className={`text-[13px] font-bold ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {name}
                </div>
                <div className="text-[11px] text-gray-400 dark:text-gray-500">{nativeName}</div>
              </div>
              {isActive && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
