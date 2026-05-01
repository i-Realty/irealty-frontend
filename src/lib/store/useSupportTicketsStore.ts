import { create } from 'zustand';
import { apiGet, apiPost } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TicketStatus = 'OPEN' | 'ASSIGNED' | 'PENDING_USER' | 'RESOLVED' | 'CLOSED_INACTIVE';
export type TicketPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type TicketCategory = 'GENERAL' | 'BILLING' | 'KYC' | 'LISTING' | 'TRANSACTION' | 'OTHER';

export interface SupportTicket {
  id: string;
  reference: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: string;
  lastMessage?: string;
}

export interface TicketMessage {
  id: string;
  content: string;
  senderId: string;
  isAdmin: boolean;
  createdAt: string;
  timestamp: string;
}

export interface TicketDetail extends SupportTicket {
  messages: TicketMessage[];
}

export interface CreateTicketPayload {
  subject: string;
  content: string;
  category?: TicketCategory;
  priority?: TicketPriority;
}

// ---------------------------------------------------------------------------
// Store interface
// ---------------------------------------------------------------------------

interface SupportTicketsStore {
  tickets: SupportTicket[];
  activeTicket: TicketDetail | null;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;

  fetchTickets: () => Promise<void>;
  fetchTicketById: (id: string) => Promise<void>;
  createTicket: (data: CreateTicketPayload) => Promise<SupportTicket | null>;
  sendMessage: (ticketId: string, content: string) => Promise<void>;
  closeTicket: (ticketId: string) => Promise<void>;
  setActiveTicket: (ticket: SupportTicket | null) => void;
}

// ---------------------------------------------------------------------------
// Adapters
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTicket(t: Record<string, any>): SupportTicket {
  const msgs: TicketMessage[] = (t.messages ?? []).map(mapMessage);
  const last = msgs[msgs.length - 1];
  return {
    id:          t.id ?? '',
    reference:   t.reference ?? t.id ?? '',
    subject:     t.subject ?? '',
    status:      t.status ?? 'OPEN',
    priority:    t.priority ?? 'NORMAL',
    category:    t.category ?? 'GENERAL',
    createdAt:   t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
    lastMessage: last?.content,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMessage(m: Record<string, any>): TicketMessage {
  return {
    id:        m.id ?? '',
    content:   m.content ?? m.text ?? '',
    senderId:  m.senderId ?? m.userId ?? '',
    isAdmin:   !!(m.isAdmin || m.fromAdmin),
    createdAt: m.createdAt ?? '',
    timestamp: m.createdAt ? new Date(m.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '',
  };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useSupportTicketsStore = create<SupportTicketsStore>((set) => ({
  tickets: [],
  activeTicket: null,
  isLoading: false,
  isSending: false,
  error: null,

  fetchTickets: async () => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        const raw = await apiGet<unknown>('/api/support/tickets');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const list: any[] = Array.isArray(raw) ? raw : (raw as any)?.items ?? (raw as any)?.tickets ?? [];
        set({ tickets: list.map(mapTicket), isLoading: false });
      } else {
        await new Promise(r => setTimeout(r, 400));
        set({ isLoading: false });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load tickets', isLoading: false });
    }
  },

  fetchTicketById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = await apiGet<Record<string, any>>(`/api/support/tickets/${id}`);
        const base = mapTicket(raw);
        const messages = (raw.messages ?? []).map(mapMessage);
        set({ activeTicket: { ...base, messages }, isLoading: false });
      } else {
        await new Promise(r => setTimeout(r, 300));
        set({ isLoading: false });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load ticket', isLoading: false });
    }
  },

  createTicket: async (data) => {
    set({ isSending: true, error: null });
    try {
      if (USE_API) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = await apiPost<Record<string, any>>('/api/support/tickets', data);
        const ticket = mapTicket(raw);
        set(s => ({ tickets: [ticket, ...s.tickets], isSending: false }));
        return ticket;
      }
      await new Promise(r => setTimeout(r, 800));
      const mockTicket: SupportTicket = {
        id: `mock-${Date.now()}`,
        reference: `TKT-${Date.now()}`,
        subject: data.subject,
        status: 'OPEN',
        priority: data.priority ?? 'NORMAL',
        category: data.category ?? 'GENERAL',
        createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        lastMessage: data.content,
      };
      set(s => ({ tickets: [mockTicket, ...s.tickets], isSending: false }));
      return mockTicket;
    } catch (err) {
      set({ isSending: false, error: err instanceof Error ? err.message : 'Failed to create ticket' });
      return null;
    }
  },

  sendMessage: async (ticketId, content) => {
    set({ isSending: true });
    try {
      if (USE_API) await apiPost(`/api/support/tickets/${ticketId}/messages`, { content });
      else await new Promise(r => setTimeout(r, 400));
      const newMsg: TicketMessage = {
        id: `msg-${Date.now()}`,
        content,
        senderId: 'me',
        isAdmin: false,
        createdAt: new Date().toISOString(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      set(s => ({
        activeTicket: s.activeTicket
          ? { ...s.activeTicket, messages: [...s.activeTicket.messages, newMsg], lastMessage: content }
          : null,
        isSending: false,
      }));
    } catch (err) {
      set({ isSending: false, error: err instanceof Error ? err.message : 'Failed to send message' });
    }
  },

  closeTicket: async (ticketId) => {
    try {
      if (USE_API) await apiPost(`/api/support/tickets/${ticketId}/close`);
      set(s => ({
        tickets: s.tickets.map(t => t.id === ticketId ? { ...t, status: 'RESOLVED' as TicketStatus } : t),
        activeTicket: s.activeTicket?.id === ticketId
          ? { ...s.activeTicket, status: 'RESOLVED' as TicketStatus }
          : s.activeTicket,
      }));
    } catch { /* non-critical */ }
  },

  setActiveTicket: (ticket) => {
    set({ activeTicket: ticket ? { ...ticket, messages: [] } : null });
    if (ticket) {
      useSupportTicketsStore.getState().fetchTicketById(ticket.id);
    }
  },
}));
