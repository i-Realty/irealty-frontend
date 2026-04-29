'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Wallet,
  ArrowRightLeft,
  Calendar,
  Settings,
  LogOut,
  X,
  ChevronUp,
  ChevronDown,
  Check,
  Plus,
} from 'lucide-react';
import { useSidebarStore } from '@/lib/store/useSidebarStore';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { getNavItems, getRoleFromPath, getDashboardRoot } from '@/config/nav';
import { useI18n } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n';

const FALLBACK_AVATAR = '/images/demo-avatar.jpg';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, close } = useSidebarStore();
  const { user, logout } = useAuthStore();
  const {
    activeAccount,
    accounts,
    setAddAccountModalOpen,
    switchAccount,
  } = useSettingsStore();

  const [isMobileAccountMenuOpen, setIsMobileAccountMenuOpen] = useState(false);

  // Derive nav from URL pathname — always correct regardless of auth store state
  const navItems = getNavItems(getRoleFromPath(pathname ?? ''));
  const { t } = useI18n();

  const handleLogout = () => {
    logout();
    close();
    router.push('/auth/login');
  };

  const displayName = user?.displayName ?? activeAccount.name;
  const avatarUrl = user?.avatarUrl ?? FALLBACK_AVATAR;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={close}
      />

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 md:w-64 bg-white dark:bg-[#171717] border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 shadow-xl md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Area */}
        <div className="h-16 flex flex-shrink-0 items-center justify-between px-6 border-b border-gray-100">
          <Link href="/">
            <Image src="/logo.png" alt="i-Realty" width={110} height={36} className="object-contain" priority />
          </Link>
          <button onClick={close} className="md:hidden p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 no-scrollbar">
          <nav className="space-y-1">
            {navItems.map((item, index) => {
              if (item.isHeader) {
                return (
                  <div key={index} className="px-6 pt-5 pb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {item.label}
                    </span>
                  </div>
                );
              }

              const dashboardRoots = ['/dashboard/agent', '/dashboard/admin', '/dashboard/seeker', '/dashboard/developer', '/dashboard/diaspora', '/dashboard/landlord'];
              const isDashboardRoot = dashboardRoots.includes(item.href!);
              const isActive =
                pathname === item.href ||
                (!isDashboardRoot && pathname.startsWith(item.href! + '/'));
              const Icon = item.icon!;

              return (
                <Link
                  key={index}
                  href={item.href!}
                  onClick={close}
                  className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50/70 dark:bg-blue-900/30 text-blue-600 border-r-4 border-blue-600'
                      : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 border-r-4 border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={isActive ? 'font-bold' : ''}>{item.i18nKey ? t(item.i18nKey as TranslationKey) : item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Account Switcher */}
        <div className="md:hidden w-full border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-[#111111] pb-8 pt-2 px-4 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">Account</p>

          <div className="relative bg-white border border-gray-100 rounded-2xl p-1 shadow-sm">
            <button
              onClick={() => setIsMobileAccountMenuOpen(!isMobileAccountMenuOpen)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full border border-gray-200 object-cover shadow-sm"
                />
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-[14px] font-bold text-gray-900 leading-none tracking-tight">
                    {displayName}
                  </span>
                  <span className="text-[12px] font-medium text-gray-400 truncate max-w-[120px]">
                    {user?.email ?? 'Einstein.Oyakhi@...'}
                  </span>
                </div>
              </div>
              {isMobileAccountMenuOpen ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {isMobileAccountMenuOpen && (
              <div className="w-full bg-white border-t border-gray-100 flex flex-col py-1 animate-in slide-in-from-bottom-2 fade-in duration-200">
                {accounts.map((acc) => {
                  const isActive = activeAccount.id === acc.id;
                  return (
                    <button
                      key={acc.id}
                      onClick={async () => {
                        await switchAccount(acc.id);
                        router.push(getDashboardRoot(acc.role as Parameters<typeof getDashboardRoot>[0]));
                        setIsMobileAccountMenuOpen(false);
                        close();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-3 hover:bg-gray-50 transition-colors ${(user?.id ?? activeAccount.id) === acc.id ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={avatarUrl}
                          alt={acc.name}
                          width={36}
                          height={36}
                          className="w-9 h-9 rounded-full border border-gray-200 object-cover opacity-90"
                        />
                        <div className="flex flex-col items-start gap-0">
                          <span className={`text-[13px] leading-tight ${(user?.id ?? activeAccount.id) === acc.id ? 'font-bold text-blue-700' : 'font-semibold text-gray-800'}`}>
                            {acc.name}
                          </span>
                          <span className="text-[11px] font-medium text-gray-400 capitalize">{acc.role}</span>
                        </div>
                      </div>
                      {(user?.id ?? activeAccount.id) === acc.id && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  );
                })}

                <button
                  onClick={() => {
                    setIsMobileAccountMenuOpen(false);
                    close();
                    setAddAccountModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-4 border-t border-gray-50 text-blue-600 font-bold text-[13px] hover:bg-gray-50 transition-colors mt-1"
                >
                  <Plus className="w-4 h-4" /> Add Account
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 mt-4 w-full text-sm font-bold tracking-tight text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Desktop Logout Button */}
        <div className="hidden md:block p-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
