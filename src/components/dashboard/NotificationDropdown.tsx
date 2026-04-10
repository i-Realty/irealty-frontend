'use client';

import { useEffect, useRef } from 'react';
import {
  MessageSquare,
  Calendar,
  ShieldCheck,
  Wallet,
  Home,
  Bell,
  CheckCheck,
} from 'lucide-react';
import { useNotificationStore } from '@/lib/store/useNotificationStore';
import type { NotificationType } from '@/lib/store/useNotificationStore';
import { useI18n } from '@/lib/i18n';

const ICON_MAP: Record<NotificationType, { icon: typeof Bell; bg: string; color: string }> = {
  message: { icon: MessageSquare, bg: 'bg-blue-50 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
  tour: { icon: Calendar, bg: 'bg-green-50 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400' },
  kyc: { icon: ShieldCheck, bg: 'bg-amber-50 dark:bg-amber-900/30', color: 'text-amber-600 dark:text-amber-400' },
  payment: { icon: Wallet, bg: 'bg-purple-50 dark:bg-purple-900/30', color: 'text-purple-600 dark:text-purple-400' },
  property: { icon: Home, bg: 'bg-indigo-50 dark:bg-indigo-900/30', color: 'text-indigo-600 dark:text-indigo-400' },
  system: { icon: Bell, bg: 'bg-gray-100 dark:bg-gray-700', color: 'text-gray-600 dark:text-gray-400' },
};

export default function NotificationDropdown() {
  const { notifications, isOpen, closeDropdown, markAsRead, markAllAsRead } =
    useNotificationStore();
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        closeDropdown();
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeDropdown]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-16 w-[360px] max-w-[calc(100vw-1rem)] max-h-[480px] bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">{t('notifications.title')}</h3>
          {unreadCount > 0 && (
            <span className="text-[11px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-[12px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            {t('notifications.markAllRead')}
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-gray-50 dark:divide-gray-700/50">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-500">
            No notifications yet
          </div>
        ) : (
          notifications.map((n) => {
            const meta = ICON_MAP[n.type];
            const Icon = meta.icon;
            return (
              <button
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`w-full px-5 py-3.5 flex items-start gap-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                  !n.read ? 'bg-blue-50/30 dark:bg-blue-500/10' : ''
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${meta.bg}`}
                >
                  <Icon className={`w-4 h-4 ${meta.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-[13px] leading-tight ${
                      !n.read ? 'font-bold text-gray-900 dark:text-gray-100' : 'font-medium text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {n.title}
                  </p>
                  <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                    {n.description}
                  </p>
                  <p className="text-[11px] text-gray-300 dark:text-gray-600 mt-1">{n.time}</p>
                </div>
                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
