'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Send,
  Info,
  Loader2,
} from 'lucide-react';
import { useAdminMessagesStore } from '@/lib/store/useAdminMessagesStore';
import type { AdminMessage } from '@/lib/store/useAdminMessagesStore';

function MessageBubble({ message }: { message: AdminMessage }) {
  const isAdmin = message.senderId === 'ADMIN';

  const bubbleStyle = isAdmin
    ? 'bg-blue-600 text-white rounded-l-2xl rounded-tr-2xl'
    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-gray-700 dark:text-gray-200 rounded-r-2xl rounded-tl-2xl';

  return (
    <div className={`flex w-full ${isAdmin ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[75%] md:max-w-[65%] px-5 py-3.5 ${bubbleStyle}`}>
        {isAdmin && (
          <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block mb-1">
            Admin
          </span>
        )}
        <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <span
          className={`block text-[10px] mt-2 text-right font-medium ${
            isAdmin ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}

const STATUS_ACTIONS = {
  Open: [
    { label: 'Resolve', icon: CheckCircle2, action: 'resolve' as const, style: 'bg-green-600 hover:bg-green-700 text-white' },
    { label: 'Escalate', icon: AlertTriangle, action: 'escalate' as const, style: 'bg-amber-500 hover:bg-amber-600 text-white' },
  ],
  'In Progress': [
    { label: 'Resolve', icon: CheckCircle2, action: 'resolve' as const, style: 'bg-green-600 hover:bg-green-700 text-white' },
    { label: 'Escalate', icon: AlertTriangle, action: 'escalate' as const, style: 'bg-amber-500 hover:bg-amber-600 text-white' },
  ],
  Escalated: [
    { label: 'Resolve', icon: CheckCircle2, action: 'resolve' as const, style: 'bg-green-600 hover:bg-green-700 text-white' },
    { label: 'Reopen', icon: RotateCcw, action: 'reopen' as const, style: 'bg-gray-600 hover:bg-gray-700 text-white' },
  ],
  Resolved: [
    { label: 'Reopen', icon: RotateCcw, action: 'reopen' as const, style: 'bg-gray-600 hover:bg-gray-700 text-white' },
  ],
};

export default function AdminChatWindow() {
  const {
    activeThreadId,
    threads,
    setActiveThreadId,
    toggleMobileDetail,
    isMobileDetailOpen,
    sendReplyMock,
    resolveThreadMock,
    escalateThreadMock,
    reopenThreadMock,
    isSending,
    isActionLoading,
  } = useAdminMessagesStore();

  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const thread = threads.find((t) => t.id === activeThreadId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages]);

  if (!thread) return null;

  const handleSend = () => {
    if (!text.trim() || !activeThreadId || isSending) return;
    sendReplyMock(activeThreadId, text);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAction = (action: 'resolve' | 'escalate' | 'reopen') => {
    if (!activeThreadId || isActionLoading) return;
    if (action === 'resolve') resolveThreadMock(activeThreadId);
    else if (action === 'escalate') escalateThreadMock(activeThreadId);
    else reopenThreadMock(activeThreadId);
  };

  const actions = STATUS_ACTIONS[thread.status] ?? [];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1e1e1e] relative">
      {/* Header */}
      <div className="flex-none px-4 py-3 bg-white dark:bg-[#1e1e1e] border-b border-gray-100 dark:border-gray-700 flex items-center justify-between shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveThreadId(null)}
            className="md:hidden p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex-shrink-0">
              <Image
                src={thread.user.avatar}
                alt={thread.user.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-[14px] font-bold text-gray-900 dark:text-gray-100 leading-tight truncate">
                {thread.user.name}
              </h2>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium truncate max-w-[200px] md:max-w-[300px]">
                {thread.subject}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status actions */}
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.action}
                onClick={() => handleAction(act.action)}
                disabled={isActionLoading}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors disabled:opacity-50 ${act.style}`}
              >
                {isActionLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                {act.label}
              </button>
            );
          })}

          {/* Mobile detail toggle */}
          <button
            onClick={() => toggleMobileDetail(!isMobileDetailOpen)}
            className={`p-2 rounded-full transition-colors ${
              isMobileDetailOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile action bar */}
      <div className="md:hidden flex items-center gap-2 px-4 py-2 border-b border-gray-50 bg-gray-50/50">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.action}
              onClick={() => handleAction(act.action)}
              disabled={isActionLoading}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-bold transition-colors disabled:opacity-50 ${act.style}`}
            >
              {isActionLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Icon className="w-3.5 h-3.5" />
              )}
              {act.label}
            </button>
          );
        })}
      </div>

      {/* Ticket meta strip */}
      <div className="flex items-center gap-3 px-4 py-2 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 text-[11px] font-medium text-gray-500 dark:text-gray-400">
        <span>Ticket: <span className="text-gray-700 dark:text-gray-200 font-bold">{thread.id.toUpperCase()}</span></span>
        <span className="w-px h-3 bg-gray-200 dark:bg-gray-600" />
        <span>Category: <span className="text-gray-700 dark:text-gray-200 font-bold">{thread.category}</span></span>
        <span className="w-px h-3 bg-gray-200 dark:bg-gray-600" />
        <span>Priority: <span className="text-gray-700 dark:text-gray-200 font-bold">{thread.priority}</span></span>
        <span className="w-px h-3 bg-gray-200 dark:bg-gray-600" />
        <span>Created: <span className="text-gray-700 dark:text-gray-200">{thread.createdAt}</span></span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-6 bg-white dark:bg-[#1e1e1e] pb-28">
        <div className="w-full flex justify-center mb-6">
          <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
            {thread.subject}
          </span>
        </div>

        <div className="flex flex-col w-full">
          {thread.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Reply input */}
      {thread.status !== 'Resolved' && (
        <div className="absolute bottom-0 w-full left-0 bg-white dark:bg-[#1e1e1e] border-t border-gray-100 dark:border-gray-700 px-4 py-3">
          <div className="flex items-end gap-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your reply..."
              rows={1}
              className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-[14px] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-colors resize-none min-h-[44px] max-h-[120px]"
              disabled={isSending}
            />
            <button
              onClick={handleSend}
              disabled={!text.trim() || isSending}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40 flex-shrink-0"
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Resolved state banner */}
      {thread.status === 'Resolved' && (
        <div className="absolute bottom-0 w-full left-0 bg-green-50 border-t border-green-100 px-4 py-4 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-[14px] font-semibold text-green-700">
            This ticket has been resolved
          </span>
        </div>
      )}
    </div>
  );
}
