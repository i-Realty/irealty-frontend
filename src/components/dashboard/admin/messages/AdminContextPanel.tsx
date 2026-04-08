'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Mail, Calendar, ArrowRightLeft, ShieldCheck, ExternalLink } from 'lucide-react';
import { useAdminMessagesStore } from '@/lib/store/useAdminMessagesStore';

const KYC_BADGE: Record<string, string> = {
  verified: 'bg-green-50 text-green-600 border-green-100',
  'in-progress': 'bg-amber-50 text-amber-600 border-amber-100',
  unverified: 'bg-gray-50 text-gray-500 border-gray-100',
};

const ROLE_COLOR: Record<string, string> = {
  Agent: 'bg-blue-50 text-blue-600',
  'Property Seeker': 'bg-green-50 text-green-600',
  Developer: 'bg-purple-50 text-purple-600',
  Diaspora: 'bg-indigo-50 text-indigo-600',
  Landlord: 'bg-amber-50 text-amber-600',
};

export default function AdminContextPanel() {
  const { activeThreadId, threads, isMobileDetailOpen, toggleMobileDetail } =
    useAdminMessagesStore();

  const thread = threads.find((t) => t.id === activeThreadId);
  if (!thread) return null;

  const { user } = thread;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1e1e1e] relative">
      {/* Mobile close header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] sticky top-0 z-10">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">User Details</h2>
        <button
          onClick={() => toggleMobileDetail(false)}
          className="p-2 -mr-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5">
        {/* User card */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-600 shadow-md relative mb-3">
            <Image
              src={user.avatar}
              alt={user.name}
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100">{user.name}</h3>
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full mt-1.5 ${
              ROLE_COLOR[user.role] ?? 'bg-gray-50 text-gray-600'
            }`}
          >
            {user.role}
          </span>
        </div>

        {/* Details list */}
        <div className="space-y-4">
          <div className="bg-gray-50/70 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500">Email</p>
                <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500">Joined</p>
                <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-200">{user.joinDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ArrowRightLeft className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500">Total Transactions</p>
                <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-200">
                  {user.totalTransactions}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500">KYC Status</p>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    KYC_BADGE[user.kycStatus]
                  }`}
                >
                  {user.kycStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Ticket info */}
          <div className="bg-gray-50/70 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
            <h4 className="text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Ticket Info
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-400 dark:text-gray-500 font-medium">ID</span>
                <span className="text-gray-800 dark:text-gray-200 font-bold">{thread.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-400 dark:text-gray-500 font-medium">Category</span>
                <span className="text-gray-800 dark:text-gray-200 font-semibold">{thread.category}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-400 dark:text-gray-500 font-medium">Priority</span>
                <span className="text-gray-800 dark:text-gray-200 font-semibold">{thread.priority}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-400 dark:text-gray-500 font-medium">Status</span>
                <span className="text-gray-800 dark:text-gray-200 font-semibold">{thread.status}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-400 dark:text-gray-500 font-medium">Created</span>
                <span className="text-gray-800 dark:text-gray-200 font-semibold">{thread.createdAt}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-400 dark:text-gray-500 font-medium">Messages</span>
                <span className="text-gray-800 dark:text-gray-200 font-semibold">{thread.messages.length}</span>
              </div>
            </div>
          </div>

          {/* Quick action */}
          <Link
            href={`/dashboard/admin/users/${user.id}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold text-[13px] rounded-xl transition-colors"
          >
            View Full Profile <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
