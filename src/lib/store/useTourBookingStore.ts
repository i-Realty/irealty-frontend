/**
 * useTourBookingStore — Tour booking lifecycle store.
 *
 * Connects Seeker → Agent/Landlord booking flow end-to-end:
 *   1. Seeker selects slot in BookTourModal → stageDraft()
 *   2. Payment confirmed → createFromDraft()
 *   3. Agent confirms/cancels → confirmBooking() / cancelBooking()
 *   4. Tour completed → completeBooking()
 *
 * Also adds events to the calendar store and entries to the transaction ledger.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useNotificationStore } from './useNotificationStore';
import { useCalendarStore } from './useCalendarStore';
import { useTransactionLedger } from './useTransactionLedger';
import { calculateFees } from '@/lib/utils/calculateFees';

export type TourType = 'in-person' | 'video';
export type TourBookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface TourBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyLocation: string;

  seekerId: string;
  seekerName: string;
  seekerAvatar?: string;

  agentId: string;
  agentName: string;
  agentAvatar?: string;

  date: string;        // ISO date string
  timeLabel: string;   // "11:00 AM - 1:00 PM"
  type: TourType;

  status: TourBookingStatus;
  cancellationReason?: string;

  inspectionFee: number;
  platformFee: number;
  netAmount: number;

  transactionId?: string; // link to ledger entry once payment made
  createdAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  completedAt?: string;
}

export interface TourBookingDraft {
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyLocation: string;
  agentId: string;
  agentName: string;
  slot: string;         // full slot string "Sun, Jul 2 — 11:00 AM - 1:00 PM"
  type: TourType;
  inspectionFee: number;
}

interface TourBookingStore {
  bookings: TourBooking[];
  draft: TourBookingDraft | null;
  isLoading: boolean;
  error: string | null;

  // Draft management (persists slot selection across modal navigation)
  stageDraft: (draft: TourBookingDraft) => void;
  clearDraft: () => void;

  // Booking lifecycle
  createFromDraft: (seekerId: string, seekerName: string, seekerAvatar?: string) => TourBooking | null;
  confirmBooking: (bookingId: string) => void;
  cancelBooking: (bookingId: string, reason?: string) => void;
  completeBooking: (bookingId: string) => void;

  // Selectors
  getBySeeker: (seekerId: string) => TourBooking[];
  getByAgent: (agentId: string) => TourBooking[];
  getByProperty: (propertyId: string) => TourBooking[];
  getById: (id: string) => TourBooking | undefined;
  getPendingForAgent: (agentId: string) => TourBooking[];
}

function parseDateFromSlot(slot: string): string {
  // slot format: "Sun, Jul 2 — 11:00 AM - 1:00 PM"
  try {
    const datePart = slot.split('—')[0].trim(); // "Sun, Jul 2"
    const parts = datePart.split(', ')[1]?.trim().split(' '); // ["Jul", "2"]
    if (!parts || parts.length < 2) return new Date().toISOString().split('T')[0];
    const monthMap: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const month = monthMap[parts[0]];
    const day = parseInt(parts[1]);
    const year = new Date().getFullYear();
    return new Date(year, month, day).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

function parseTimeFromSlot(slot: string): string {
  try {
    return slot.split('—')[1]?.trim() ?? '';
  } catch {
    return '';
  }
}

export const useTourBookingStore = create<TourBookingStore>()(
  persist(
    (set, get) => ({
      bookings: [],
      draft: null,
      isLoading: false,
      error: null,

      stageDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: null }),

      createFromDraft: (seekerId, seekerName, seekerAvatar) => {
        const { draft } = get();
        if (!draft) return null;

        const { fee, net } = calculateFees(draft.inspectionFee, 'inspection');
        const dateISO = parseDateFromSlot(draft.slot);
        const timeLabel = parseTimeFromSlot(draft.slot);

        const booking: TourBooking = {
          id: `TOUR_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          propertyId: draft.propertyId,
          propertyTitle: draft.propertyTitle,
          propertyImage: draft.propertyImage,
          propertyLocation: draft.propertyLocation,
          seekerId,
          seekerName,
          seekerAvatar,
          agentId: draft.agentId,
          agentName: draft.agentName,
          date: dateISO,
          timeLabel,
          type: draft.type,
          status: 'pending',
          inspectionFee: draft.inspectionFee,
          platformFee: fee,
          netAmount: net,
          createdAt: new Date().toISOString(),
        };

        // Create ledger entry
        const ledgerEntry = useTransactionLedger.getState().createEntry({
          type: 'inspection',
          status: 'in_escrow',
          payerId: seekerId,
          payerName: seekerName,
          payeeId: draft.agentId,
          payeeName: draft.agentName,
          amount: draft.inspectionFee,
          platformFee: fee,
          netAmount: net,
          propertyId: draft.propertyId,
          propertyTitle: draft.propertyTitle,
          bookingId: booking.id,
        });

        booking.transactionId = ledgerEntry.id;

        // Add tour to agent calendar
        useCalendarStore.getState().addTourEvent({
          id: booking.id,
          type: 'Inspection',
          clientName: seekerName,
          dateISO: dateISO,
          startTime: timeLabel.split('-')[0]?.trim() ?? '10am',
          endTime: timeLabel.split('-')[1]?.trim() ?? '12pm',
        });

        set((s) => ({ bookings: [booking, ...s.bookings], draft: null }));

        // Notify agent
        useNotificationStore.getState().emit(
          'tour',
          'New tour booking request',
          `${seekerName} booked a ${booking.type} tour for "${draft.propertyTitle}" on ${dateISO}.`,
          '/dashboard/agent/calendar'
        );

        // Notify seeker
        useNotificationStore.getState().emit(
          'tour',
          'Tour booking submitted',
          `Your tour for "${draft.propertyTitle}" is pending confirmation from ${draft.agentName}.`,
          '/dashboard/seeker/calendar'
        );

        // Notify payment held in escrow
        useNotificationStore.getState().emit(
          'payment',
          'Inspection fee held in escrow',
          `₦${draft.inspectionFee.toLocaleString()} for "${draft.propertyTitle}" is held in escrow until tour completion.`,
          '/dashboard/seeker/wallet'
        );

        return booking;
      },

      confirmBooking: (bookingId) => {
        const booking = get().bookings.find((b) => b.id === bookingId);
        if (!booking) return;

        const now = new Date().toISOString();
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'confirmed', confirmedAt: now } : b
          ),
        }));

        useNotificationStore.getState().emit(
          'tour',
          'Tour confirmed',
          `Your tour for "${booking.propertyTitle}" on ${booking.date} has been confirmed by ${booking.agentName}.`,
          '/dashboard/seeker/calendar'
        );
      },

      cancelBooking: (bookingId, reason) => {
        const booking = get().bookings.find((b) => b.id === bookingId);
        if (!booking) return;

        const now = new Date().toISOString();
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === bookingId
              ? { ...b, status: 'cancelled', cancellationReason: reason, cancelledAt: now }
              : b
          ),
        }));

        // Refund inspection fee
        if (booking.transactionId) {
          useTransactionLedger.getState().refundEntry(booking.transactionId);
        }

        useNotificationStore.getState().emit(
          'tour',
          'Tour cancelled',
          `Tour for "${booking.propertyTitle}" was cancelled${reason ? `: ${reason}` : ''}. Inspection fee refunded.`,
          '/dashboard/seeker/wallet'
        );
      },

      completeBooking: (bookingId) => {
        const booking = get().bookings.find((b) => b.id === bookingId);
        if (!booking) return;

        const now = new Date().toISOString();
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'completed', completedAt: now } : b
          ),
        }));

        // Release escrow to agent
        if (booking.transactionId) {
          useTransactionLedger.getState().releaseEscrow(booking.transactionId);
        }

        useNotificationStore.getState().emit(
          'tour',
          'Tour completed',
          `Tour for "${booking.propertyTitle}" has been marked as completed.`,
          '/dashboard/seeker/transactions'
        );
      },

      getBySeeker: (seekerId) =>
        get().bookings.filter((b) => b.seekerId === seekerId),

      getByAgent: (agentId) =>
        get().bookings.filter((b) => b.agentId === agentId),

      getByProperty: (propertyId) =>
        get().bookings.filter((b) => b.propertyId === propertyId),

      getById: (id) =>
        get().bookings.find((b) => b.id === id),

      getPendingForAgent: (agentId) =>
        get().bookings.filter((b) => b.agentId === agentId && b.status === 'pending'),
    }),
    {
      name: 'irealty-tour-bookings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
