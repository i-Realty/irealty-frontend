'use client';

import { useEffect } from 'react';
import { useAdminMessagesStore } from '@/lib/store/useAdminMessagesStore';
import AdminInboxList from '@/components/dashboard/admin/messages/AdminInboxList';
import AdminChatWindow from '@/components/dashboard/admin/messages/AdminChatWindow';
import AdminContextPanel from '@/components/dashboard/admin/messages/AdminContextPanel';
import AdminEmptyChatState from '@/components/dashboard/admin/messages/AdminEmptyChatState';

export default function AdminMessagesPage() {
  const {
    activeThreadId,
    isMobileDetailOpen,
    fetchThreadsMock,
    isLoading,
  } = useAdminMessagesStore();

  useEffect(() => {
    fetchThreadsMock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-[calc(100vh-100px)] w-full flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">

      {/* LEFT PANE: Support Ticket List */}
      <div
        className={`w-full md:w-[320px] lg:w-[380px] flex-shrink-0 border-r border-gray-100 flex-col
        ${activeThreadId ? 'hidden md:flex' : 'flex'}`}
      >
        <AdminInboxList isLoading={isLoading} />
      </div>

      {/* MIDDLE PANE: Active Ticket Chat or Empty State */}
      <div
        className={`flex-1 flex-col relative bg-white
        ${!activeThreadId || isMobileDetailOpen ? 'hidden md:flex' : 'flex'}`}
      >
        {activeThreadId ? <AdminChatWindow /> : <AdminEmptyChatState />}
      </div>

      {/* RIGHT PANE (Desktop) / OVERLAY PANE (Mobile): User Details */}
      {activeThreadId && (
        <div
          className={`w-full md:w-[300px] lg:w-[340px] flex-shrink-0 border-l border-gray-100 flex-col absolute inset-0 z-30 bg-white md:relative md:z-0
          ${isMobileDetailOpen ? 'flex' : 'hidden md:flex'}`}
        >
          <AdminContextPanel />
        </div>
      )}
    </div>
  );
}
