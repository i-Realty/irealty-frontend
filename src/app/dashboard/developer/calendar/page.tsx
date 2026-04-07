'use client';

import { useEffect } from 'react';
import { useCalendarStore } from '@/lib/store/useCalendarStore';
import dynamic from 'next/dynamic';
const DesktopCalendarGrid = dynamic(() => import('@/components/dashboard/agent/calendar/DesktopCalendarGrid'), { ssr: false });
const MobileCalendarView = dynamic(() => import('@/components/dashboard/agent/calendar/MobileCalendarView'), { ssr: false });
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
