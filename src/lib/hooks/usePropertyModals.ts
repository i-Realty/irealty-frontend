"use client";

import { useSearchParams } from 'next/navigation';

/**
 * Derives all property-detail modal visibility states from URL query parameters.
 * This enables browser Back to close modals naturally.
 *
 * Usage:
 *   const modals = usePropertyModals();
 *   {modals.showBookTour && <BookTourModal onClose={() => router.back()} />}
 */
export function usePropertyModals() {
  const searchParams = useSearchParams();

  return {
    showBookTour:       Boolean(searchParams?.get('bookTour')),
    showPayment:        Boolean(searchParams?.get('bookTourPayment')),
    showSuccess:        Boolean(searchParams?.get('bookTourSuccess')),
    showMap:            Boolean(searchParams?.get('viewMap')),
    showReserve:        Boolean(searchParams?.get('reserve')),
    showReservePayment: Boolean(searchParams?.get('reservePayment')),
    showReserveSuccess: Boolean(searchParams?.get('reserveSuccess')),
    showChat:           Boolean(searchParams?.get('chat')),

    /** True when any modal is open — used to blur the background content */
    get anyOpen() {
      return this.showBookTour || this.showPayment || this.showSuccess ||
             this.showMap || this.showReserve || this.showReservePayment ||
             this.showReserveSuccess || this.showChat;
    },
  };
}
