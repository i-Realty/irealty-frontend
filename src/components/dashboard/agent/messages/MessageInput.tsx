import { useState, useRef, useEffect } from 'react';
import { Plus, Smile, Mic, FolderOpen, Image as ImageIcon } from 'lucide-react';
import { useMessagesStore } from '@/lib/store/useMessagesStore';

export default function MessageInput() {
  const [text, setText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { activeChatId, sendMessageMock, isSendingMessage, setUploadModalState } = useMessagesStore();

  // Close attachment menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAttachMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = () => {
    if (!text.trim() || !activeChatId || isSendingMessage) return;
    
    // Fire mock API via robust store method
    sendMessageMock(activeChatId, text, 'text');
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachSelect = (type: 'media' | 'document_list') => {
    setShowAttachMenu(false);
    setUploadModalState(type);
  };

  return (
    <div className="px-4 py-3 bg-white border-t border-gray-100 flex items-center gap-3 relative pb-safe">
      
      {/* Attachment Popover Menu */}
      {showAttachMenu && (
        <div ref={menuRef} className="absolute bottom-16 left-4 bg-white border border-gray-100 shadow-xl rounded-xl py-2 w-56 z-50 animate-in fade-in slide-in-from-bottom-2">
          <button 
             onClick={() => handleAttachSelect('document_list')}
             className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
          >
             <FolderOpen className="w-5 h-5 text-gray-700" />
             <span className="text-gray-700 font-medium">Files</span>
          </button>
          <button 
             onClick={() => handleAttachSelect('media')}
             className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
          >
             <ImageIcon className="w-5 h-5 text-gray-700" />
             <span className="text-gray-700 font-medium">Photo and video</span>
          </button>
        </div>
      )}

      {/* + Button */}
      <button 
        onClick={() => setShowAttachMenu(!showAttachMenu)}
        className="p-2 flex-shrink-0 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Input Field Container */}
      <div className="flex-1 bg-[#F8FAFC] rounded-full border border-gray-200 flex items-center px-4 h-[44px]">
        <input 
          type="text" 
          placeholder="" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-[15px] text-gray-800 placeholder-gray-400 py-2 min-w-0"
          disabled={isSendingMessage}
        />
        
        <button className="p-1.5 flex-shrink-0 text-gray-500 hover:text-gray-800 rounded-full transition-colors">
          <Smile className="w-5 h-5" />
        </button>
      </div>

      {/* Mic/Send Button */}
      {text.trim().length > 0 ? (
        <button 
          onClick={handleSend}
          disabled={isSendingMessage}
          className="p-2 flex-shrink-0 bg-blue-600 text-white rounded-full transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isSendingMessage ? (
             <div className="w-6 h-6 flex items-center justify-center">
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
             </div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 -ml-0.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          )}
        </button>
      ) : (
        <button className="p-2 flex-shrink-0 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
          <Mic className="w-6 h-6" />
        </button>
      )}

    </div>
  );
}
