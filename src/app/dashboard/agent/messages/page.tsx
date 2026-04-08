'use client';

import { useEffect } from 'react';
import { useMessagesStore } from '@/lib/store/useMessagesStore';
import InboxList from '@/components/dashboard/agent/messages/InboxList';
import ChatWindow from '@/components/dashboard/agent/messages/ChatWindow';
import ContextPanel from '@/components/dashboard/agent/messages/ContextPanel';
import EmptyChatState from '@/components/dashboard/agent/messages/EmptyChatState';
import UploadMediaModal from '@/components/dashboard/agent/messages/modals/UploadMediaModal';
import UploadDocumentModal from '@/components/dashboard/agent/messages/modals/UploadDocumentModal';

export default function MessagesPage() {
  const {
    activeChatId,
    isMobileContextOpen,
    fetchThreadsMock,
    isLoadingChats,
    uploadModalState
  } = useMessagesStore();

  // Load mock data on mount
  useEffect(() => {
    fetchThreadsMock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-[calc(100vh-100px)] w-full flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
      
      {/* LEFT PANE: Inbox List */}
      <div 
        className={`w-full md:w-[320px] lg:w-[380px] flex-shrink-0 border-r border-gray-100 flex-col 
        ${activeChatId ? 'hidden md:flex' : 'flex'}`}
      >
        <InboxList isLoading={isLoadingChats} />
      </div>

      {/* MIDDLE PANE: Active Chat or Empty State */}
      <div 
        className={`flex-1 flex-col relative bg-white
        ${!activeChatId || isMobileContextOpen ? 'hidden md:flex' : 'flex'}`}
      >
        {activeChatId ? <ChatWindow /> : <EmptyChatState />}
      </div>

      {/* RIGHT PANE (Desktop) / OVERLAY PANE (Mobile): Property Context Details */}
      {/* On desktop, it is hidden if NO chat is active. On mobile, it requires isMobileContextOpen to be true */}
      {activeChatId && (
        <div 
          className={`w-full md:w-[300px] lg:w-[340px] flex-shrink-0 border-l border-gray-100 flex-col absolute inset-0 z-30 bg-white md:relative md:z-0
          ${isMobileContextOpen ? 'flex' : 'hidden md:flex'}`}
        >
          <ContextPanel />
        </div>
      )}

      {/* MODAL MOUNTS */}
      {uploadModalState === 'media' && <UploadMediaModal />}
      {(uploadModalState === 'document_list' || uploadModalState === 'document_preview') && <UploadDocumentModal />}
    </div>
  );
}
