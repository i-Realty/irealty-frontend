'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { apiPatch } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

interface NotifToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const DEFAULT_PREFS: NotifToggle[] = [
  { id: 'new_listing',   label: 'New matching listings',      description: 'Get notified when a property matching your saved search criteria is listed.', enabled: true },
  { id: 'price_drop',    label: 'Price drops on saved properties', description: 'Alert when a property you saved has a price reduction.',                enabled: true },
  { id: 'tour_reminder', label: 'Upcoming tour reminders',    description: 'Receive reminders 24 hours before a scheduled property tour.',               enabled: true },
  { id: 'tx_update',     label: 'Transaction status updates', description: 'Be notified whenever your transaction status changes.',                       enabled: true },
  { id: 'escrow_alert',  label: 'Escrow & payment alerts',   description: 'Notifications for escrow funding, releases, and payment confirmations.',      enabled: true },
  { id: 'messages',      label: 'New messages',               description: 'Alerts for new messages from agents, landlords, or developers.',              enabled: true },
  { id: 'promo',         label: 'Promotions & newsletters',   description: 'Occasional offers and market updates from i-Realty.',                        enabled: false },
];

const STORAGE_KEY = 'irealty-seeker-notification-prefs';

function loadPrefs(): NotifToggle[] {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const saved: Record<string, boolean> = JSON.parse(raw);
    return DEFAULT_PREFS.map((p) => ({
      ...p,
      enabled: saved[p.id] !== undefined ? saved[p.id] : p.enabled,
    }));
  } catch {
    return DEFAULT_PREFS;
  }
}

function savePrefsToStorage(prefs: NotifToggle[]) {
  if (typeof window === 'undefined') return;
  const map: Record<string, boolean> = {};
  prefs.forEach((p) => { map[p.id] = p.enabled; });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export default function SeekerNotificationSettings() {
  const [prefs, setPrefs] = useState<NotifToggle[]>(DEFAULT_PREFS);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load persisted preferences on mount
  useEffect(() => {
    setPrefs(loadPrefs());
  }, []);

  const toggle = (id: string) => {
    setPrefs((prev) => prev.map((p) => p.id === id ? { ...p, enabled: !p.enabled } : p));
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);

    if (USE_API) {
      try {
        const payload: Record<string, boolean> = {};
        prefs.forEach((p) => { payload[p.id] = p.enabled; });
        await apiPatch('/api/seeker/settings/notifications', payload);
      } catch {
        // Fallback to local persistence on API failure
      }
    } else {
      await new Promise((r) => setTimeout(r, 900));
    }

    // Always persist locally as cache
    savePrefsToStorage(prefs);
    setIsSaving(false);
    setSaved(true);
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in slide-in-from-right-4 fade-in duration-300">
      <div className="flex flex-col">
        <h2 className="text-[18px] font-bold text-gray-900 tracking-tight mb-1">Notification Preferences</h2>
        <p className="text-[13px] font-medium text-gray-400">Choose what you want to be notified about</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl md:rounded-[24px] p-6 shadow-sm space-y-1">
        {prefs.map((pref, idx) => (
          <div
            key={pref.id}
            className={`flex items-start justify-between gap-4 py-4 ${idx < prefs.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-gray-900">{pref.label}</p>
              <p className="text-[12px] text-gray-400 mt-0.5 leading-relaxed">{pref.description}</p>
            </div>
            <button
              type="button"
              onClick={() => toggle(pref.id)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
                pref.enabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
              role="switch"
              aria-checked={pref.enabled}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  pref.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        {saved && (
          <p className="text-sm text-green-600 font-medium">Preferences saved.</p>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="ml-auto min-w-[140px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-[14px] py-2.5 px-6 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}
