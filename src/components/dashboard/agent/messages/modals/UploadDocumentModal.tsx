import { useState } from 'react';
import { X, Search, FileText, Plus, Smile } from 'lucide-react';
import { useMessagesStore } from '@/lib/store/useMessagesStore';

export default function UploadDocumentModal() {
  const { 
    clearUploadState, 
    sendMessageMock, 
    activeChatId, 
    uploadModalState, 
    setUploadModalState,
    stagedFiles,
    setStagedFiles
  } = useMessagesStore();
  
  const [caption, setCaption] = useState('');
  const [searchDoc, setSearchDoc] = useState('');

  // 1. LIST VIEW COMPONENT
  if (uploadModalState === 'document_list') {
    const mockDocuments = [
      { id: '1', name: 'Rental Agreement Template', desc: 'Standard rental contract', date: 'Updated Yesterday', sizeMb: 1.8, format: 'pdf', pages: 2 },
      { id: '2', name: 'Rental Agreement Template', desc: 'Standard rental contract', date: 'Updated Yesterday', sizeMb: 1.8, format: 'pdf', pages: 2 },
      { id: '3', name: 'Rental Agreement Template', desc: 'Standard rental contract', date: 'Updated Yesterday', sizeMb: 1.8, format: 'pdf', pages: 2 },
      { id: '4', name: 'Rental Agreement Template', desc: 'Standard rental contract', date: 'Updated Yesterday', sizeMb: 1.8, format: 'pdf', pages: 2 }
    ];

    const filteredDocs = mockDocuments.filter(doc => doc.name.toLowerCase().includes(searchDoc.toLowerCase()));

    const handleSelectDoc = (doc: any) => {
      setStagedFiles([{ name: doc.name, url: 'file://mock', sizeMb: doc.sizeMb, format: doc.format, pages: doc.pages }]);
      setUploadModalState('document_preview');
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-0 md:p-6 transition-all duration-200">
        <div className="bg-white w-full h-full md:max-w-2xl md:h-[85vh] md:rounded-2xl shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-4 md:px-6 border-b border-gray-100 flex-shrink-0 z-10 w-full bg-white relative">
            <h2 className="text-xl font-bold text-gray-900">Upload</h2>
            <button onClick={clearUploadState} className="p-2 -mr-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
               <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/30">
             <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search Documents" 
                  value={searchDoc}
                  onChange={(e) => setSearchDoc(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-gray-800"
                />
             </div>

             <div className="space-y-3 pb-8">
               {filteredDocs.map((doc, idx) => (
                 <button 
                   key={idx}
                   onClick={() => handleSelectDoc(doc)}
                   className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all text-left"
                 >
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100">
                      <FileText className="w-6 h-6 text-gray-800 stroke-[1.5]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm md:text-base">{doc.name}</h4>
                      <p className="text-[13px] text-blue-400 font-medium mb-0.5">{doc.desc}</p>
                      <p className="text-[12px] text-gray-400">{doc.date} • {doc.sizeMb} MB</p>
                    </div>
                 </button>
               ))}
             </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. PREVIEW DOCUMENT VIEW COMPONENT
  if (uploadModalState === 'document_preview' && stagedFiles.length > 0) {
    const doc = stagedFiles[0];

    const handleSend = () => {
      if (!activeChatId) return;
      sendMessageMock(activeChatId, caption, 'document', stagedFiles);
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-0 md:p-6 transition-all duration-200">
        <div className="bg-[#F8F9FB] w-full h-full md:max-w-4xl md:h-[80vh] md:rounded-2xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
          
          <div className="flex items-center justify-between p-4 md:px-6 border-b border-gray-100 bg-white z-10 w-full relative">
            <h2 className="text-xl font-bold text-gray-900">Upload</h2>
            <button onClick={clearUploadState} className="p-2 -mr-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
               <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
             <div className="bg-white/50 w-full h-full max-w-2xl max-h-[400px] rounded-3xl flex flex-col items-center justify-center border border-gray-200 shadow-sm relative">
                
                <div className="w-20 h-20 mb-4 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center">
                   <FileText className="w-10 h-10 text-gray-800 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{doc.name}</h3>
                <p className="text-sm font-medium text-gray-400 capitalize mt-1">
                  {doc.pages ? `${doc.pages} pages • ` : ''}{doc.sizeMb}mb • {doc.format}
                </p>

                {/* Caption Bar Overlaying */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[90%] md:max-w-[80%]">
                   <div className="bg-black/60 backdrop-blur-md rounded-full px-4 py-2 mt-4 flex items-center gap-2 border border-white/10 shadow-lg relative z-20">
                      <Plus className="w-5 h-5 text-gray-300 pointer-events-none" />
                      <div className="w-px h-5 bg-white/20 mx-1"></div>
                      <input 
                        type="text" 
                        className="flex-1 bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-0 text-[15px] py-1 min-w-0" 
                        placeholder=""
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                      />
                      <Smile className="w-5 h-5 text-gray-300 pointer-events-none" />
                   </div>
                </div>
             </div>
          </div>

          <div className="p-4 md:px-6 bg-white border-t border-gray-100 flex justify-end z-20">
              <button onClick={handleSend} className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm">
                Send Message
              </button>
          </div>

        </div>
      </div>
    );
  }

  return null;
}
