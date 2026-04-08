import { create } from 'zustand';

// ---------------------------------------------------------------------------
// TYPES: Structured to explicitly mirror expected NestJS API Payloads
// ---------------------------------------------------------------------------
export type UserBase = {
  id: string;
  name: string;
  avatar: string;
  isVerified?: boolean;
};

export type PropertyContext = {
  id: string;
  title: string;
  priceRaw: number;
  priceFormatted: string;
  image: string;
};

export type MessageContentType = 'text' | 'document' | 'image_grid' | 'video';

export type FilePayload = {
  name: string;
  url: string;
  sizeMb: number;
  pages?: number;
  format: string; // 'pdf', 'mp4', 'png'
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
  content: string; // Used for text messages or captions
  contentType: MessageContentType;
  files?: FilePayload[]; // Supports single or multiple file attachments
  createdAt: string;
  timestamp: string; // Formatted "1:12PM" 
};

export type ChatThread = {
  id: string;
  participant: UserBase;
  lastMessage: string;
  lastMessageTime: string; // Formatted "2h"
  unreadCount: number;
  propertyContext: PropertyContext;
  messages: Message[];
};

// ---------------------------------------------------------------------------
// STORE INTERFACE: Handling mock API bounds and robust SPA toggles
// ---------------------------------------------------------------------------
export type UploadModalState = 'none' | 'media' | 'document_list' | 'document_preview';

interface MessagesStore {
  // API Readiness Data States
  threads: ChatThread[];
  isLoadingChats: boolean;
  isLoadingMessages: boolean;
  isSendingMessage: boolean;
  error: string | null;

  // SPA Navigation UI States (Used particularly for Mobile Responsive Layouts)
  activeChatId: string | null;
  searchQuery: string;
  isMobileContextOpen: boolean;
  
  // Media Upload Flow States
  uploadModalState: UploadModalState;
  stagedFiles: StagedFile[];

  // Actions
  fetchThreadsMock: () => Promise<void>;
  sendMessageMock: (chatId: string, content: string, type: MessageContentType, files?: FilePayload[]) => Promise<void>;
  
  setActiveChatId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleMobileContext: (isOpen: boolean) => void;
  
  setUploadModalState: (state: UploadModalState) => void;
  setStagedFiles: (files: StagedFile[]) => void;
  clearUploadState: () => void;
}

// ---------------------------------------------------------------------------
// MOCK DATA FACTORY (Isolated for easy swapping)
// ---------------------------------------------------------------------------
export const generateMockThreads = (): ChatThread[] => {
  return [
    {
      id: 'chat_1',
      participant: { id: 'u1', name: 'Wade Warren', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150', isVerified: true },
      lastMessage: 'Hello, please let try to...',
      lastMessageTime: '2h',
      unreadCount: 2,
      propertyContext: {
        id: 'prop_1',
        title: '3-Bed Duplex, Lekki',
        priceRaw: 25000,
        priceFormatted: '₦25,000',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80'
      },
      messages: [
        {
          id: 'm1',
          chatId: 'chat_1',
          senderId: 'u1',
          content: 'Hi Sir',
          contentType: 'text',
          createdAt: new Date().toISOString(),
          timestamp: '1:10PM'
        },
        {
          id: 'm2',
          chatId: 'chat_1',
          senderId: 'u1',
          content: 'Lorem ipsum dolor sit amet consectetur.',
          contentType: 'text',
          createdAt: new Date().toISOString(),
          timestamp: '1:10PM'
        },
        {
          id: 'm3',
          chatId: 'chat_1',
          senderId: 'u1',
          content: 'Sit habitant in at vel et donec donec. Suspendisse nunc dictum ultricies accumsan tortor. Id ultrices viverra sit mi egestas vestibulum. A tincidunt auctor sed feugiat non.',
          contentType: 'text',
          createdAt: new Date().toISOString(),
          timestamp: '1:11PM'
        },
        {
          id: 'm4',
          chatId: 'chat_1',
          senderId: 'u1',
          content: 'Arcu aliquet scelerisque velit scelerisque pellentesque bibendum ante. Viverra velit leo et lectus nullam porta molestie. Faucibus id arcu viverra mi.',
          contentType: 'text',
          createdAt: new Date().toISOString(),
          timestamp: '1:12PM'
        },
        {
          id: 'm5',
          chatId: 'chat_1',
          senderId: 'ME', // Identifies current user agent
          content: 'Lorem ipsum dolor sit amet consectetur.\n\nSit habitant in at vel et donec donec. Suspendisse nunc dictum ultricies accumsan tortor. Id ultrices viverra sit mi egestas vestibulum. A tincidunt auctor sed feugiat non.',
          contentType: 'text',
          createdAt: new Date().toISOString(),
          timestamp: '1:12PM'
        }
      ]
    },
    {
      id: 'chat_2',
      participant: { id: 'u2', name: 'Alena B', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150' },
      lastMessage: 'Hello',
      lastMessageTime: '2h',
      unreadCount: 0,
      propertyContext: {
        id: 'prop_2',
        title: '4-Bed Villa, Victoria Island',
        priceRaw: 150000,
        priceFormatted: '₦150,000',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80'
      },
      messages: []
    },
    {
      id: 'chat_3',
      participant: { id: 'u3', name: 'Cameron W', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150' },
      lastMessage: 'Hello',
      lastMessageTime: '2h',
      unreadCount: 0,
      propertyContext: {
        id: 'prop_3',
        title: 'Commercial Space, Ikeja',
        priceRaw: 400000,
        priceFormatted: '₦400,000',
        image: 'https://images.unsplash.com/photo-1600607687920-4e2a09be15f1?auto=format&fit=crop&q=80'
      },
      messages: []
    },
    {
      id: 'chat_4',
      participant: { id: 'u4', name: 'Ronald R', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=150&h=150' },
      lastMessage: 'Hello',
      lastMessageTime: '2h',
      unreadCount: 0,
      propertyContext: {
        id: 'prop_1',
        title: '3-Bed Duplex, Lekki',
        priceRaw: 25000,
        priceFormatted: '₦25,000',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80'
      },
      messages: []
    },
    {
      id: 'chat_5',
      participant: { id: 'u5', name: 'Dianne R', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150' },
      lastMessage: 'Hello',
      lastMessageTime: '2h',
      unreadCount: 0,
      propertyContext: {
        id: 'prop_1',
        title: '3-Bed Duplex, Lekki',
        priceRaw: 25000,
        priceFormatted: '₦25,000',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80'
      },
      messages: []
    }
  ];
};

// ---------------------------------------------------------------------------
// EXPORT ZUSTAND HOOK
// ---------------------------------------------------------------------------
export const useMessagesStore = create<MessagesStore>((set, get) => ({
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

  fetchThreadsMock: async () => {
    set({ isLoadingChats: true, error: null });
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    try {
      const mockData = generateMockThreads();
      set({ threads: mockData, isLoadingChats: false });
    } catch (err: any) {
      set({ error: err.message, isLoadingChats: false });
    }
  },

  sendMessageMock: async (chatId, content, type, files) => {
    set({ isSendingMessage: true, error: null });
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 600));
    try {
      const newMessage: Message = {
        id: Math.random().toString(36).substring(7),
        chatId,
        senderId: 'ME',
        content,
        contentType: type,
        files: files || [],
        createdAt: new Date().toISOString(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };

      // Pessimistically update the store 
      set((state) => ({
        threads: state.threads.map((thread) => {
          if (thread.id === chatId) {
            return {
              ...thread,
              messages: [...thread.messages, newMessage],
              lastMessage: type === 'text' ? content : `[${type} attachment]`,
              lastMessageTime: 'Just now'
            };
          }
          return thread;
        }),
        isSendingMessage: false,
        uploadModalState: 'none', // Close any open modals automatically
        stagedFiles: []           // Purge memory
      }));

    } catch (err: any) {
      set({ error: err.message, isSendingMessage: false });
    }
  },

  setActiveChatId: (id) => set({ activeChatId: id, isMobileContextOpen: false }), // Reset context pane on chat switch
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleMobileContext: (isOpen) => set({ isMobileContextOpen: isOpen }),

  setUploadModalState: (state) => set({ uploadModalState: state }),
  setStagedFiles: (files) => set({ stagedFiles: files }),
  clearUploadState: () => set({ uploadModalState: 'none', stagedFiles: [] })
}));
