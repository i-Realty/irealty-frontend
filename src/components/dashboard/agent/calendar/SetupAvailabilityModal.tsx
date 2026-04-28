import { useState } from 'react';
import { useCalendarStore } from '@/lib/store/useCalendarStore';
import { calendarAvailabilitySchema, extractErrors } from '@/lib/validations/kyc';
import { useEscapeKey } from '@/lib/hooks/useEscapeKey';

type FormRow = { id: string; date: string; time: string };

export default function SetupAvailabilityModal() {
  const { setAvailabilityModalOpen, saveAvailabilityMock, isSavingAvailability } = useCalendarStore();
  const [rows, setRows] = useState<FormRow[]>([{ id: 'r1', date: '', time: '' }]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEscapeKey(() => setAvailabilityModalOpen(false));

  const addRow = () => {
    setRows(prev => [...prev, { id: Math.random().toString(), date: '', time: '' }]);
  };

  const updateRow = (id: string, field: 'date' | 'time', val: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r));
  };

  const handleSave = async () => {
    if (isSavingAvailability) return;
    const rowErrors: Record<string, string> = {};
    rows.forEach((row, idx) => {
      const result = calendarAvailabilitySchema.safeParse({ date: row.date, time: row.time });
      if (!result.success) {
        const errs = extractErrors(result.error);
        Object.entries(errs).forEach(([key, msg]) => {
          rowErrors[`${idx}.${key}`] = msg;
        });
      }
    });
    if (Object.keys(rowErrors).length > 0) {
      setErrors(rowErrors);
      return;
    }
    setErrors({});
    await saveAvailabilityMock(rows);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col md:items-center md:justify-center bg-black/40 backdrop-blur-[2px] p-0 md:p-6 transition-all duration-200 fade-in overflow-hidden">
       
       <div className="bg-white w-full h-full md:max-w-xl md:h-auto md:max-h-[85vh] md:rounded-2xl shadow-2xl flex flex-col relative overflow-hidden animate-in slide-in-from-bottom md:zoom-in-95 duration-200">
           
           <div className="p-6 md:p-8 flex-shrink-0 z-10 w-full bg-white relative">
              <h2 className="text-[22px] font-bold text-gray-900 tracking-tight leading-tight">
                Set Up Your Availability
              </h2>
              <p className="text-[15px] font-medium text-gray-400 mt-2">
                Choose the days and times you&apos;re available for property inspections
              </p>
           </div>

           <div className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-8 pb-8 flex flex-col gap-6">
              
              {rows.map((row, idx) => (
                 <div key={row.id} className="border border-gray-200 rounded-xl p-5 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <h4 className="font-bold text-[15px] text-gray-900 mb-4">Day {idx + 1}</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="flex flex-col gap-1.5">
                          <label className="text-[14px] font-medium text-gray-900">Date</label>
                          <input
                            type="date"
                            value={row.date}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => updateRow(row.id, 'date', e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[15px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                          />
                          {errors[`${idx}.date`] && <p className="text-red-500 text-xs mt-1">{errors[`${idx}.date`]}</p>}
                       </div>

                       <div className="flex flex-col gap-1.5">
                          <label className="text-[14px] font-medium text-gray-900">Time</label>
                          <select
                            value={row.time}
                            onChange={(e) => updateRow(row.id, 'time', e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[15px] text-gray-500 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                          >
                             <option value="" disabled>Select Time</option>
                             <option value="1am - 4 pm">1am - 4 pm</option>
                             <option value="9am - 12 pm">9am - 12 pm</option>
                             <option value="2pm - 5 pm">2pm - 5 pm</option>
                          </select>
                          {errors[`${idx}.time`] && <p className="text-red-500 text-xs mt-1">{errors[`${idx}.time`]}</p>}
                       </div>
                    </div>
                 </div>
              ))}

              <button 
                onClick={addRow}
                className="text-[15px] font-semibold text-blue-500 flex items-center justify-start self-start hover:text-blue-700 transition-colors"
              >
                 + Add Another
              </button>

           </div>

           <div className="p-4 md:p-8 md:pt-4 border-t border-gray-100 flex items-center justify-between bg-white flex-shrink-0">
               {/* Mobile Cancel Button (Optional for UX since mobile might need explicit dismissal) */}
               <button 
                 onClick={() => setAvailabilityModalOpen(false)}
                 className="md:hidden font-medium text-gray-500 px-4 py-3"
               >
                  Cancel
               </button>

               <div className="flex w-full md:w-auto md:ml-auto">
                 {/* Desktop Cancel Button */}
                 <button 
                   onClick={() => setAvailabilityModalOpen(false)}
                   className="hidden md:block font-medium text-gray-500 px-6 py-2.5 hover:bg-gray-50 rounded-lg transition-colors mr-2"
                 >
                    Cancel
                 </button>

                 <button 
                   onClick={handleSave}
                   disabled={isSavingAvailability}
                   className="flex-1 md:flex-none bg-[#93B8FF] hover:bg-blue-500 text-white font-semibold flex items-center justify-center px-8 py-3.5 md:py-3 rounded-lg md:rounded-xl transition-colors min-w-[140px]"
                 >
                    {isSavingAvailability ? (
                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                       'Set Up Availability'
                    )}
                 </button>
               </div>
           </div>

       </div>
    </div>
  );
}
