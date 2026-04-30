import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/lib/api/client';

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

// ---------------------------------------------------------------------------
// BACKEND TYPES (from apidocs.md)
// ---------------------------------------------------------------------------
interface BackendCalendarEvent {
  id: string;
  userId: string;
  title: string;
  startAt: string;
  endAt: string;
  listingId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listing?: Record<string, any>;
  eventType: 'INSPECTION' | 'TOUR' | 'MEETING' | 'OTHER';
  description?: string;
  createdAt: string;
}

interface BackendAvailabilitySlot {
  id: string;
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  startTime: string;
  endTime: string;
}

// ---------------------------------------------------------------------------
// ADAPTERS
// ---------------------------------------------------------------------------
const EVENT_TYPE_MAP: Record<string, CalendarEventType> = {
  INSPECTION: 'Inspection', TOUR: 'Tour', MEETING: 'Meeting', OTHER: 'Other',
};
const EVENT_TYPE_TO_BACKEND: Record<string, string> = {
  Inspection: 'INSPECTION', Tour: 'TOUR', Meeting: 'MEETING', Other: 'OTHER', Viewing: 'TOUR',
};

function mapBackendEvent(e: BackendCalendarEvent): CalendarEvent {
  const start = new Date(e.startAt);
  const end   = new Date(e.endAt);
  const fmtTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
  return {
    id:         e.id,
    type:       EVENT_TYPE_MAP[e.eventType] ?? 'Other',
    clientName: e.title || e.listing?.title || 'Event',
    dateISO:    start.toISOString().split('T')[0],
    startTime:  fmtTime(start),
    endTime:    fmtTime(end),
    bookingId:  e.listingId,
  };
}

interface CalendarStore {
  events: CalendarEvent[];
  isLoadingEvents: boolean;
  isSavingAvailability: boolean;
  error: string | null;

  currentMonth: Date;
  selectedDate: Date;
  isAvailabilityModalOpen: boolean;

  fetchEvents: (month: Date) => Promise<void>;
  fetchEventById: (id: string) => Promise<CalendarEvent | null>;
  saveAvailability: (availabilities: AvailabilityPayload[]) => Promise<void>;
  createEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<CalendarEvent | null>;
  updateEvent: (id: string, patch: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
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
            // apidocs: GET /api/v1/calendar/events?month=N&year=N
            const raw = await apiGet<unknown>(
              `/api/calendar/events?month=${month.getMonth() + 1}&year=${month.getFullYear()}`
            );
            const list: BackendCalendarEvent[] = Array.isArray(raw) ? raw
              : Array.isArray((raw as Record<string, unknown>)?.items) ? (raw as Record<string, unknown[]>).items as BackendCalendarEvent[]
              : [];
            const apiEvents = list.map(mapBackendEvent);
            set((s) => {
              // Keep locally-added tour events that aren't from the API
              const localOnly = s.events.filter(e => (e.type === 'Tour' || e.bookingId) && !apiEvents.some(a => a.id === e.id));
              return { events: [...apiEvents, ...localOnly], isLoadingEvents: false };
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

      fetchEventById: async (id) => {
        // Return from cache first if available
        const cached = get().events.find(e => e.id === id);
        if (!USE_API) return cached ?? null;
        try {
          const raw = await apiGet<BackendCalendarEvent>(`/api/calendar/events/${id}`);
          const event = mapBackendEvent(raw);
          set((s) => ({
            events: s.events.some(e => e.id === id)
              ? s.events.map(e => e.id === id ? event : e)
              : [...s.events, event],
          }));
          return event;
        } catch {
          return cached ?? null;
        }
      },

      saveAvailability: async (availabilities) => {
        set({ isSavingAvailability: true, error: null });
        try {
          if (USE_API) {
            // apidocs: PUT /api/v1/calendar/availability with { slots: [...] }
            const DAY_MAP: Record<string, number> = {
              Sun: 7, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
              Sunday: 7, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6,
            };
            const slots = availabilities.map(a => {
              const d = new Date(a.date);
              const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
              return {
                dayOfWeek: DAY_MAP[dayName] ?? (d.getDay() === 0 ? 7 : d.getDay()),
                startTime: a.time.split(' - ')[0] || '09:00',
                endTime:   a.time.split(' - ')[1] || '17:00',
              };
            });
            await apiPut('/api/calendar/availability', { slots });
          } else {
            await new Promise((resolve) => setTimeout(resolve, 800));
          }
          set({ isSavingAvailability: false, isAvailabilityModalOpen: false });
        } catch (err: unknown) {
          set({ error: err instanceof Error ? err.message : 'Failed', isSavingAvailability: false });
        }
      },

      createEvent: async (event) => {
        try {
          if (USE_API) {
            // apidocs: POST /api/v1/calendar/events
            const startDate = new Date(`${event.dateISO}T${event.startTime.replace(/am|pm/i, ':00')}`);
            const endDate   = new Date(`${event.dateISO}T${event.endTime.replace(/am|pm/i, ':00')}`);
            const raw = await apiPost<BackendCalendarEvent>('/api/calendar/events', {
              title:     event.clientName,
              startAt:   startDate.toISOString(),
              endAt:     endDate.toISOString(),
              eventType: EVENT_TYPE_TO_BACKEND[event.type] ?? 'OTHER',
              ...(event.bookingId ? { listingId: event.bookingId } : {}),
            });
            const mapped = mapBackendEvent(raw);
            set((s) => ({ events: [...s.events, mapped] }));
            return mapped;
          }
          // Mock mode
          const newEvent: CalendarEvent = { ...event, id: `evt_${Date.now()}` };
          set((s) => ({ events: [...s.events, newEvent] }));
          return newEvent;
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to create event' });
          return null;
        }
      },

      updateEvent: async (id, patch) => {
        try {
          if (USE_API) {
            // apidocs: PATCH /api/v1/calendar/events/{id}
            const body: Record<string, unknown> = {};
            if (patch.clientName) body.title = patch.clientName;
            if (patch.type) body.eventType = EVENT_TYPE_TO_BACKEND[patch.type] ?? 'OTHER';
            if (patch.dateISO && patch.startTime) body.startAt = new Date(`${patch.dateISO}T${patch.startTime.replace(/am|pm/i, ':00')}`).toISOString();
            if (patch.dateISO && patch.endTime)   body.endAt   = new Date(`${patch.dateISO}T${patch.endTime.replace(/am|pm/i, ':00')}`).toISOString();
            await apiPatch(`/api/calendar/events/${id}`, body);
          }
          set((s) => ({
            events: s.events.map(e => e.id === id ? { ...e, ...patch } : e),
          }));
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to update event' });
        }
      },

      deleteEvent: async (id) => {
        try {
          if (USE_API) {
            // apidocs: DELETE /api/v1/calendar/events/{id}
            await apiDelete(`/api/calendar/events/${id}`);
          }
          set((s) => ({ events: s.events.filter(e => e.id !== id) }));
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to delete event' });
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
