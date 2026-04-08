'use client';

import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';

function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

export default function PushNotificationManager() {
  const [showBanner, setShowBanner] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    registerServiceWorker();

    // Check if we should show the push notification prompt
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
    if (Notification.permission === 'granted') {
      setIsSubscribed(true);
      return;
    }
    if (Notification.permission === 'denied') return;

    // Show banner after a short delay for better UX
    const dismissed = localStorage.getItem('irealty-push-dismissed');
    if (dismissed) return;

    const timer = setTimeout(() => setShowBanner(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnable = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setIsSubscribed(true);
        setShowBanner(false);

        // Show a test notification
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification('Notifications Enabled', {
          body: 'You will now receive updates about your properties and transactions.',
          icon: '/logo.png',
        });
      } else {
        setShowBanner(false);
      }
    } catch {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('irealty-push-dismissed', 'true');
  };

  if (!showBanner || isSubscribed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[70] max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
            Stay Updated
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Get notified about new messages, tour bookings, KYC updates, and payment confirmations.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleEnable}
              className="flex-1 bg-blue-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enable Notifications
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
