import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, Phone, AlertCircle } from 'lucide-react';
import { useMessagesStore } from '@/lib/store/useMessagesStore';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import UploadMediaModal from './modals/UploadMediaModal';
import UploadDocumentModal from './modals/UploadDocumentModal';

export default function ChatWindow() {
  const { 
    activeChatId, 
    threads, 
    setActiveChatId, 
    toggleMobileContext, 
    isMobileContextOpen,
    uploadModalState
  } = useMessagesStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find((t) => t.id === activeChatId);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages]);

  if (!activeThread) return null;

  return (
    <div className="flex flex-col h-full bg-white relative">
      
      {/* Dynamic Header */}
      <div className="flex-none px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-3">
          {/* Mobile Back Button */}
          <button 
             onClick={() => setActiveChatId(null)}
             className="md:hidden p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
             <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3 cursor-pointer select-none">
             <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-100 flex-shrink-0">
                {activeThread.participant.avatar ? (
                  <Image 
                     src={activeThread.participant.avatar} 
                     alt={activeThread.participant.name} 
                     fill 
                     className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {activeThread.participant.name.charAt(0)}
                  </div>
                )}
                <div className="absolute bottom-[2px] right-[2px] w-2.5 h-2.5 bg-green-500 rounded-full border border-white z-10"></div>
             </div>
             
             <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                   <h2 className="text-[16px] font-bold text-gray-900 leading-tight">
                     {activeThread.participant.name}
                   </h2>
                   {activeThread.participant.isVerified && (
                     <div className="bg-blue-600/10 rounded-full p-0.5">
                       <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                         <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.751-3.751 3 3 0 00-5.304 0 3 3 0 00-3.751 3.751 3 3 0 000 5.304 3 3 0 003.751 3.751 3 3 0 005.304 0 3 3 0 003.751-3.751zM11.758 7.5a.75.75 0 00-1.06 0L8 10.197l-1.197-1.197a.75.75 0 00-1.061 1.06l1.728 1.728a.75.75 0 001.06 0l3.228-3.228a.75.75 0 000-1.06z" clipRule="evenodd" />
                       </svg>
                     </div>
                   )}
                </div>
                {/* Simulated online status or small metadata */}
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 text-gray-500">
           <button
             onClick={() => {}}
             title="Call (coming soon)"
             className="p-2 hover:bg-gray-100 hover:text-blue-600 rounded-full transition-colors hidden md:flex"
           >
             <Phone className="w-5 h-5" />
           </button>

           {/* Mobile Call Icon */}
           <button
             onClick={() => {}}
             title="Call (coming soon)"
             className="p-2 -mr-1 hover:bg-gray-100 hover:text-blue-600 rounded-full transition-colors md:hidden text-blue-500"
           >
             <Phone className="w-5 h-5" />
           </button>

           {/* Mobile Toggle for Context Panel */}
           <button 
             onClick={() => toggleMobileContext(!isMobileContextOpen)}
             className={`p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:flex ${isMobileContextOpen ? 'text-gray-400 bg-gray-100' : 'text-gray-500'}`}
           >
             <AlertCircle className="w-5 h-5" />
           </button>
           <button 
             onClick={() => toggleMobileContext(!isMobileContextOpen)}
             className={`p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden ${isMobileContextOpen ? 'text-gray-400 bg-gray-100' : 'text-gray-400'}`}
           >
             <AlertCircle className="w-6 h-6" />
           </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-6 bg-white pb-20">
         <div className="w-full flex justify-center mb-6">
            <span className="text-xs text-gray-400 font-medium tracking-wide">Sun, Dec 17 (Today)</span>
         </div>
         
         <div className="flex flex-col w-full min-h-full justify-end">
           {activeThread.messages.map((msg) => (
             <MessageBubble key={msg.id} message={msg} />
           ))}
           <div ref={messagesEndRef} className="h-4" />
         </div>
      </div>

      {/* Fixed Bottom Input */}
      <div className="absolute bottom-0 w-full left-0 bg-white">
        <MessageInput />
      </div>

      {/* MODALS RENDERED HERE WHEN ACTIVE */}
      {uploadModalState === 'media' && <UploadMediaModal />}
      {(uploadModalState === 'document_list' || uploadModalState === 'document_preview') && <UploadDocumentModal />}
      
    </div>
  );
}
