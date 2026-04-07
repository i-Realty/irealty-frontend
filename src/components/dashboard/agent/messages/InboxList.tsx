import { Search } from 'lucide-react';
import Image from 'next/image';
import { useMessagesStore } from '@/lib/store/useMessagesStore';

export default function InboxList({ isLoading }: { isLoading?: boolean }) {
  const { 
    threads, 
    activeChatId, 
    setActiveChatId, 
    searchQuery, 
    setSearchQuery 
  } = useMessagesStore();

  const filteredThreads = threads.filter(thread => 
    thread.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      
      {/* Search Bar Header */}
      <div className="p-4 border-b border-gray-100 flex-none">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search chat" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-gray-800"
          />
        </div>
      </div>

      {/* Threads List */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-4 divide-y divide-gray-50">
        {isLoading ? (
           <div className="divide-y divide-gray-50">
             {Array.from({ length: 5 }).map((_, i) => (
               <div key={i} className="animate-pulse flex items-start gap-4 p-4">
                 <div className="bg-gray-200 rounded-full h-12 w-12 flex-shrink-0" />
                 <div className="flex-1 space-y-2 pt-1">
                   <div className="bg-gray-200 rounded h-4 w-1/3" />
                   <div className="bg-gray-200 rounded h-3 w-2/3" />
                 </div>
               </div>
             ))}
           </div>
        ) : filteredThreads.length === 0 ? (
           <div className="p-8 pb-0 text-center text-sm text-gray-500">
             No chats found
           </div>
        ) : (
          filteredThreads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => setActiveChatId(thread.id)}
              className={`w-full p-4 flex items-start gap-4 transition-colors hover:bg-gray-50 text-left cursor-pointer
                ${activeChatId === thread.id ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden border border-gray-50 relative">
                   {thread.participant.avatar ? (
                     <Image 
                        src={thread.participant.avatar} 
                        alt={thread.participant.name} 
                        fill 
                        sizes="(max-width: 48px)"
                        className="object-cover"
                     />
                   ) : (
                     <div className="w-full h-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                       {thread.participant.name.charAt(0)}
                     </div>
                   )}
                </div>
                {/* Active/Online indicator (Mocked) */}
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-10"></div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className={`font-semibold text-[15px] truncate 
                    ${activeChatId === thread.id ? 'text-blue-700' : 'text-gray-900'}`}
                  >
                    {thread.participant.name}
                  </h3>
                  <span className={`text-xs ml-2 flex-shrink-0 
                    ${thread.unreadCount > 0 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}
                  >
                    {thread.lastMessageTime}
                  </span>
                </div>
                
                <p className={`text-sm truncate 
                  ${thread.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}
                  ${activeChatId === thread.id && thread.unreadCount === 0 ? 'text-blue-600/80' : ''}`}
                >
                  {thread.lastMessage}
                </p>
              </div>

              {/* Unread Badge */}
              {thread.unreadCount > 0 && (
                <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-[11px] font-bold rounded-full mt-6 shadow-sm">
                  {thread.unreadCount}
                </div>
              )}
            </button>
          ))
        )}
      </div>

    </div>
  );
}
