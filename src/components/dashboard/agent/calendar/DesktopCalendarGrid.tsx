import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';
import { useCalendarStore } from '@/lib/store/useCalendarStore';

export default function DesktopCalendarGrid() {
  const { 
    events, 
    isLoadingEvents, 
    currentMonth, 
    setCurrentMonth, 
    setAvailabilityModalOpen 
  } = useCalendarStore();

  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  // Simple Month Navigation
  const prevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };
  
  const nextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  // Grid Setup (Simulated 35 cell mock grid roughly for the displayed mockup month)
  // Mockup shows month starting on a Friday, ending on a Sunday. 
  // For precise native JS iteration of a custom month, we will just simulate the exact days in the provided August Mockup.
  const daysInMockMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const prefixEmptyDays = [28, 29, 30, 31]; // Fake padding from previous month (MON-THU)

  return (
    <div className="w-full h-full bg-white flex flex-col pt-2">
      
      {/* Header Area */}
      <div className="flex items-center justify-between mb-8 px-8">
         <div className="flex items-center gap-4">
            <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
               <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-[15px] font-semibold text-blue-600 min-w-[80px] text-center">
              {/* Force "This month" text per mockup instead of dynamic Name string unless needed */}
              This month
            </h2>
            <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
               <ChevronRight className="w-5 h-5" />
            </button>
         </div>

         <button 
           onClick={() => setAvailabilityModalOpen(true)}
           className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
         >
            Setup Availability
            <CalIcon className="w-4 h-4" />
         </button>
      </div>

      {/* Main Responsive Grid Container */}
      <div className="flex-1 w-full border border-gray-100 shadow-sm rounded-xl overflow-hidden bg-white mx-0 sm:mx-8 sm:w-auto mb-10 flex flex-col">
          
          {/* Header Row */}
          <div className="grid grid-cols-7 border-b border-gray-100 bg-white">
             {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                <div key={day} className="py-4 text-center font-bold text-gray-900 text-xs tracking-wider">
                   {day}
                </div>
             ))}
          </div>

          {/* Grid Body */}
          <div className="flex-1 grid grid-cols-7 grid-rows-5 auto-rows-fr relative">
             {isLoadingEvents && (
               <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
               </div>
             )}

             {/* Prefix Padding blanks */}
             {prefixEmptyDays.map((val) => (
                <div key={`pref-${val}`} className="border-r border-b border-gray-50 min-h-[110px] p-3 text-right">
                   <span className="text-sm font-medium text-gray-400">{val}</span>
                </div>
             ))}

             {/* Real Month Days */}
             {daysInMockMonth.map((dayNum) => {
                // Find matching mock events based strictly on ISO Date match format YYYY-MM-DD
                const currentDateISO = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const dailyEvents = events.filter(e => e.dateISO === currentDateISO);

                // Styling logic matching the mockup logic: 
                // Light blue borders or backgrounds occur on the 16th and 21st in the mockup
                // The mock data generateBaseMockEvents handles day 14, 16, 21.

                return (
                   <div 
                     key={`day-${dayNum}`} 
                     className={`border-r border-b border-gray-50 min-h-[100px] lg:min-h-[130px] p-2 flex flex-col relative
                     ${dailyEvents.length > 0 && dayNum === 16 ? 'bg-blue-50/50' : ''}
                     ${dailyEvents.length > 0 && dayNum === 21 ? 'bg-blue-50/50' : ''}`}
                   >
                       {/* Date Label */}
                       <div className="w-full flex justify-end mb-1">
                          <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold
                            ${dayNum === 16 || dayNum === 21 ? 'bg-blue-600 text-white' : 'text-blue-600'}`}>
                              {dayNum === 1 || dayNum === 2 || dayNum === 3 ? `Aug ${dayNum}` : dayNum}
                          </div>
                       </div>

                       {/* Event Render Container */}
                       <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
                          {dailyEvents.map(evt => (
                             <div 
                               key={evt.id}
                               onMouseEnter={() => setHoveredEventId(evt.id)}
                               onMouseLeave={() => setHoveredEventId(null)}
                               className="relative group"
                             >
                                {/* Event Chip Body */}
                                <div className="bg-[#D3E0FF] rounded-md px-2 py-1.5 cursor-pointer hover:bg-[#c2d3fa] transition-colors relative z-10 w-[160%] md:w-[130%] lg:w-full">
                                    <p className="text-[11px] lg:text-xs font-semibold text-gray-900 leading-tight">
                                       {evt.type} • {evt.startTime} - {evt.endTime}
                                    </p>
                                </div>
                                
                                {/* Absolute Tooltip Popover */}
                                {hoveredEventId === evt.id && (
                                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50">
                                      <div className="bg-[#111827] text-white text-[11px] font-semibold tracking-wide rounded-[20px] px-3.5 py-1.5 whitespace-nowrap shadow-xl">
                                         With {evt.clientName}
                                      </div>
                                      <div className="w-3 h-3 bg-[#111827] absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45 rounded-sm"></div>
                                   </div>
                                )}
                             </div>
                          ))}
                       </div>
                   </div>
                );
             })}

             {/* Suffix Padding blanks */}
             <div className="border-b border-gray-50 min-h-[110px] p-3 text-right">
                 <span className="text-sm font-medium text-gray-400">1</span>
             </div>
          </div>
      </div>
    </div>
  );
}
