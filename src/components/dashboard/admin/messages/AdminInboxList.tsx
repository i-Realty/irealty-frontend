'use client';

import { Search, Filter } from 'lucide-react';
import Image from 'next/image';
import { useAdminMessagesStore } from '@/lib/store/useAdminMessagesStore';
import type { TicketCategory, TicketStatus } from '@/lib/store/useAdminMessagesStore';

const CATEGORY_OPTIONS: (TicketCategory | 'All')[] = ['All', 'General', 'KYC', 'Payment', 'Property', 'Account'];
const STATUS_OPTIONS: (TicketStatus | 'All')[] = ['All', 'Open', 'In Progress', 'Resolved', 'Escalated'];

const STATUS_COLORS: Record<TicketStatus, string> = {
  'Open': 'bg-blue-50 text-blue-600',
  'In Progress': 'bg-amber-50 text-amber-600',
  'Resolved': 'bg-green-50 text-green-600',
  'Escalated': 'bg-red-50 text-red-500',
};

const PRIORITY_DOT: Record<string, string> = {
  Low: 'bg-gray-300',
  Medium: 'bg-amber-400',
  High: 'bg-orange-500',
  Urgent: 'bg-red-500',
};

const ROLE_BADGE: Record<string, string> = {
  Agent: 'bg-blue-50 text-blue-600',
  'Property Seeker': 'bg-green-50 text-green-600',
  Developer: 'bg-purple-50 text-purple-600',
  Diaspora: 'bg-indigo-50 text-indigo-600',
  Landlord: 'bg-amber-50 text-amber-600',
};

export default function AdminInboxList({ isLoading }: { isLoading?: boolean }) {
  const {
    threads,
    activeThreadId,
    setActiveThreadId,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
  } = useAdminMessagesStore();

  const filtered = threads.filter((t) => {
    const matchesSearch =
      t.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const openCount = threads.filter((t) => t.status === 'Open').length;
  const escalatedCount = threads.filter((t) => t.status === 'Escalated').length;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex-none space-y-3">
        {/* Stats bar */}
        <div className="flex items-center gap-3 text-xs font-medium">
          <span className="text-gray-500">
            <span className="text-gray-900 font-bold">{threads.length}</span> tickets
          </span>
          <span className="w-px h-3 bg-gray-200" />
          <span className="text-blue-600">
            {openCount} open
          </span>
          {escalatedCount > 0 && (
            <>
              <span className="w-px h-3 bg-gray-200" />
              <span className="text-red-500">
                {escalatedCount} escalated
              </span>
            </>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-gray-800"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as TicketCategory | 'All')}
              className="w-full pl-8 pr-2 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'All')}
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-gray-50">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-500 animate-pulse">
            Loading tickets...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No tickets found
          </div>
        ) : (
          filtered.map((thread) => (
            <button
              key={thread.id}
              onClick={() => setActiveThreadId(thread.id)}
              className={`w-full p-4 flex items-start gap-3 transition-colors hover:bg-gray-50 text-left cursor-pointer
                ${activeThreadId === thread.id ? 'bg-blue-50/70 hover:bg-blue-50/70' : ''}`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border border-gray-50 relative">
                  <Image
                    src={thread.user.avatar}
                    alt={thread.user.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                {/* Priority dot */}
                <div className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${PRIORITY_DOT[thread.priority]}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h3 className={`text-[13px] font-bold truncate ${
                    activeThreadId === thread.id ? 'text-blue-700' : 'text-gray-900'
                  }`}>
                    {thread.user.name}
                  </h3>
                  <span className={`text-[11px] flex-shrink-0 ${
                    thread.unreadCount > 0 ? 'text-blue-600 font-semibold' : 'text-gray-400'
                  }`}>
                    {thread.lastMessageTime}
                  </span>
                </div>

                {/* Subject */}
                <p className="text-[12px] font-semibold text-gray-700 truncate mb-1">
                  {thread.subject}
                </p>

                {/* Last message preview */}
                <p className={`text-[12px] truncate mb-2 ${
                  thread.unreadCount > 0 ? 'text-gray-700 font-medium' : 'text-gray-400'
                }`}>
                  {thread.lastMessage}
                </p>

                {/* Tags row */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ROLE_BADGE[thread.user.role] ?? 'bg-gray-50 text-gray-600'}`}>
                    {thread.user.role}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[thread.status]}`}>
                    {thread.status}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-500">
                    {thread.category}
                  </span>
                </div>
              </div>

              {/* Unread badge */}
              {thread.unreadCount > 0 && (
                <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full mt-1 shadow-sm">
                  {thread.unreadCount}
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
