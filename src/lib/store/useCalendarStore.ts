import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiGet, apiPost } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------
export type CalendarEventType = 'Inspection' | 'Viewing' | 'Meeting' | 'Other' | 'Tour';

export type CalendarEvent = {
  id: string;
  type: CalendarEventType;
  clientName: string;
  dateISO: string; // "YYYY-MM-DD"
  startTime: string;
  endTime: string;
  bookingId?: string;
};

export type AvailabilityPayload = {
  date: string;
  time: string;
};

interface CalendarStore {
  events: CalendarEvent[];
  isLoadingEvents: boolean;
  isSavingAvailability: boolean;
  error: string | null;

  currentMonth: Date;
  selectedDate: Date;
  isAvailabilityModalOpen: boolean;

  fetchEvents: (month: Date) => Promise<void>;
  saveAvailability: (availabilities: AvailabilityPayload[]) => Promise<void>;
  addTourEvent: (event: CalendarEvent) => void;
  removeEvent: (id: string) => void;

  setCurrentMonth: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
  setAvailabilityModalOpen: (isOpen: boolean) => void;

  /** @deprecated Use fetchEvents() */
  fetchEventsMock: (month: Date) => Promise<void>;
  /** @deprecated Use saveAvailability() */
  saveAvailabilityMock: (availabilities: AvailabilityPayload[]) => Promise<void>;
}

// ---------------------------------------------------------------------------
// MOCK DATA FACTORY
// ---------------------------------------------------------------------------
const generateBaseMockEvents = (baseMonth: Date): CalendarEvent[] => {
  const year = baseMonth.getFullYear();
  const month = String(baseMonth.getMonth() + 1).padStart(2, '0');
  return [
    { id: 'e1', type: 'Inspection', clientName: 'John Doe', dateISO: `${year}-${month}-14`, startTime: '1am', endTime: '4pm' },
    { id: 'e2', type: 'Inspection', clientName: 'John Doe', dateISO: `${year}-${month}-16`, startTime: '1am', endTime: '4pm' },
    { id: 'e3', type: 'Inspection', clientName: 'John Doe', dateISO: `${year}-${month}-21`, startTime: '1am', endTime: '4pm' },
  ];
};

// ---------------------------------------------------------------------------
// STORE
// ---------------------------------------------------------------------------
export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      events: [],
      isLoadingEvents: false,
      isSavingAvailability: false,
      error: null,

      currentMonth: new Date(),
      selectedDate: new Date(),
      isAvailabilityModalOpen: false,

      fetchEvents: async (month) => {
        set({ isLoadingEvents: true, error: null });
        try {
          if (USE_API) {
            const ym = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
            const data = await apiGet<{ events: CalendarEvent[] }>(`/api/agent/calendar/events?month=${ym}`);
            set((s) => {
              const tourEvents = s.events.filter((e) => e.type === 'Tour' || e.bookingId);
              const merged = [...data.events, ...tourEvents];
              return { events: merged, isLoadingEvents: false };
            });
          } else {
            await new Promise((resolve) => setTimeout(resolve, 600));
            const base = generateBaseMockEvents(month);
            set((s) => {
              const tourEvents = s.events.filter((e) => e.type === 'Tour' || e.bookingId);
              const merged = [...base, ...tourEvents];
              return { events: merged, isLoadingEvents: false };
            });
          }
        } catch (err: unknown) {
          set({ error: err instanceof Error ? err.message : 'Failed', isLoadingEvents: false });
        }
      },

      saveAvailability: async (availabilities) => {
        set({ isSavingAvailability: true, error: null });
        try {
          if (USE_API) {
            await apiPost('/api/agent/calendar/availability', { availabilities });
          } else {
            await new Promise((resolve) => setTimeout(resolve, 800));
          }
          set({ isSavingAvailability: false, isAvailabilityModalOpen: false });
        } catch (err: unknown) {
          set({ error: err instanceof Error ? err.message : 'Failed', isSavingAvailability: false });
        }
      },

      addTourEvent: (event) => {
        set((s) => ({
          events: [...s.events.filter((e) => e.id !== event.id), event],
        }));
      },

      removeEvent: (id) => {
        set((s) => ({ events: s.events.filter((e) => e.id !== id) }));
      },

      setCurrentMonth: (date) => set({ currentMonth: date }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setAvailabilityModalOpen: (isOpen) => set({ isAvailabilityModalOpen: isOpen }),

      // Backward-compatible aliases
      fetchEventsMock: async (month) => get().fetchEvents(month),
      saveAvailabilityMock: async (availabilities) => get().saveAvailability(availabilities),
    }),
    {
      name: 'irealty-calendar',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (typeof state.currentMonth === 'string') state.currentMonth = new Date(state.currentMonth);
          if (typeof state.selectedDate === 'string') state.selectedDate = new Date(state.selectedDate);
        }
      },
    }
  )
);
