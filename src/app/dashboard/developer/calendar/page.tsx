'use client';

import { useEffect } from 'react';
import { useCalendarStore } from '@/lib/store/useCalendarStore';
import DesktopCalendarGrid from '@/components/dashboard/agent/calendar/DesktopCalendarGrid';
import MobileCalendarView from '@/components/dashboard/agent/calendar/MobileCalendarView';
import SetupAvailabilityModal from '@/components/dashboard/agent/calendar/SetupAvailabilityModal';

export default function DeveloperCalendarPage() {
  const { currentMonth, fetchEventsMock, isAvailabilityModalOpen } = useCalendarStore();

  useEffect(() => {
    fetchEventsMock(currentMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth]);

  return (
    <div className="w-full flex-1">
      <div className="hidden md:block w-full h-full">
        <DesktopCalendarGrid />
      </div>
      <div className="block md:hidden w-full h-full pb-20">
        <MobileCalendarView />
      </div>
      {isAvailabilityModalOpen && <SetupAvailabilityModal />}
    </div>
  );
}
