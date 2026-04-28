import { create } from 'zustand';
import { apiGet, apiPost } from '@/lib/api/client';
import type { UserRole } from './useAuthStore';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// ── Types ────────────────────────────────────────────────────────────────

export type TicketCategory = 'General' | 'KYC' | 'Payment' | 'Property' | 'Account';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Escalated';

export interface AdminMessageUser {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  email: string;
  kycStatus: 'unverified' | 'in-progress' | 'verified';
  joinDate: string;
  totalTransactions: number;
}

export interface AdminMessage {
  id: string;
  threadId: string;
  senderId: string; // 'ADMIN' for admin replies
  content: string;
  createdAt: string;
  timestamp: string;
}

export interface SupportThread {
  id: string;
  user: AdminMessageUser;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  createdAt: string;
  messages: AdminMessage[];
}

// ── Store Interface ──────────────────────────────────────────────────────

interface AdminMessagesState {
  threads: SupportThread[];
  activeThreadId: string | null;
  searchQuery: string;
  categoryFilter: TicketCategory | 'All';
  statusFilter: TicketStatus | 'All';

  isLoading: boolean;
  isSending: boolean;
  isActionLoading: boolean;
  error: string | null;

  // Mobile UI
  isMobileDetailOpen: boolean;

  // API-ready actions
  fetchThreads: () => Promise<void>;
  sendReply: (threadId: string, content: string) => Promise<void>;
  resolveThread: (threadId: string) => Promise<void>;
  escalateThread: (threadId: string) => Promise<void>;
  reopenThread: (threadId: string) => Promise<void>;

  /** @deprecated Use fetchThreads() */
  fetchThreadsMock: () => Promise<void>;
  /** @deprecated Use sendReply() */
  sendReplyMock: (threadId: string, content: string) => Promise<void>;
  /** @deprecated Use resolveThread() */
  resolveThreadMock: (threadId: string) => Promise<void>;
  /** @deprecated Use escalateThread() */
  escalateThreadMock: (threadId: string) => Promise<void>;
  /** @deprecated Use reopenThread() */
  reopenThreadMock: (threadId: string) => Promise<void>;

  setActiveThreadId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: TicketCategory | 'All') => void;
  setStatusFilter: (status: TicketStatus | 'All') => void;
  toggleMobileDetail: (open: boolean) => void;
}

// ── Mock Data ────────────────────────────────────────────────────────────

const MOCK_THREADS: SupportThread[] = [
  {
    id: 'tkt-001',
    user: {
      id: 'USR-002',
      name: 'Marcus Bell',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
      role: 'Property Seeker',
      email: 'marcus@mail.com',
      kycStatus: 'in-progress',
      joinDate: '22 Feb 2025',
      totalTransactions: 8,
    },
    subject: 'KYC verification stuck at step 3',
    category: 'KYC',
    priority: 'High',
    status: 'Open',
    lastMessage: 'I uploaded my NIN but it still shows pending after 3 days',
    lastMessageTime: '25m',
    unreadCount: 2,
    createdAt: '06 Apr 2026',
    messages: [
      {
        id: 'msg-001a',
        threadId: 'tkt-001',
        senderId: 'USR-002',
        content: 'Hello, I need help with my KYC verification. I completed step 1 and 2 successfully but step 3 (ID Verification) has been stuck on "pending" for 3 days now.',
        createdAt: '2026-04-04T10:00:00Z',
        timestamp: '10:00 AM',
      },
      {
        id: 'msg-001b',
        threadId: 'tkt-001',
        senderId: 'ADMIN',
        content: 'Hi Marcus, thank you for reaching out. Let me check the status of your ID verification. Could you confirm which ID type you submitted?',
        createdAt: '2026-04-04T10:45:00Z',
        timestamp: '10:45 AM',
      },
      {
        id: 'msg-001c',
        threadId: 'tkt-001',
        senderId: 'USR-002',
        content: 'I uploaded my NIN but it still shows pending after 3 days. The document is clear and valid. Please help me resolve this as I need to start listing properties.',
        createdAt: '2026-04-06T09:30:00Z',
        timestamp: '9:30 AM',
      },
    ],
  },
  {
    id: 'tkt-002',
    user: {
      id: 'USR-001',
      name: 'Sarah Homes',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
      role: 'Agent',
      email: 'sarah@homes.ng',
      kycStatus: 'verified',
      joinDate: '15 Jan 2025',
      totalTransactions: 45,
    },
    subject: 'Withdrawal not reflecting in bank account',
    category: 'Payment',
    priority: 'Urgent',
    status: 'In Progress',
    lastMessage: 'It has been 48 hours and the money has not arrived',
    lastMessageTime: '1h',
    unreadCount: 1,
    createdAt: '05 Apr 2026',
    messages: [
      {
        id: 'msg-002a',
        threadId: 'tkt-002',
        senderId: 'USR-001',
        content: 'Hi Admin, I initiated a withdrawal of \u20A612,500,000 to my GTBank account two days ago. The status shows "Completed" on the platform but I have not received the funds.',
        createdAt: '2026-04-05T14:00:00Z',
        timestamp: '2:00 PM',
      },
      {
        id: 'msg-002b',
        threadId: 'tkt-002',
        senderId: 'ADMIN',
        content: 'Hi Sarah, I can see the transaction (PAY-001) in our records. Let me escalate this to our payment processing team. Can you confirm your GTBank account number ending in ...6789?',
        createdAt: '2026-04-05T15:30:00Z',
        timestamp: '3:30 PM',
      },
      {
        id: 'msg-002c',
        threadId: 'tkt-002',
        senderId: 'USR-001',
        content: 'Yes, that is correct. Account ending in 6789. It has been 48 hours and the money has not arrived. Please help, this is urgent.',
        createdAt: '2026-04-06T08:00:00Z',
        timestamp: '8:00 AM',
      },
    ],
  },
  {
    id: 'tkt-003',
    user: {
      id: 'USR-003',
      name: 'Amara Osei',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=150&auto=format&fit=crop',
      role: 'Developer',
      email: 'amara@dev.co',
      kycStatus: 'verified',
      joinDate: '10 Mar 2025',
      totalTransactions: 22,
    },
    subject: 'Property listing rejected without explanation',
    category: 'Property',
    priority: 'Medium',
    status: 'Open',
    lastMessage: 'Can you tell me what was wrong with my listing?',
    lastMessageTime: '3h',
    unreadCount: 1,
    createdAt: '06 Apr 2026',
    messages: [
      {
        id: 'msg-003a',
        threadId: 'tkt-003',
        senderId: 'USR-003',
        content: 'Hello, my property listing "Opal Residences Tower" (PRP-002) was rejected but I did not receive any reason for the rejection. Can you tell me what was wrong with my listing? I would like to fix it and resubmit.',
        createdAt: '2026-04-06T06:00:00Z',
        timestamp: '6:00 AM',
      },
    ],
  },
  {
    id: 'tkt-004',
    user: {
      id: 'USR-004',
      name: 'Ngozi Adeyemi',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=150&auto=format&fit=crop',
      role: 'Diaspora',
      email: 'ngozi@invest.uk',
      kycStatus: 'in-progress',
      joinDate: '05 Apr 2025',
      totalTransactions: 3,
    },
    subject: 'How to use the diaspora service catalog',
    category: 'General',
    priority: 'Low',
    status: 'Resolved',
    lastMessage: 'Thank you for the help!',
    lastMessageTime: '1d',
    unreadCount: 0,
    createdAt: '04 Apr 2026',
    messages: [
      {
        id: 'msg-004a',
        threadId: 'tkt-004',
        senderId: 'USR-004',
        content: 'Hi, I am based in London and just signed up as a diaspora investor. I can see the service catalog but I am not sure how to proceed with hiring a property inspector. Could you walk me through the process?',
        createdAt: '2026-04-04T12:00:00Z',
        timestamp: '12:00 PM',
      },
      {
        id: 'msg-004b',
        threadId: 'tkt-004',
        senderId: 'ADMIN',
        content: 'Welcome to i-Realty, Ngozi! To use our inspection service:\n\n1. Go to Service Catalog and select "Property Inspection"\n2. Choose the property you want inspected\n3. Select your preferred date and time\n4. Make payment through the wallet\n5. Our verified agent will conduct the inspection and share a video report\n\nLet me know if you need help with any of these steps!',
        createdAt: '2026-04-04T13:00:00Z',
        timestamp: '1:00 PM',
      },
      {
        id: 'msg-004c',
        threadId: 'tkt-004',
        senderId: 'USR-004',
        content: 'Thank you for the help! That was very clear. I will proceed with the steps.',
        createdAt: '2026-04-05T09:00:00Z',
        timestamp: '9:00 AM',
      },
    ],
  },
  {
    id: 'tkt-005',
    user: {
      id: 'USR-005',
      name: 'Emeka Nwosu',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      role: 'Landlord',
      email: 'emeka@land.ng',
      kycStatus: 'unverified',
      joinDate: '18 Apr 2025',
      totalTransactions: 0,
    },
    subject: 'Cannot access wallet without KYC',
    category: 'Account',
    priority: 'Medium',
    status: 'Open',
    lastMessage: 'When I click on wallet it says I need to verify first',
    lastMessageTime: '5h',
    unreadCount: 1,
    createdAt: '06 Apr 2026',
    messages: [
      {
        id: 'msg-005a',
        threadId: 'tkt-005',
        senderId: 'USR-005',
        content: 'Hello, I signed up as a landlord but when I click on the wallet section it says I need to complete KYC first. I am trying to list my 2 properties. When I click on wallet it says I need to verify first. Is there a way to fast-track this?',
        createdAt: '2026-04-06T04:00:00Z',
        timestamp: '4:00 AM',
      },
    ],
  },
  {
    id: 'tkt-006',
    user: {
      id: 'USR-010',
      name: 'Grace Adekunle',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop',
      role: 'Agent',
      email: 'grace@homes.ng',
      kycStatus: 'in-progress',
      joinDate: '15 May 2025',
      totalTransactions: 0,
    },
    subject: 'BVN verification error message',
    category: 'KYC',
    priority: 'High',
    status: 'Escalated',
    lastMessage: 'The system keeps saying my BVN is invalid',
    lastMessageTime: '8h',
    unreadCount: 0,
    createdAt: '05 Apr 2026',
    messages: [
      {
        id: 'msg-006a',
        threadId: 'tkt-006',
        senderId: 'USR-010',
        content: 'I have been trying to complete my KYC for 2 days now. At the BVN step, the system keeps saying my BVN is invalid but I have triple-checked the number and it is correct. I even verified it with my bank.',
        createdAt: '2026-04-05T10:00:00Z',
        timestamp: '10:00 AM',
      },
      {
        id: 'msg-006b',
        threadId: 'tkt-006',
        senderId: 'ADMIN',
        content: 'Hi Grace, this could be a system issue. I have escalated this to our engineering team. In the meantime, could you send me a screenshot of the error message you are seeing?',
        createdAt: '2026-04-05T11:00:00Z',
        timestamp: '11:00 AM',
      },
      {
        id: 'msg-006c',
        threadId: 'tkt-006',
        senderId: 'USR-010',
        content: 'The system keeps saying my BVN is invalid. I will take a screenshot next time it happens and send it over.',
        createdAt: '2026-04-05T14:00:00Z',
        timestamp: '2:00 PM',
      },
    ],
  },
];

// ── Store ────────────────────────────────────────────────────────────────

export const useAdminMessagesStore = create<AdminMessagesState>((set, get) => ({
  threads: [],
  activeThreadId: null,
  searchQuery: '',
  categoryFilter: 'All',
  statusFilter: 'All',

  isLoading: false,
  isSending: false,
  isActionLoading: false,
  error: null,

  isMobileDetailOpen: false,

  fetchThreads: async () => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        const d = await apiGet<{ threads: SupportThread[] }>('/api/admin/support-tickets');
        set({ threads: d.threads, isLoading: false });
        return;
      }
      await new Promise((r) => setTimeout(r, 600));
      set({ threads: MOCK_THREADS, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed', isLoading: false });
    }
  },

  sendReply: async (threadId, content) => {
    set({ isSending: true, error: null });
    await new Promise((r) => setTimeout(r, 500));

    const newMessage: AdminMessage = {
      id: `msg-${Date.now()}`,
      threadId,
      senderId: 'ADMIN',
      content,
      createdAt: new Date().toISOString(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    set((s) => ({
      threads: s.threads.map((t) =>
        t.id === threadId
          ? {
              ...t,
              messages: [...t.messages, newMessage],
              lastMessage: content,
              lastMessageTime: 'Just now',
              status: t.status, // Status must be changed explicitly via resolveThreadMock/escalateThreadMock
            }
          : t
      ),
      isSending: false,
    }));
  },

  resolveThread: async (threadId) => {
    set({ isActionLoading: true });
    await new Promise((r) => setTimeout(r, 400));
    set((s) => ({
      threads: s.threads.map((t) =>
        t.id === threadId ? { ...t, status: 'Resolved' as const, unreadCount: 0 } : t
      ),
      isActionLoading: false,
    }));
  },

  escalateThread: async (threadId) => {
    set({ isActionLoading: true });
    await new Promise((r) => setTimeout(r, 400));
    set((s) => ({
      threads: s.threads.map((t) =>
        t.id === threadId ? { ...t, status: 'Escalated' as const } : t
      ),
      isActionLoading: false,
    }));
  },

  reopenThread: async (threadId) => {
    set({ isActionLoading: true });
    await new Promise((r) => setTimeout(r, 400));
    set((s) => ({
      threads: s.threads.map((t) =>
        t.id === threadId ? { ...t, status: 'Open' as const } : t
      ),
      isActionLoading: false,
    }));
  },

  setActiveThreadId: (id) => set({ activeThreadId: id, isMobileDetailOpen: false }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  toggleMobileDetail: (open) => set({ isMobileDetailOpen: open }),

  // Backward-compatible aliases
  fetchThreadsMock: async () => get().fetchThreads(),
  sendReplyMock: async (threadId, content) => get().sendReply(threadId, content),
  resolveThreadMock: async (threadId) => get().resolveThread(threadId),
  escalateThreadMock: async (threadId) => get().escalateThread(threadId),
  reopenThreadMock: async (threadId) => get().reopenThread(threadId),
}));
