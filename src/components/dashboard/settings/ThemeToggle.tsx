'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore, type Theme } from '@/lib/store/useThemeStore';

const OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 pb-2 border-b border-gray-100 dark:border-gray-700">
        Appearance
      </h3>
      <p className="text-[13px] text-gray-400 dark:text-gray-500 -mt-1">
        Choose how i-Realty looks to you. Select a single theme, or sync with your system settings.
      </p>
      <div className="flex gap-3 mt-1">
        {OPTIONS.map(({ value, label, icon: Icon }) => {
          const isActive = theme === value;
          return (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex-1 flex flex-col items-center gap-2 px-4 py-4 rounded-xl border-2 transition-all ${
                isActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                }`}
              />
              <span
                className={`text-[13px] font-medium ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
