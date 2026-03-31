import Image from 'next/image';
import { FileText, Video } from 'lucide-react';
import type { Message } from '@/lib/store/useMessagesStore';

export default function MessageBubble({ message }: { message: Message }) {
  const isMe = message.senderId === 'ME';

  // Base styling for the text bubble wrapper
  const bubbleColor = isMe 
    ? 'bg-blue-600 text-white rounded-l-2xl rounded-tr-2xl' 
    : 'bg-white border border-gray-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-gray-700 rounded-r-2xl rounded-tl-2xl';
  
  const alignContainer = isMe ? 'justify-end' : 'justify-start';

  // 1. TEXT RENDER
  if (message.contentType === 'text') {
    return (
      <div className={`flex w-full ${alignContainer} mb-6`}>
        <div className={`max-w-[75%] md:max-w-[65%] px-5 py-3.5 relative ${bubbleColor}`}>
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-[400]">
            {message.content}
          </p>
          {/* Timestamp inline */}
          <span className={`block text-[10px] mt-2 text-right ${isMe ? 'text-blue-100 font-medium' : 'text-gray-400 font-medium'}`}>
            {message.timestamp}
          </span>
        </div>
      </div>
    );
  }

  // 2. DOCUMENT RENDER
  if (message.contentType === 'document' && message.files?.[0]) {
    const file = message.files[0];
    return (
      <div className={`flex w-full ${alignContainer} mb-6`}>
        <div className={`max-w-[85%] md:max-w-[65%] p-4 bg-[#E5ECFF] rounded-2xl relative shadow-sm max-w-sm w-full`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
               <FileText className="text-gray-900 w-6 h-6 stroke-[1.5]" />
            </div>
            <div className="flex-1 min-w-0">
               <h4 className="font-bold text-gray-900 truncate text-sm">{file.name}</h4>
               <p className="text-xs text-gray-500 font-medium mt-0.5 capitalize">
                 {file.pages ? `${file.pages} pages • ` : ''}{file.sizeMb}mb • {file.format}
               </p>
            </div>
          </div>
          {message.content && (
             <p className="text-[14px] mt-4 text-gray-700 leading-relaxed font-[400] px-1">
               {message.content}
             </p>
          )}
          <span className="block text-[10px] mt-2 text-right text-gray-500 font-medium">
            {message.timestamp}
          </span>
        </div>
      </div>
    );
  }

  // 3. IMAGE_GRID / VIDEO RENDER
  if ((message.contentType === 'image_grid' || message.contentType === 'video') && message.files && message.files.length > 0) {
    const isVideo = message.contentType === 'video';
    const files = message.files;
    
    // Grid rendering logic based on file count
    let gridStyle = 'grid-cols-1';
    if (files.length === 2) gridStyle = 'grid-cols-2';
    else if (files.length > 2) gridStyle = 'grid-cols-2 grid-rows-2';

    return (
      <div className={`flex w-full ${alignContainer} mb-6`}>
        <div className={`max-w-[85%] md:max-w-[65%] p-2.5 bg-[#E5ECFF] rounded-2xl relative max-w-[280px] w-full`}>
           <div className={`grid gap-1.5 ${gridStyle} w-full aspect-square rounded-xl overflow-hidden`}>
              {files.slice(0, 4).map((file, idx) => {
                 const isLastAndMore = idx === 3 && files.length > 4;
                 return (
                   <div key={idx} className="relative w-full h-full bg-gray-200">
                      <Image 
                        src={file.url} 
                        alt={file.name} 
                        fill 
                        className={`object-cover ${isLastAndMore ? 'brightness-[0.4]' : ''}`}
                      />
                      {isVideo && idx === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <Video className="w-5 h-5 text-white" />
                           </div>
                        </div>
                      )}
                      {isLastAndMore && (
                        <div className="absolute inset-0 flex items-center justify-center">
                           <span className="text-white text-3xl font-bold tracking-tight">+{files.length - 3}</span>
                        </div>
                      )}
                   </div>
                 );
              })}
           </div>

           {message.content && (
              <p className="text-[14px] mt-3 mb-1 text-gray-700 leading-relaxed font-[400] px-2">
                {message.content}
              </p>
           )}

           <span className="block text-[10px] mt-2 mr-2 text-right text-gray-500 font-medium">
             {message.timestamp}
           </span>
        </div>
      </div>
    );
  }

  return null;
}
