'use client';

import { useEffect } from 'react';
import { useCalendarStore } from '@/lib/store/useCalendarStore';
import DesktopCalendarGrid from '@/components/dashboard/agent/calendar/DesktopCalendarGrid';
import MobileCalendarView from '@/components/dashboard/agent/calendar/MobileCalendarView';
import SetupAvailabilityModal from '@/components/dashboard/agent/calendar/SetupAvailabilityModal';

export default function CalendarPage() {
  const { currentMonth, fetchEventsMock, isAvailabilityModalOpen } = useCalendarStore();

  // Load mock data dynamically whenever the current month is toggled
  useEffect(() => {
    fetchEventsMock(currentMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth]);

  return (
    <div className="w-full flex-1">
      
      {/* 
        DESKTOP LAYOUT (Hidden on Mobile)
        Features full 7x5 CSS Grid format and inline buttons
      */}
      <div className="hidden md:block w-full h-full">
        <DesktopCalendarGrid />
      </div>

      {/* 
        MOBILE LAYOUT (Hidden on Desktop)
        Features condensed selection block and scrollable daily feed format
      */}
      <div className="block md:hidden w-full h-full pb-20">
        <MobileCalendarView />
      </div>

      {/* Modal is shared and strictly toggled via Store */}
      {isAvailabilityModalOpen && <SetupAvailabilityModal />}
    </div>
  );
}
