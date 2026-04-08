'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, ChevronDown, Check, Plus, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useSidebarStore } from '@/lib/store/useSidebarStore';
import { useMessagesStore } from '@/lib/store/useMessagesStore';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useNotificationStore } from '@/lib/store/useNotificationStore';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { getPageTitle, getDashboardRoot } from '@/config/nav';
import NotificationDropdown from '@/components/dashboard/NotificationDropdown';
import { useI18n } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n';

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop';

export default function TopNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggle } = useSidebarStore();
  const activeChatId = useMessagesStore((state) => state.activeChatId);
  const { user } = useAuthStore();

  const {
    activeAccount,
    accounts,
    setActiveAccount,
    setAddAccountModalOpen,
  } = useSettingsStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { notifications, isOpen: isNotifOpen, toggleDropdown: toggleNotif, fetchNotificationsMock } = useNotificationStore();
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const { theme, setTheme, resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme() === 'dark';
  const { t } = useI18n();

  useEffect(() => {
    fetchNotificationsMock();
  }, [fetchNotificationsMock]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const PAGE_TITLE_I18N: Record<string, TranslationKey> = {
    'Dashboard': 'nav.dashboard',
    'My Properties': 'nav.myProperties',
    'Messages': 'nav.messages',
    'Documents': 'nav.documents',
    'Wallet': 'nav.wallet',
    'Transactions': 'nav.transactions',
    'Calendar': 'nav.calendar',
    'Settings': 'settings.title',
    'Properties': 'nav.properties',
    'Favorites': 'nav.favorites',
    'Search Properties': 'nav.search',
  };
  const rawTitle = pathname ? getPageTitle(pathname) : 'Dashboard';
  const pageTitle = PAGE_TITLE_I18N[rawTitle] ? t(PAGE_TITLE_I18N[rawTitle]) : rawTitle;
  const isMessagesActive = pathname?.includes('/messages') && activeChatId !== null;

  const displayName = user?.displayName ?? activeAccount.name;
  const avatarUrl = user?.avatarUrl ?? FALLBACK_AVATAR;

  const handleAccountSwitch = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    setActiveAccount(accountId);
    setIsDropdownOpen(false);
    if (account) {
      // Navigate to the correct dashboard root for the selected role
      router.push(getDashboardRoot(account.role as Parameters<typeof getDashboardRoot>[0]));
    }
  };

  return (
    <header
      className={`h-16 bg-white dark:bg-[#171717] border-b border-gray-100 dark:border-gray-700 flex items-center justify-between px-4 md:px-6 z-[60] relative ${
        isMessagesActive ? 'hidden md:flex' : ''
      }`}
    >
      <div className="flex items-center gap-4 border-l border-gray-100 pl-4 ml-0 md:ml-0 md:border-l-0 md:pl-0">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="i-Realty"
            width={110}
            height={36}
            className="md:hidden object-contain"
          />
          <h1 className="text-xl font-bold text-gray-900 hidden md:block">{pageTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Dark/Light mode toggle */}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative">
          <button
            onClick={toggleNotif}
            className={`relative p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors ${isNotifOpen ? 'bg-gray-100' : ''}`}
          >
            <Bell className="w-6 h-6" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                {unreadNotifCount}
              </span>
            )}
          </button>
          <NotificationDropdown />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={toggle}
          className="md:hidden p-1 text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Menu className="w-8 h-8" />
        </button>

        {/* Desktop user profile + dropdown */}
        <div className="hidden md:flex relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200 focus:outline-none"
          >
            <Image
              src={avatarUrl}
              alt={displayName}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border border-gray-200 object-cover"
            />
            <span className="text-sm font-bold text-gray-800 tracking-tight">{displayName}</span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full mt-2 right-0 w-64 bg-white border border-gray-100 rounded-2xl shadow-lg shadow-gray-200/50 py-2 z-[70] animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="flex flex-col">
                {accounts.map((acc) => {
                  const isActive = activeAccount.id === acc.id;
                  return (
                    <button
                      key={acc.id}
                      onClick={() => handleAccountSwitch(acc.id)}
                      className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={avatarUrl}
                          alt={acc.name}
                          width={36}
                          height={36}
                          className="w-9 h-9 rounded-full border border-gray-200 object-cover shadow-sm"
                        />
                        <div className="flex flex-col items-start gap-0">
                          <span className="text-[14px] font-bold text-gray-900 leading-tight">
                            {acc.name}
                          </span>
                          <span className="text-[11px] font-medium text-gray-400 capitalize">
                            {acc.role}
                          </span>
                        </div>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  );
                })}
              </div>

              <div className="px-5 py-3 border-t border-gray-100 mt-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setAddAccountModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 text-blue-600 font-bold text-[14px] hover:text-blue-700 transition-colors py-1"
                >
                  <Plus className="w-4 h-4" /> Add Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
