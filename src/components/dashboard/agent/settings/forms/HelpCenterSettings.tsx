'use client';

import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { useSupportTicketsStore, type SupportTicket } from '@/lib/store/useSupportTicketsStore';
import { Loader2, ArrowLeft, Send, X, MessageSquare, ChevronRight } from 'lucide-react';

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: SupportTicket['status'] }) {
  const map: Record<string, string> = {
    OPEN:            'bg-blue-50 text-blue-600 border-blue-100',
    ASSIGNED:        'bg-purple-50 text-purple-600 border-purple-100',
    PENDING_USER:    'bg-amber-50 text-amber-600 border-amber-100',
    RESOLVED:        'bg-green-50 text-green-600 border-green-100',
    CLOSED_INACTIVE: 'bg-gray-100 text-gray-500 border-gray-200',
  };
  const label = status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  return <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full ${map[status] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>{label}</span>;
}

// ── Ticket thread view ────────────────────────────────────────────────────────
function TicketThread({ onBack }: { onBack: () => void }) {
  const { activeTicket, isSending, sendMessage, closeTicket } = useSupportTicketsStore();
  const [reply, setReply] = useState('');

  if (!activeTicket) return null;

  const handleSend = async () => {
    if (!reply.trim()) return;
    await sendMessage(activeTicket.id, reply.trim());
    setReply('');
  };

  const canClose = activeTicket.status === 'OPEN' || activeTicket.status === 'ASSIGNED' || activeTicket.status === 'PENDING_USER';

  return (
    <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 fade-in duration-200">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-500" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{activeTicket.subject}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <StatusBadge status={activeTicket.status} />
            <span className="text-[11px] text-gray-400">{activeTicket.reference}</span>
          </div>
        </div>
        {canClose && (
          <button onClick={() => closeTicket(activeTicket.id)}
            className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1">
            <X className="w-3 h-3" />Close
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="flex flex-col gap-0 max-h-64 overflow-y-auto p-4">
          {activeTicket.messages.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No messages yet</p>
          ) : activeTicket.messages.map(m => (
            <div key={m.id} className={`mb-3 flex ${m.isAdmin ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                m.isAdmin
                  ? 'bg-gray-100 text-gray-800 rounded-tl-sm'
                  : 'bg-blue-600 text-white rounded-tr-sm'
              }`}>
                {m.isAdmin && <p className="text-[10px] font-bold text-gray-500 mb-1">Support</p>}
                <p className="leading-relaxed">{m.content}</p>
                <p className={`text-[10px] mt-1 text-right ${m.isAdmin ? 'text-gray-400' : 'text-blue-200'}`}>{m.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reply input */}
        {canClose && (
          <div className="border-t border-gray-100 p-3 flex gap-2">
            <input
              value={reply} onChange={e => setReply(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Type a reply…"
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
            <button onClick={handleSend} disabled={isSending || !reply.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 transition-colors">
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HelpCenterSettings() {
  const { helpTicket, updateHelpTicket, submitHelpTicketMock, isSaving } = useSettingsStore();
  const { tickets, isLoading, fetchTickets, setActiveTicket, activeTicket } = useSupportTicketsStore();
  const [showThread, setShowThread] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitHelpTicketMock();
    setSubmitDone(true);
    setTimeout(() => setSubmitDone(false), 3000);
    fetchTickets();
  };

  const handleOpenTicket = (ticket: SupportTicket) => {
    setActiveTicket(ticket);
    setShowThread(true);
  };

  if (showThread && activeTicket) {
    return (
      <div className="flex flex-col gap-6 w-full animate-in slide-in-from-right-4 fade-in duration-300">
        <div className="flex flex-col">
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight mb-1">Help Center</h2>
          <p className="text-[13px] font-medium text-gray-400">Ticket conversation</p>
        </div>
        <TicketThread onBack={() => { setShowThread(false); setActiveTicket(null); }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in slide-in-from-right-4 fade-in duration-300">

      <div className="flex flex-col">
        <h2 className="text-[18px] font-bold text-gray-900 tracking-tight mb-1">Help Center</h2>
        <p className="text-[13px] font-medium text-gray-400">Send us a message if you encounter any problem</p>
      </div>

      {/* New ticket form */}
      <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-2xl md:rounded-[24px] p-6 flex flex-col shadow-sm">
        {submitDone && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-xl text-sm font-medium">
            Ticket submitted! We&apos;ll get back to you shortly.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 space-y-2 md:space-y-0">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-gray-900 ml-1">Username</label>
            <input type="text" value={helpTicket.username} readOnly
              className="w-full border border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-500 focus:outline-none cursor-not-allowed" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-gray-900 ml-1">Email address</label>
            <input type="email" placeholder="your@email.com" value={helpTicket.email}
              onChange={(e) => updateHelpTicket({ email: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300" required />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[12px] font-bold text-gray-900 ml-1">Subject</label>
            <input type="text" placeholder="Enter subject here" value={helpTicket.subject}
              onChange={(e) => updateHelpTicket({ subject: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300" required />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[12px] font-bold text-gray-900 ml-1">Description</label>
            <textarea placeholder="Write a little description here." value={helpTicket.description}
              onChange={(e) => updateHelpTicket({ description: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-4 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300 min-h-[160px] resize-y" required />
          </div>
        </div>
        <div className="w-full flex justify-end mt-4">
          <button type="submit" disabled={isSaving || !helpTicket.email || !helpTicket.subject || !helpTicket.description}
            className="w-full md:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-[14px] py-4 md:py-3.5 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Request'}
          </button>
        </div>
      </form>

      {/* Ticket history */}
      <div>
        <h3 className="text-[15px] font-bold text-gray-900 mb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400" />My Tickets
        </h3>
        {isLoading ? (
          <div className="py-6 text-center"><Loader2 className="w-5 h-5 text-blue-500 animate-spin mx-auto" /></div>
        ) : tickets.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-gray-400">
            <p className="text-sm">No support tickets yet. Use the form above to get help.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-50">
            {tickets.map(t => (
              <button key={t.id} onClick={() => handleOpenTicket(t)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-gray-900 truncate">{t.subject}</p>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {t.lastMessage ?? 'No messages'} · {t.createdAt}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 ml-2" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
