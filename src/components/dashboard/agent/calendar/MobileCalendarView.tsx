import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';
import { useCalendarStore } from '@/lib/store/useCalendarStore';

export default function MobileCalendarView() {
  const { 
    events, 
    isLoadingEvents, 
    currentMonth, 
    setCurrentMonth,
    selectedDate,
    setSelectedDate,
    setAvailabilityModalOpen 
  } = useCalendarStore();

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
  const displayMonthStr = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  // Helper date formatting
  const getSelectedDateString = () => {
     // Mockup says "September 14, 2025"
     const monthStr = monthNames[selectedDate.getMonth()];
     return `${monthStr} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
  };

  // Fake padding from previous month (S-W)
  const prefixEmptyDays = [28, 29, 30, 31];
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Filter events down to just the exactly selected date
  const isoSelected = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const selectedEvents = events.filter(e => e.dateISO === isoSelected);

  return (
    <div className="w-full flex-col p-4 bg-gray-50/20 min-h-full">
       
       {/* High Prominence CTA for Mobile */}
       <button 
         onClick={() => setAvailabilityModalOpen(true)}
         className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-[15px] py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm mb-6"
       >
          Setup Availability
          <CalIcon className="w-4 h-4" />
       </button>

       {/* Condensed Date Picker Widget */}
       <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-bold text-gray-900">{displayMonthStr}</h2>
             <div className="flex items-center gap-1">
                <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
                   <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-[13px] font-semibold text-blue-600 px-1">This month</span>
                <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
                   <ChevronRight className="w-5 h-5" />
                </button>
             </div>
          </div>

          <div className="grid grid-cols-7 gap-y-2 mb-2">
             {['S', 'S', 'M', 'T', 'W', 'T', 'F'].map((day, i) => (
                <div key={i} className="text-center text-gray-400 font-medium text-[13px] pb-2 border-b border-gray-50 mb-2">
                   {day}
                </div>
             ))}

             {prefixEmptyDays.map(val => (
                <div key={`pref-${val}`} className="h-10 flex items-center justify-center text-gray-400 font-medium text-[15px]">
                   {val}
                </div>
             ))}

             {daysInMonth.map(dayNum => {
                // Determine if this day implies an event
                const testISO = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const hasEvent = events.some(e => e.dateISO === testISO);
                const isSelected = selectedDate.getDate() === dayNum && selectedDate.getMonth() === currentMonth.getMonth();

                return (
                  <button 
                    key={`d-${dayNum}`}
                    onClick={() => {
                       const d = new Date(currentMonth);
                       d.setDate(dayNum);
                       setSelectedDate(d);
                    }}
                    className="h-10 flex flex-col items-center justify-center relative group"
                  >
                     <div className={`w-8 h-8 flex items-center justify-center rounded-full text-[15px] font-bold transition-all
                        ${isSelected ? 'bg-blue-600 text-white shadow-md' : 'text-gray-900 group-hover:bg-gray-100'}
                     `}>
                        {dayNum}
                     </div>
                     {hasEvent && !isSelected && (
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full absolute bottom-0.5"></div>
                     )}
                     {hasEvent && isSelected && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full absolute bottom-1.5 shadow-sm"></div>
                     )}
                  </button>
                )
             })}
          </div>
       </div>

       {/* Daily Event Feed Section */}
       <div className="px-1">
          <h3 className="text-[16px] font-bold text-gray-900 mb-4 tracking-tight">
             {getSelectedDateString()}
          </h3>

          <div className="flex flex-col gap-3 relative min-h-[150px]">
             {isLoadingEvents && (
               <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-[1px] z-10 flex pt-8 justify-center">
                  <div className="w-6 h-6 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
               </div>
             )}

             {selectedEvents.length === 0 && !isLoadingEvents ? (
                <div className="w-full p-8 text-center text-gray-400 text-sm font-medium bg-white rounded-2xl shadow-sm border border-gray-50">
                  No property inspections scheduled for this date.
                </div>
             ) : (
                selectedEvents.map(evt => (
                   <div key={evt.id} className="w-full bg-[#EDF3FF] border border-[#E5ECFF] rounded-xl p-4 flex flex-col hover:shadow-sm transition-shadow">
                      <h4 className="font-bold text-gray-900 text-[15px] mb-1 leading-tight tracking-tight">
                         {evt.type} From {evt.startTime} - {evt.endTime}
                      </h4>
                      <p className="text-[13px] text-gray-400 font-medium">
                         With {evt.clientName}
                      </p>
                   </div>
                ))
             )}
          </div>
       </div>

    </div>
  );
}
