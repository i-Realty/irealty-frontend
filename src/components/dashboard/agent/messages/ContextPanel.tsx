import Image from 'next/image';
import { useMessagesStore } from '@/lib/store/useMessagesStore';

export default function ContextPanel() {
  const { activeChatId, threads, isMobileContextOpen, toggleMobileContext } = useMessagesStore();

  const conversation = threads.find(t => t.id === activeChatId);

  if (!conversation || !conversation.propertyContext) return null;

  const prop = conversation.propertyContext;

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Mobile Header for Context Panel (Only visible when toggled on mobile) */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
         <h2 className="font-semibold text-gray-900">Details</h2>
         <button 
           onClick={() => toggleMobileContext(false)}
           className="p-2 -mr-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
         >
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
         </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col items-center border border-gray-100/50 m-4 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] bg-white">
        <h3 className="text-[13px] font-medium text-gray-400 mb-6 w-full text-center">Conversation about</h3>
        
        <div className="w-[120px] h-[120px] rounded-2xl overflow-hidden mb-6 relative shadow-md">
           <Image 
             src={prop.image}
             alt={prop.title}
             fill
             className="object-cover"
           />
        </div>

        <h4 className="font-bold text-gray-900 text-base text-center w-full px-2 mb-2 line-clamp-2">
          {prop.title}
        </h4>
        
        <p className="text-gray-500 text-sm font-medium">
          {prop.priceFormatted}
        </p>
      </div>
    </div>
  );
}
