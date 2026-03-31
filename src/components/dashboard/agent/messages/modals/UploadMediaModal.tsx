import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Smile, Play, Video } from 'lucide-react';
import { useMessagesStore } from '@/lib/store/useMessagesStore';

export default function UploadMediaModal() {
  const { clearUploadState, sendMessageMock, activeChatId, stagedFiles, setStagedFiles } = useMessagesStore();
  const [caption, setCaption] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Mock initial state if none exists yet
  const mockMediaFiles = stagedFiles.length > 0 ? stagedFiles : [
    { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80', name: 'front_view.jpg', sizeMb: 2.1, format: 'jpg' },
    { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80', name: 'pool_view.jpg', sizeMb: 1.8, format: 'jpg' },
    { url: 'https://images.unsplash.com/photo-1600607687920-4e2a09be15f1?auto=format&fit=crop&q=80', name: 'interior.jpg', sizeMb: 2.5, format: 'jpg' },
    { url: '/videos/house_tour.mp4', name: 'house_tour.mp4', sizeMb: 12.4, format: 'mp4', isVideo: true }
  ];

  /* Ensure we have set the files up in state if not done yet */
  useEffect(() => {
    if (stagedFiles.length === 0) {
      setStagedFiles(mockMediaFiles as any);
    }
  }, [stagedFiles.length, setStagedFiles]); // Ignore mockMediaFiles for stable dependency

  const handleSend = () => {
    if (!activeChatId) return;
    const isVideo = mockMediaFiles[selectedIdx]?.isVideo;
    const type = isVideo ? 'video' : 'image_grid';
    sendMessageMock(activeChatId, caption, type, mockMediaFiles as any);
  };

  const selectedFile = mockMediaFiles[selectedIdx];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-0 md:p-6 transition-all duration-200 fade-in">
      <div className="bg-white w-full h-full md:max-w-4xl md:h-[80vh] md:rounded-2xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:px-6 border-b border-gray-100 flex-shrink-0 z-10 w-full bg-white relative">
          <h2 className="text-xl font-bold text-gray-900">Upload</h2>
          <button 
             onClick={clearUploadState}
             className="p-2 -mr-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
             <X className="w-6 h-6" />
          </button>
        </div>

        {/* Dynamic Main Preview Area */}
        <div className="flex-1 bg-gray-50/50 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
            
            <div className={`relative w-full max-w-2xl bg-gray-900 rounded-xl overflow-hidden shadow-sm aspect-video ${selectedFile?.isVideo ? 'aspect-video' : 'h-[300px] md:h-full md:aspect-auto'}`}>
               {!selectedFile?.isVideo ? (
                 <Image 
                   src={selectedFile?.url || ''} 
                   alt={selectedFile?.name || 'Preview'} 
                   fill 
                   className="object-cover md:object-contain object-center"
                 />
               ) : (
                 <div className="w-full h-full flex flex-col">
                    <div className="relative w-full h-full bg-black/20 z-0">
                      <Image 
                         src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80" // Fake video thumbnail 
                         alt="Thumbnail" 
                         fill 
                         className="object-cover opacity-80"
                      />
                    </div>
                    {/* Simulated OS-like Video UI Player Scrubber */}
                    <div className="absolute top-4 left-4 right-4 bg-gray-900/60 backdrop-blur-md rounded-xl px-4 py-2 1 z-20 flex items-center gap-3">
                       <Play className="w-4 h-4 text-white fill-white" />
                       <span className="text-white text-xs font-medium">0:40</span>
                       <div className="flex-1 h-[3px] bg-white/30 rounded-full relative">
                         <div className="absolute top-0 left-0 h-full w-[65%] bg-white rounded-full"></div>
                         <div className="absolute top-1/2 -translate-y-1/2 left-[65%] w-1.5 h-3 bg-white rounded-sm shadow-sm"></div>
                       </div>
                       <span className="text-white text-xs font-medium">0:32</span>
                    </div>
                 </div>
               )}

               {/* Inner Input Caption overlaying the photo bottom */}
               <div className="absolute bottom-4 left-4 right-4 md:hidden">
                 <div className="bg-black/40 backdrop-blur-md rounded-full px-4 py-2 mt-4 flex items-center gap-2 border border-white/10 shadow-lg">
                    <Plus className="w-5 h-5 text-gray-300" />
                    <div className="w-px h-5 bg-white/20 mx-1"></div>
                    <input 
                      type="text" 
                      className="flex-1 bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-0 text-sm py-1 min-w-0" 
                      placeholder=""
                      value={caption}
                      onChange={e => setCaption(e.target.value)}
                    />
                    <Smile className="w-5 h-5 text-gray-300" />
                 </div>
               </div>
            </div>

            {/* Thumbnail Row */}
            <div className="absolute bottom-20 md:bottom-8 left-0 w-full flex justify-center z-30">
               <div className="flex items-center gap-2 px-6 py-3 overflow-x-auto no-scrollbar max-w-full">
                  {mockMediaFiles.map((file, idx) => {
                     const isSelected = selectedIdx === idx;
                     return (
                        <button 
                           key={idx} 
                           onClick={() => setSelectedIdx(idx)}
                           className={`relative w-12 h-12 flex-shrink-0 rounded-[10px] overflow-hidden transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1 scale-110 shadow-md z-10' : 'opacity-80 hover:opacity-100 hover:scale-105'}`}
                        >
                           <Image 
                             src={file.isVideo ? 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80' : file.url} 
                             alt={file.name} 
                             fill 
                             className="object-cover"
                           />
                           {file.isVideo && (
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                 <Video className="w-4 h-4 text-white" />
                              </div>
                           )}
                           {isSelected && <div className="absolute inset-0 bg-blue-500/10 pointer-events-none"></div>}
                        </button>
                     )
                  })}
               </div>
            </div>
            
            {/* Desktop Caption Input overlaying but anchored */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[600px] hidden md:block px-4">
                 <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl px-4 py-2.5 flex items-center gap-2 border border-white/10 shadow-lg">
                    <Plus className="w-5 h-5 text-gray-300" />
                    <div className="w-px h-5 bg-white/20 mx-2"></div>
                    <input 
                      type="text" 
                      className="flex-1 bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-0 text-[15px] py-1 min-w-0" 
                      placeholder=""
                      value={caption}
                      onChange={e => setCaption(e.target.value)}
                    />
                    <Smile className="w-5 h-5 text-gray-300" />
                 </div>
            </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 md:px-6 bg-gray-50 md:bg-white border-t border-gray-100 flex justify-end z-20">
            <button 
              onClick={handleSend}
              className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm"
            >
              Send Message
            </button>
        </div>

      </div>
    </div>
  );
}
