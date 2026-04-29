import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiGet, apiPost } from '@/lib/api/client';
import type { UserRole } from './useAuthStore';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------
export type UserBase = {
  id: string;
  name: string;
  avatar: string;
  isVerified?: boolean;
  role?: UserRole;
};

export type PropertyContext = {
  id: string;
  title: string;
  priceRaw: number;
  priceFormatted: string;
  image: string;
};

export type MessageContentType = 'text' | 'document' | 'image_grid' | 'video' | 'audio';

export type FilePayload = {
  name: string;
  url: string;
  sizeMb: number;
  pages?: number;
  format: string;
  audioDuration?: number; // seconds — set for audio messages
};

export interface StagedFile {
  url: string;
  name: string;
  sizeMb: number;
  format: string;
  pages?: number;
  isVideo?: boolean;
}

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  contentType: MessageContentType;
  files?: FilePayload[];
  createdAt: string;
  timestamp: string;
};

export type ContextType = 'property' | 'transaction' | 'general' | 'service';

export type ChatThread = {
  id: string;
  participant: UserBase;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  propertyContext: PropertyContext;
  contextType?: ContextType;
  contextId?: string;
  messages: Message[];
  createdAt: string;
};

/**
 * Message permission matrix.
 * Defines which roles can initiate messages to which other roles.
 */
export const MESSAGE_PERMISSION_MATRIX: Partial<Record<UserRole, UserRole[]>> = {
  Admin:             ['Agent', 'Developer', 'Landlord', 'Property Seeker', 'Diaspora'],
  Agent:             ['Admin', 'Landlord', 'Property Seeker', 'Diaspora'],
  Developer:         ['Admin', 'Property Seeker', 'Diaspora'],
  Landlord:          ['Admin', 'Agent', 'Property Seeker'],
  'Property Seeker': ['Admin', 'Agent', 'Developer', 'Landlord'],
  Diaspora:          ['Admin', 'Agent', 'Developer'],
};

export function canMessage(fromRole: UserRole, toRole: UserRole): boolean {
  return MESSAGE_PERMISSION_MATRIX[fromRole]?.includes(toRole) ?? false;
}

// ---------------------------------------------------------------------------
// UPLOAD MODAL STATE
// ---------------------------------------------------------------------------
export type UploadModalState = 'none' | 'media' | 'document_list' | 'document_preview';

interface MessagesStore {
  threads: ChatThread[];
  isLoadingChats: boolean;
  isLoadingMessages: boolean;
  isSendingMessage: boolean;
  error: string | null;

  activeChatId: string | null;
  searchQuery: string;
  isMobileContextOpen: boolean;

  uploadModalState: UploadModalState;
  stagedFiles: StagedFile[];

  // Actions
  fetchThreads: () => Promise<void>;
  sendMessage: (chatId: string, content: string, type: MessageContentType, files?: FilePayload[]) => Promise<void>;

  /** @deprecated Use fetchThreads() */
  fetchThreadsMock: () => Promise<void>;
  /** @deprecated Use sendMessage() */
  sendMessageMock: (chatId: string, content: string, type: MessageContentType, files?: FilePayload[]) => Promise<void>;

  /**
   * Start a new thread with a specific user.
   * Returns null if the role permission matrix blocks this conversation.
   */
  startThread: (
    fromRole: UserRole,
    participant: UserBase,
    propertyContext: PropertyContext,
    contextType?: ContextType,
    contextId?: string
  ) => ChatThread | null;

  markThreadRead: (chatId: string) => void;

  setActiveChatId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleMobileContext: (isOpen: boolean) => void;

  setUploadModalState: (state: UploadModalState) => void;
  setStagedFiles: (files: StagedFile[]) => void;
  clearUploadState: () => void;
}

// ---------------------------------------------------------------------------
// SEED DATA
// ---------------------------------------------------------------------------
export const generateMockThreads = (): ChatThread[] => {
  const now = new Date().toISOString();
  return [
    {
      id: 'chat_1',
      participant: {
        id: 'u1',
        name: 'Wade Warren',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150',
        isVerified: true,
        role: 'Property Seeker',
      },
      lastMessage: 'Hello, please let try to...',
      lastMessageTime: '2h',
      unreadCount: 2,
      contextType: 'property',
      contextId: 'prop_seed_001',
      propertyContext: {
        id: 'prop_seed_001',
        title: '3-Bed Duplex, Lekki',
        priceRaw: 45000000,
        priceFormatted: '₦45,000,000',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80',
      },
      messages: [
        { id: 'm1', chatId: 'chat_1', senderId: 'u1', content: 'Hi Sir', contentType: 'text', createdAt: now, timestamp: '1:10PM' },
        { id: 'm2', chatId: 'chat_1', senderId: 'u1', content: 'I am interested in the 3-bed duplex. Is it still available?', contentType: 'text', createdAt: now, timestamp: '1:10PM' },
        { id: 'm3', chatId: 'chat_1', senderId: 'u1', content: 'Can we schedule a tour this weekend?', contentType: 'text', createdAt: now, timestamp: '1:11PM' },
        { id: 'm4', chatId: 'chat_1', senderId: 'ME', content: 'Yes, the property is available. I can do Saturday 11am. Let me know if that works.', contentType: 'text', createdAt: now, timestamp: '1:12PM' },
      ],
      createdAt: now,
    },
    {
      id: 'chat_2',
      participant: {
        id: 'u2',
        name: 'Alena B',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
        role: 'Property Seeker',
      },
      lastMessage: 'Hello',
      lastMessageTime: '2h',
      unreadCount: 0,
      contextType: 'property',
      contextId: 'prop_seed_002',
      propertyContext: {
        id: 'prop_seed_002',
        title: '5-Bed Mansion, Ikoyi',
        priceRaw: 85000000,
        priceFormatted: '₦85,000,000',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80',
      },
      messages: [],
      createdAt: now,
    },
    {
      id: 'chat_3',
      participant: {
        id: 'u3',
        name: 'Cameron W',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150',
        role: 'Property Seeker',
      },
      lastMessage: 'Hello',
      lastMessageTime: '2h',
      unreadCount: 0,
      contextType: 'property',
      contextId: 'prop_seed_005',
      propertyContext: {
        id: 'prop_seed_005',
        title: 'Office Space, Ikeja',
        priceRaw: 5000000,
        priceFormatted: '₦5,000,000/yr',
        image: 'https://images.unsplash.com/photo-1600607687920-4e2a09be15f1?auto=format&fit=crop&q=80',
      },
      messages: [],
      createdAt: now,
    },
    {
      id: 'chat_4',
      participant: {
        id: 'u4',
        name: 'Ronald R',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=150&h=150',
        role: 'Property Seeker',
      },
      lastMessage: 'Hello',
      lastMessageTime: '2h',
      unreadCount: 0,
      contextType: 'property',
      contextId: 'prop_seed_001',
      propertyContext: {
        id: 'prop_seed_001',
        title: '3-Bed Duplex, Lekki',
        priceRaw: 45000000,
        priceFormatted: '₦45,000,000',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80',
      },
      messages: [],
      createdAt: now,
    },
    {
      id: 'chat_5',
      participant: {
        id: 'u5',
        name: 'Dianne R',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
        role: 'Diaspora',
      },
      lastMessage: 'Hello',
      lastMessageTime: '2h',
      unreadCount: 0,
      contextType: 'service',
      contextId: 'plan_premium',
      propertyContext: {
        id: 'prop_seed_003',
        title: 'Asokoro Villas Phase 2',
        priceRaw: 90000000,
        priceFormatted: '₦90,000,000',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80',
      },
      messages: [],
      createdAt: now,
    },
  ];
};

// ---------------------------------------------------------------------------
// STORE
// ---------------------------------------------------------------------------
export const useMessagesStore = create<MessagesStore>()(
  persist(
    (set, get) => ({
      threads: [],
      isLoadingChats: false,
      isLoadingMessages: false,
      isSendingMessage: false,
      error: null,

      activeChatId: null,
      searchQuery: '',
      isMobileContextOpen: false,

      uploadModalState: 'none',
      stagedFiles: [],

      fetchThreads: async () => {
        set({ isLoadingChats: true, error: null });
        try {
          if (USE_API) {
            const data = await apiGet<{ threads: ChatThread[] }>('/api/messages/threads');
            set({ threads: data.threads, isLoadingChats: false });
          } else {
            await new Promise((resolve) => setTimeout(resolve, 800));
            const { threads } = get();
            // Only seed if no threads exist (so real threads persist)
            if (threads.length === 0) {
              set({ threads: generateMockThreads(), isLoadingChats: false });
            } else {
              set({ isLoadingChats: false });
            }
          }
        } catch (err: unknown) {
          set({ error: err instanceof Error ? err.message : 'Failed', isLoadingChats: false });
        }
      },

      sendMessage: async (chatId, content, type, files) => {
        set({ isSendingMessage: true, error: null });
        try {
          if (USE_API) {
            const data = await apiPost<{ message: Message }>(`/api/messages/${chatId}/send`, { content, type, files });
            set((state) => ({
              threads: state.threads.map((thread) => {
                if (thread.id !== chatId) return thread;
                return {
                  ...thread,
                  messages: [...thread.messages, data.message],
                  lastMessage: type === 'text' ? content : `[${type} attachment]`,
                  lastMessageTime: 'Just now',
                  unreadCount: 0,
                };
              }),
              isSendingMessage: false,
              uploadModalState: 'none',
              stagedFiles: [],
            }));
          } else {
            await new Promise((resolve) => setTimeout(resolve, 600));
            const newMessage: Message = {
              id: Math.random().toString(36).substring(7),
              chatId,
              senderId: 'ME',
              content,
              contentType: type,
              files: files || [],
              createdAt: new Date().toISOString(),
              timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            };
            set((state) => ({
              threads: state.threads.map((thread) => {
                if (thread.id !== chatId) return thread;
                return {
                  ...thread,
                  messages: [...thread.messages, newMessage],
                  lastMessage: type === 'text' ? content : `[${type} attachment]`,
                  lastMessageTime: 'Just now',
                  unreadCount: 0,
                };
              }),
              isSendingMessage: false,
              uploadModalState: 'none',
              stagedFiles: [],
            }));
          }
        } catch (err: unknown) {
          set({ error: err instanceof Error ? err.message : 'Failed', isSendingMessage: false });
        }
      },

      // Backward-compatible aliases
      fetchThreadsMock: async () => get().fetchThreads(),
      sendMessageMock: async (chatId, content, type, files) => get().sendMessage(chatId, content, type, files),

      startThread: (fromRole, participant, propertyContext, contextType = 'general', contextId) => {
        if (participant.role && !canMessage(fromRole, participant.role)) {
          console.warn(`[Messages] ${fromRole} cannot message ${participant.role}`);
          return null;
        }

        const existingThread = get().threads.find(
          (t) => t.participant.id === participant.id &&
            (contextId ? t.contextId === contextId : t.contextType === contextType)
        );
        if (existingThread) {
          set({ activeChatId: existingThread.id });
          return existingThread;
        }

        const now = new Date().toISOString();
        const newThread: ChatThread = {
          id: `chat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          participant,
          lastMessage: '',
          lastMessageTime: 'Just now',
          unreadCount: 0,
          propertyContext,
          contextType,
          contextId,
          messages: [],
          createdAt: now,
        };

        set((s) => ({
          threads: [newThread, ...s.threads],
          activeChatId: newThread.id,
        }));
        return newThread;
      },

      markThreadRead: (chatId) => {
        set((s) => ({
          threads: s.threads.map((t) =>
            t.id === chatId ? { ...t, unreadCount: 0 } : t
          ),
        }));
      },

      setActiveChatId: (id) => set({ activeChatId: id, isMobileContextOpen: false }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      toggleMobileContext: (isOpen) => set({ isMobileContextOpen: isOpen }),

      setUploadModalState: (state) => set({ uploadModalState: state }),
      setStagedFiles: (files) => set({ stagedFiles: files }),
      clearUploadState: () => set({ uploadModalState: 'none', stagedFiles: [] }),
    }),
    {
      name: 'irealty-messages',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ threads: state.threads }),
    }
  )
);
