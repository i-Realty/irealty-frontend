import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiGet, apiPost } from '@/lib/api/client';
import { mapRole } from '@/lib/api/adapters';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { initPusher, subscribeToConversation } from '@/lib/services/pusher';
import type { UserRole } from './useAuthStore';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// Module-level unsubscribe handle — lives outside the store to avoid
// Zustand serialization and to survive hot-reloads cleanly.
let pusherUnsub: (() => void) | null = null;

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
  audioDuration?: number;
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

  fetchThreads: () => Promise<void>;
  fetchThread: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, content: string, type: MessageContentType, files?: FilePayload[]) => Promise<void>;

  /** @deprecated Use fetchThreads() */
  fetchThreadsMock: () => Promise<void>;
  /** @deprecated Use sendMessage() */
  sendMessageMock: (chatId: string, content: string, type: MessageContentType, files?: FilePayload[]) => Promise<void>;

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
// BACKEND TYPES
// ---------------------------------------------------------------------------
interface BackendParticipantUser {
  id: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  roles?: string[];
}

interface BackendParticipant {
  userId: string;
  user?: BackendParticipantUser;
}

interface BackendAttachment {
  url: string;
  mimeType?: string;
  filename?: string;
}

interface BackendMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'TEXT' | 'SYSTEM';
  attachments: BackendAttachment[];
  createdAt: string;
}

interface BackendConversation {
  id: string;
  type: 'DIRECT' | 'LISTING';
  listingId?: string;
  participants: BackendParticipant[];
  messages: BackendMessage[];
  createdAt: string;
  updatedAt: string;
}

interface BackendListing {
  id: string | number;
  title?: string;
  price?: number;
  images?: { url: string }[];
}

// ---------------------------------------------------------------------------
// ADAPTERS
// ---------------------------------------------------------------------------
function formatRelativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function mapBackendMessage(m: BackendMessage, currentUserId: string): Message {
  const date = new Date(m.createdAt);
  return {
    id:          m.id,
    chatId:      m.conversationId,
    senderId:    m.senderId === currentUserId ? 'ME' : m.senderId,
    content:     m.content,
    contentType: 'text',
    files: (m.attachments ?? []).map(a => ({
      name:   a.filename ?? 'attachment',
      url:    a.url,
      sizeMb: 0,
      format: a.mimeType?.split('/')[1] ?? 'file',
    })),
    createdAt: m.createdAt,
    timestamp: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  };
}

function mapConversation(conv: BackendConversation, currentUserId: string): ChatThread {
  // Find the other participant (not current user)
  const other = conv.participants.find(p => p.userId !== currentUserId) ?? conv.participants[0];
  const ou = other?.user;
  const participantName = ou?.displayName
    || `${ou?.firstName ?? ''} ${ou?.lastName ?? ''}`.trim()
    || 'User';

  const messages = (conv.messages ?? []).map(m => mapBackendMessage(m, currentUserId));
  const lastMsg  = messages[messages.length - 1];

  return {
    id: conv.id,
    participant: {
      id:         ou?.id ?? other?.userId ?? 'unknown',
      name:       participantName,
      avatar:     ou?.avatarUrl ?? '/images/demo-avatar.jpg',
      isVerified: false,
      role:       mapRole(ou?.roles?.[0] ?? '') as UserRole,
    },
    lastMessage:     lastMsg?.content ?? '',
    lastMessageTime: lastMsg ? formatRelativeTime(lastMsg.createdAt) : '',
    unreadCount:     0,
    propertyContext: {
      id:             conv.listingId ?? '',
      title:          '',
      priceRaw:       0,
      priceFormatted: '',
      image:          '',
    },
    contextType: conv.type === 'LISTING' ? 'property' : 'general',
    contextId:   conv.listingId,
    messages,
    createdAt:   conv.createdAt,
  };
}

// ---------------------------------------------------------------------------
// SEED DATA
// ---------------------------------------------------------------------------
export const generateMockThreads = (): ChatThread[] => {
  const now = new Date().toISOString();
  return [
    {
      id: 'chat_1',
      participant: { id: 'u1', name: 'Wade Warren', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150', isVerified: true, role: 'Property Seeker' },
      lastMessage: 'Hello, please let try to...', lastMessageTime: '2h', unreadCount: 2,
      contextType: 'property', contextId: 'prop_seed_001',
      propertyContext: { id: 'prop_seed_001', title: '3-Bed Duplex, Lekki', priceRaw: 45000000, priceFormatted: '₦45,000,000', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80' },
      messages: [
        { id: 'm1', chatId: 'chat_1', senderId: 'u1', content: 'Hi Sir', contentType: 'text', createdAt: now, timestamp: '1:10PM' },
        { id: 'm2', chatId: 'chat_1', senderId: 'u1', content: 'I am interested in the 3-bed duplex. Is it still available?', contentType: 'text', createdAt: now, timestamp: '1:10PM' },
        { id: 'm3', chatId: 'chat_1', senderId: 'u1', content: 'Can we schedule a tour this weekend?', contentType: 'text', createdAt: now, timestamp: '1:11PM' },
        { id: 'm4', chatId: 'chat_1', senderId: 'ME', content: 'Yes, the property is available. I can do Saturday 11am.', contentType: 'text', createdAt: now, timestamp: '1:12PM' },
      ],
      createdAt: now,
    },
    {
      id: 'chat_2',
      participant: { id: 'u2', name: 'Alena B', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150', role: 'Property Seeker' },
      lastMessage: 'Hello, is the mansion still listed?', lastMessageTime: '2h', unreadCount: 1,
      contextType: 'property', contextId: 'prop_seed_002',
      propertyContext: { id: 'prop_seed_002', title: '5-Bed Mansion, Ikoyi', priceRaw: 85000000, priceFormatted: '₦85,000,000', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80' },
      messages: [
        { id: 'c2m1', chatId: 'chat_2', senderId: 'u2', content: 'Hello', contentType: 'text', createdAt: now, timestamp: '10:02AM' },
        { id: 'c2m2', chatId: 'chat_2', senderId: 'u2', content: 'Hello, is the mansion still listed?', contentType: 'text', createdAt: now, timestamp: '10:03AM' },
      ],
      createdAt: now,
    },
    {
      id: 'chat_3',
      participant: { id: 'u3', name: 'Cameron W', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150', role: 'Property Seeker' },
      lastMessage: 'What is the annual rent for the office space?', lastMessageTime: '2h', unreadCount: 1,
      contextType: 'property', contextId: 'prop_seed_005',
      propertyContext: { id: 'prop_seed_005', title: 'Office Space, Ikeja', priceRaw: 5000000, priceFormatted: '₦5,000,000/yr', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09be15f1?auto=format&fit=crop&q=80' },
      messages: [
        { id: 'c3m1', chatId: 'chat_3', senderId: 'u3', content: 'Hello', contentType: 'text', createdAt: now, timestamp: '9:15AM' },
        { id: 'c3m2', chatId: 'chat_3', senderId: 'ME', content: 'Hi Cameron, how can I help you?', contentType: 'text', createdAt: now, timestamp: '9:20AM' },
        { id: 'c3m3', chatId: 'chat_3', senderId: 'u3', content: 'What is the annual rent for the office space?', contentType: 'text', createdAt: now, timestamp: '9:21AM' },
      ],
      createdAt: now,
    },
    {
      id: 'chat_4',
      participant: { id: 'u4', name: 'Ronald R', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=150&h=150', role: 'Property Seeker' },
      lastMessage: 'Can I get a virtual tour link?', lastMessageTime: '2h', unreadCount: 1,
      contextType: 'property', contextId: 'prop_seed_001',
      propertyContext: { id: 'prop_seed_001', title: '3-Bed Duplex, Lekki', priceRaw: 45000000, priceFormatted: '₦45,000,000', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80' },
      messages: [
        { id: 'c4m1', chatId: 'chat_4', senderId: 'u4', content: 'Hello', contentType: 'text', createdAt: now, timestamp: '8:30AM' },
        { id: 'c4m2', chatId: 'chat_4', senderId: 'ME', content: 'Good morning Ronald, happy to assist!', contentType: 'text', createdAt: now, timestamp: '8:45AM' },
        { id: 'c4m3', chatId: 'chat_4', senderId: 'u4', content: 'Can I get a virtual tour link?', contentType: 'text', createdAt: now, timestamp: '8:46AM' },
      ],
      createdAt: now,
    },
    {
      id: 'chat_5',
      participant: { id: 'u5', name: 'Dianne R', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150', role: 'Diaspora' },
      lastMessage: 'Interested in the Asokoro Villas project.', lastMessageTime: '2h', unreadCount: 1,
      contextType: 'service', contextId: 'plan_premium',
      propertyContext: { id: 'prop_seed_003', title: 'Asokoro Villas Phase 2', priceRaw: 90000000, priceFormatted: '₦90,000,000', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80' },
      messages: [
        { id: 'c5m1', chatId: 'chat_5', senderId: 'u5', content: 'Hello', contentType: 'text', createdAt: now, timestamp: '7:00AM' },
        { id: 'c5m2', chatId: 'chat_5', senderId: 'ME', content: 'Hi Dianne, welcome! How can I help?', contentType: 'text', createdAt: now, timestamp: '7:10AM' },
        { id: 'c5m3', chatId: 'chat_5', senderId: 'u5', content: 'Interested in the Asokoro Villas project.', contentType: 'text', createdAt: now, timestamp: '7:11AM' },
      ],
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
            const currentUserId = useAuthStore.getState().user?.id ?? '';
            const data = await apiGet<BackendConversation[]>('/api/messages/conversations');
            const convs = Array.isArray(data) ? data : [];
            const threads = convs.map(c => mapConversation(c, currentUserId));
            set({ threads, isLoadingChats: false });

            // Enrich property context for listing-type conversations in background
            const listingConvs = convs.filter(c => c.type === 'LISTING' && c.listingId);
            if (listingConvs.length > 0) {
              const listingIds = [...new Set(listingConvs.map(c => c.listingId!))];
              Promise.all(
                listingIds.map(id =>
                  apiGet<BackendListing>(`/api/marketplace/${id}`).catch(() => null)
                )
              ).then(listings => {
                const listingMap: Record<string, BackendListing> = {};
                listings.forEach((l, i) => { if (l) listingMap[listingIds[i]] = l; });
                set((s) => ({
                  threads: s.threads.map(t => {
                    const conv = listingConvs.find(c => c.id === t.id);
                    if (!conv?.listingId) return t;
                    const listing = listingMap[conv.listingId];
                    if (!listing) return t;
                    return {
                      ...t,
                      propertyContext: {
                        id:             String(listing.id),
                        title:          listing.title ?? '',
                        priceRaw:       (listing.price ?? 0) / 100,
                        priceFormatted: listing.price ? `₦${((listing.price) / 100).toLocaleString('en-NG')}` : '',
                        image:          listing.images?.[0]?.url ?? '',
                      },
                    };
                  }),
                }));
              }).catch(() => {});
            }
          } else {
            await new Promise((resolve) => setTimeout(resolve, 800));
            const { threads } = get();
            const seedThreads = generateMockThreads();
            if (threads.length === 0) {
              set({ threads: seedThreads, isLoadingChats: false });
            } else {
              const patched = threads.map((t) => {
                if (t.messages.length > 0) return t;
                const seed = seedThreads.find((s) => s.id === t.id);
                return seed ? { ...t, messages: seed.messages, lastMessage: seed.lastMessage } : t;
              });
              set({ threads: patched, isLoadingChats: false });
            }
          }
        } catch (err: unknown) {
          set({ error: err instanceof Error ? err.message : 'Failed', isLoadingChats: false });
        }
      },

      fetchThread: async (chatId) => {
        if (!USE_API) return;
        try {
          const currentUserId = useAuthStore.getState().user?.id ?? '';
          const conv = await apiGet<BackendConversation>(`/api/messages/conversations/${chatId}`);
          const thread = mapConversation(conv, currentUserId);
          set((s) => ({
            threads: s.threads.some(t => t.id === chatId)
              ? s.threads.map(t => t.id === chatId ? thread : t)
              : [thread, ...s.threads],
          }));
        } catch {
          // Non-critical — keep existing thread data
        }
      },

      sendMessage: async (chatId, content, type, files) => {
        set({ isSendingMessage: true, error: null });
        try {
          if (USE_API) {
            const currentUserId = useAuthStore.getState().user?.id ?? '';
            // Backend expects { content, attachments? } — file uploads not yet implemented
            const raw = await apiPost<BackendMessage>(
              `/api/messages/conversations/${chatId}/messages`,
              { content }
            );
            const newMessage = mapBackendMessage(raw, currentUserId);
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

        // In API mode, create the conversation on the backend and update the thread ID
        if (USE_API) {
          const payload: Record<string, unknown> = {
            type: contextId ? 'LISTING' : 'DIRECT',
            participantUserId: participant.id,
          };
          if (contextId) payload.listingId = contextId;

          apiPost<BackendConversation>('/api/messages/conversations', payload)
            .then(conv => {
              // Replace temp ID with the real backend ID
              set((s) => ({
                threads: s.threads.map(t =>
                  t.id === newThread.id ? { ...t, id: conv.id } : t
                ),
                activeChatId: conv.id,
              }));
            })
            .catch(() => { /* keep temp thread — user can still chat locally */ });
        }

        return newThread;
      },

      markThreadRead: (chatId) => {
        set((s) => ({
          threads: s.threads.map((t) =>
            t.id === chatId ? { ...t, unreadCount: 0 } : t
          ),
        }));
        // Notify backend in API mode (fire-and-forget)
        if (USE_API) {
          apiPost(`/api/messages/conversations/${chatId}/read`, {}).catch(() => {});
        }
      },

      setActiveChatId: (id) => {
        // Unsubscribe from the previous conversation channel
        if (pusherUnsub) { pusherUnsub(); pusherUnsub = null; }

        set({ activeChatId: id, isMobileContextOpen: false });

        // Subscribe to the new conversation channel via Pusher (API mode only)
        if (id && USE_API) {
          initPusher().then(() => {
            const currentUserId = useAuthStore.getState().user?.id ?? '';
            pusherUnsub = subscribeToConversation(id, (raw: unknown) => {
              const m = raw as Record<string, unknown>;
              const createdAt = String(m.createdAt ?? new Date().toISOString());
              const newMsg: Message = {
                id:          String(m.id ?? `pusher_${Date.now()}`),
                chatId:      id,
                senderId:    String(m.senderId ?? '') === currentUserId ? 'ME' : String(m.senderId ?? ''),
                content:     String(m.content ?? ''),
                contentType: 'text',
                files:       [],
                createdAt,
                timestamp:   new Date(createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
              };
              // Only add if not already in the thread (dedup with optimistic messages)
              const alreadyPresent = (useMessagesStore.getState().threads
                .find(t => t.id === id)?.messages ?? [])
                .some(existing => existing.id === newMsg.id);
              if (!alreadyPresent) {
                useMessagesStore.setState((s) => ({
                  threads: s.threads.map(t =>
                    t.id === id
                      ? { ...t, messages: [...t.messages, newMsg], lastMessage: newMsg.content, lastMessageTime: 'Just now' }
                      : t
                  ),
                }));
              }
            });
          }).catch(() => {});
        }
      },
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
