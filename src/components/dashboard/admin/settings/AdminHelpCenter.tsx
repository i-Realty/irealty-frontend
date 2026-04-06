'use client';

import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { Loader2 } from 'lucide-react';

export default function AdminHelpCenter() {
  const { helpTicket, updateHelpTicket, submitHelpTicketMock, isSaving } = useSettingsStore();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitHelpTicketMock();
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in slide-in-from-right-4 fade-in duration-300">
       
       <div className="flex flex-col">
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight mb-1">Help Center</h2>
          <p className="text-[13px] font-medium text-gray-400">Send us a message if you encounter any problem</p>
       </div>

       <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-2xl md:rounded-[24px] p-6 flex flex-col shadow-sm">
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 space-y-2 md:space-y-0">
              <div className="flex flex-col gap-2">
                 <label className="text-[12px] font-bold text-gray-900 ml-1">Username</label>
                 <input 
                    type="text"
                    value={helpTicket.username}
                    readOnly
                    className="w-full border border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-500 focus:outline-none focus:border-blue-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] cursor-not-allowed"
                 />
              </div>

              <div className="flex flex-col gap-2">
                 <label className="text-[12px] font-bold text-gray-900 ml-1">Email address</label>
                 <input 
                    type="email"
                    placeholder="admin@irealty.com"
                    value={helpTicket.email}
                    onChange={(e) => updateHelpTicket({ email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
                    required
                 />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                 <label className="text-[12px] font-bold text-gray-900 ml-1">Subject</label>
                 <input 
                    type="text"
                    placeholder="Enter subject here"
                    value={helpTicket.subject}
                    onChange={(e) => updateHelpTicket({ subject: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
                    required
                 />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                 <label className="text-[12px] font-bold text-gray-900 ml-1">Description</label>
                 <textarea 
                    placeholder="Write a little description here."
                    value={helpTicket.description}
                    onChange={(e) => updateHelpTicket({ description: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-4 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300 min-h-[160px] resize-y"
                    required
                 />
              </div>
           </div>

           <div className="w-full flex justify-end mt-4">
              <button 
                type="submit"
                disabled={isSaving || !helpTicket.email || !helpTicket.subject || !helpTicket.description}
                className="w-full md:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-[14px] py-4 md:py-3.5 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                 {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Request'}
              </button>
           </div>
       </form>

    </div>
  );
}
