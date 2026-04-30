'use client';

import { useState } from 'react';
import { X, Send, Users } from 'lucide-react';
import type { UserRole } from '@/lib/store/useAuthStore';
import { useEscapeKey } from '@/lib/hooks/useEscapeKey';
import { useNotificationStore } from '@/lib/store/useNotificationStore';
import { useAdminDashboardStore } from '@/lib/store/useAdminDashboardStore';

const ROLE_OPTIONS: { value: 'all' | UserRole; label: string }[] = [
  { value: 'all', label: 'All Users' },
  { value: 'Agent', label: 'Agents' },
  { value: 'Property Seeker', label: 'Property Seekers' },
  { value: 'Developer', label: 'Developers' },
  { value: 'Diaspora', label: 'Diaspora Investors' },
  { value: 'Landlord', label: 'Landlords' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BroadcastModal({ isOpen, onClose }: Props) {
  useEscapeKey(onClose);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [targetRoles, setTargetRoles] = useState<Set<string>>(new Set(['all']));
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const toggleRole = (role: string) => {
    setTargetRoles((prev) => {
      const next = new Set(prev);
      if (role === 'all') {
        return new Set(['all']);
      }
      next.delete('all');
      if (next.has(role)) next.delete(role);
      else next.add(role);
      if (next.size === 0) return new Set(['all']);
      return next;
    });
  };

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) return;
    setIsSending(true);

    // Send broadcast via backend API (POST /api/admin/messages/broadcast)
    await useAdminDashboardStore.getState().broadcastMessage(
      `${subject.trim()}: ${message.trim()}`
    );

    // Also emit locally so admins see it in their session
    useNotificationStore.getState().broadcast(
      subject.trim(),
      message.trim()
    );

    setIsSending(false);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSubject('');
      setMessage('');
      setTargetRoles(new Set(['all']));
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg mx-4 p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <Send className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100">
              Broadcast Message
            </h3>
            <p className="text-[12px] text-gray-400 dark:text-gray-500">
              Send an announcement to user groups
            </p>
          </div>
        </div>

        {sent ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Send className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Broadcast sent!</p>
            <p className="text-xs text-gray-400 mt-1">
              Message delivered to{' '}
              {targetRoles.has('all')
                ? 'all users'
                : Array.from(targetRoles).join(', ')}
            </p>
          </div>
        ) : (
          <>
            {/* Target audience */}
            <div className="mb-4">
              <label className="text-[12px] font-bold text-gray-900 dark:text-gray-100 block mb-2">
                <Users className="w-3.5 h-3.5 inline mr-1" />
                Recipients
              </label>
              <div className="flex flex-wrap gap-2">
                {ROLE_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => toggleRole(value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                      targetRoles.has(value)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div className="mb-4">
              <label className="text-[12px] font-bold text-gray-900 dark:text-gray-100 block mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Platform maintenance scheduled"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-[14px] text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:border-blue-400 placeholder:text-gray-300 dark:placeholder:text-gray-500"
              />
            </div>

            {/* Message */}
            <div className="mb-5">
              <label className="text-[12px] font-bold text-gray-900 dark:text-gray-100 block mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your announcement..."
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-[14px] text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:border-blue-400 min-h-[120px] resize-y placeholder:text-gray-300 dark:placeholder:text-gray-500"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={isSending || !subject.trim() || !message.trim()}
                className="flex-1 bg-blue-600 text-white font-medium text-sm py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Broadcast
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
