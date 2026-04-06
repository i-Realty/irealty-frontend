import { create } from 'zustand';

// ---------------------------------------------------------------------------
// TYPES: Structured to explicitly mirror expected NestJS API Payloads
// ---------------------------------------------------------------------------
export type CalendarEventType = 'Inspection' | 'Viewing' | 'Meeting' | 'Other';

export type CalendarEvent = {
  id: string;
  type: CalendarEventType;
  clientName: string;
  dateISO: string; // "YYYY-MM-DD"
  startTime: string; // "1am"
  endTime: string; // "4 pm"
};

export type AvailabilityPayload = {
  date: string;
  time: string;
};

interface CalendarStore {
  // Config state
  events: CalendarEvent[];
  isLoadingEvents: boolean;
  isSavingAvailability: boolean;
  error: string | null;

  // UI State
  currentMonth: Date;
  selectedDate: Date; // Important for Mobile feed layout
  isAvailabilityModalOpen: boolean;

  // Actions
  fetchEventsMock: (month: Date) => Promise<void>;
  saveAvailabilityMock: (availabilities: AvailabilityPayload[]) => Promise<void>;

  setCurrentMonth: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
  setAvailabilityModalOpen: (isOpen: boolean) => void;
}

// ---------------------------------------------------------------------------
// MOCK DATA FACTORY
// ---------------------------------------------------------------------------
const generateBaseMockEvents = (baseMonth: Date): CalendarEvent[] => {
  const year = baseMonth.getFullYear();
  // We use current month strictly for logic tracking, 
  // ensuring the dummy dates map to valid integers based on the UI.
  // The mockup showed events on the 14th, 16th, and 21st.
  const month = String(baseMonth.getMonth() + 1).padStart(2, '0');
  
  return [
    {
      id: 'e1',
      type: 'Inspection',
      clientName: 'John Doe',
      dateISO: `${year}-${month}-14`,
      startTime: '1am',
      endTime: '4 pm'
    },
    {
      id: 'e2',
      type: 'Inspection',
      clientName: 'John Doe',
      dateISO: `${year}-${month}-16`,
      startTime: '1am',
      endTime: '4 pm'
    },
    {
      id: 'e3',
      type: 'Inspection',
      clientName: 'John Doe',
      dateISO: `${year}-${month}-21`,
      startTime: '1am',
      endTime: '4 pm'
    }
  ];
};

// ---------------------------------------------------------------------------
// EXPORT ZUSTAND HOOK
// ---------------------------------------------------------------------------
export const useCalendarStore = create<CalendarStore>((set, get) => ({
  events: [],
  isLoadingEvents: false,
  isSavingAvailability: false,
  error: null,

  currentMonth: new Date(),
  selectedDate: new Date(),
  isAvailabilityModalOpen: false,

  fetchEventsMock: async (month) => {
    set({ isLoadingEvents: true, error: null });
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 600));
    try {
      const activeEvents = generateBaseMockEvents(month);
      set({ events: activeEvents, isLoadingEvents: false });
    } catch (err: any) {
      set({ error: err.message, isLoadingEvents: false });
    }
  },

  saveAvailabilityMock: async (availabilities) => {
    set({ isSavingAvailability: true, error: null });
    // Simulate save duration
    await new Promise((resolve) => setTimeout(resolve, 800));
    try {
      // Upon success, mock resolving immediately and close modal
      set({ isSavingAvailability: false, isAvailabilityModalOpen: false });
    } catch (err: any) {
      set({ error: err.message, isSavingAvailability: false });
    }
  },

  setCurrentMonth: (date) => set({ currentMonth: date }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setAvailabilityModalOpen: (isOpen) => set({ isAvailabilityModalOpen: isOpen })
}));
