import { useState } from 'react';
import { useDocumentsStore, DocumentItem } from '@/lib/store/useDocumentsStore';
import { Search, Plus, Eye, Edit3, Trash2, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

export default function DocumentsList() {
  const { documents, isLoadingList, setWizardOpen, deleteDocumentMock } = useDocumentsStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = documents.filter(doc => 
     doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col animate-in slide-in-from-bottom-2 fade-in duration-300">
       
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Documents</h1>
       </div>

       <div className="bg-white border text-center border-gray-100 rounded-2xl p-4 md:p-8 min-h-[500px] flex flex-col relative w-full shadow-sm">
           
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h3 className="text-lg font-bold text-gray-900 text-left">All Documents</h3>
              <button 
                onClick={() => setWizardOpen(true)}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 md:py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm text-[14px]"
              >
                 <Plus className="w-4 h-4" /> New Document
              </button>
           </div>
           
           {/* Search Input */}
           <div className="relative w-full mb-6">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
               </div>
               <input
                 type="text"
                 placeholder="Search"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow bg-white md:bg-gray-50/30"
               />
           </div>

           {/* Loading Overlay */}
           {isLoadingList && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                 <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
           )}

           {/* Desktop Table View */}
           <div className="hidden md:block w-full overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-gray-50/50">
                       <th className="py-3 px-4 text-[12px] font-semibold text-gray-400">Document Title</th>
                       <th className="py-3 px-4 text-[12px] font-semibold text-gray-400">Date Updated</th>
                       <th className="py-3 px-4 text-[12px] font-semibold text-gray-400">Document Type</th>
                       <th className="py-3 px-4 text-[12px] font-semibold text-gray-400">Property Reference</th>
                       <th className="py-3 px-4 text-[12px] font-semibold text-gray-400">Size</th>
                       <th className="py-3 px-4 text-[12px] font-semibold text-gray-400 text-center">Actions</th>
                    </tr>
                 </thead>
                 <tbody>
                    {filteredData.map(doc => (
                       <tr key={doc.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                          <td className="py-4 px-4 text-[13px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors w-1/4">
                            {doc.title}
                          </td>
                          <td className="py-4 px-4 text-[13px] font-bold text-gray-900">{doc.dateUpdated}</td>
                          <td className="py-4 px-4 text-[13px] font-bold text-gray-900">{doc.type}</td>
                          <td className="py-4 px-4 text-[13px] font-bold text-gray-900">{doc.propertyReference}</td>
                          <td className="py-4 px-4 text-[13px] font-bold text-gray-900">{doc.size}</td>
                          <td className="py-4 px-4">
                             <div className="flex items-center justify-center gap-3">
                                 <button className="text-gray-400 hover:text-gray-900 p-1 rounded-md hover:bg-white border border-transparent hover:border-gray-200 transition-all shadow-sm">
                                    <Eye className="w-4 h-4" />
                                 </button>
                                 <button className="text-gray-400 hover:text-gray-900 p-1 rounded-md hover:bg-white border border-transparent hover:border-gray-200 transition-all shadow-sm">
                                    <Edit3 className="w-4 h-4" />
                                 </button>
                                 <button
                                   onClick={() => { if (confirm('Delete this document?')) deleteDocumentMock(doc.id); }}
                                   className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-white border border-transparent hover:border-red-100 transition-all shadow-sm">
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>

              {!isLoadingList && filteredData.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                     <FileText className="w-8 h-8 opacity-50" />
                     <p className="text-[14px]">No documents found.</p>
                  </div>
              )}
           </div>

           {/* Mobile Card Stack */}
           <div className="md:hidden flex flex-col gap-4 min-h-[300px]">
              {!isLoadingList && filteredData.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                     <FileText className="w-8 h-8 opacity-50" />
                     <p className="text-[14px]">No documents found.</p>
                  </div>
              )}

              {filteredData.map(doc => (
                 <div key={doc.id} className="w-full bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col text-left">
                     
                     <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                        <span className="text-[12px] font-medium text-[#c0c6d5] uppercase pr-4">Document Title</span>
                        <span className="text-[13px] font-bold text-gray-900 text-right leading-tight max-w-[60%]">{doc.title}</span>
                     </div>
                     <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                        <span className="text-[12px] font-medium text-[#c0c6d5] uppercase pr-4">Date Updated</span>
                        <span className="text-[13px] font-bold text-gray-900">{doc.dateUpdated}</span>
                     </div>
                     <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                        <span className="text-[12px] font-medium text-[#c0c6d5] uppercase pr-4">Document Type</span>
                        <span className="text-[13px] font-bold text-gray-900 text-right max-w-[60%]">{doc.type}</span>
                     </div>
                     <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                        <span className="text-[12px] font-medium text-[#c0c6d5] uppercase pr-4">Property Reference</span>
                        <span className="text-[13px] font-bold text-gray-900 text-right max-w-[60%]">{doc.propertyReference}</span>
                     </div>
                     <div className="flex items-center justify-between py-2.5 mb-2">
                        <span className="text-[12px] font-medium text-[#c0c6d5] uppercase pr-4">Size</span>
                        <span className="text-[13px] font-bold text-gray-900">{doc.size}</span>
                     </div>

                     <div className="w-full flex items-center justify-between pt-3 gap-2">
                         <button className="flex-1 flex justify-center items-center gap-2 py-2 text-[13px] font-medium text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100/50">
                            <Eye className="w-4 h-4" /> Preview
                         </button>
                         <button className="flex-1 flex justify-center items-center gap-2 py-2 text-[13px] font-medium text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100/50">
                            <Edit3 className="w-4 h-4" /> Edit
                         </button>
                         <button
                           onClick={() => { if (confirm('Delete this document?')) deleteDocumentMock(doc.id); }}
                           className="flex-1 flex justify-center items-center gap-2 py-2 text-[13px] font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-gray-100/50">
                            <Trash2 className="w-4 h-4" /> Delete
                         </button>
                     </div>
                 </div>
              ))}
           </div>

           {/* Mock Pagination Footer */}
           <div className="mt-8 border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 w-full text-sm font-medium text-gray-400">
               <span>Page 1 of 30</span>

               <div className="flex items-center gap-2 md:gap-3">
                   <span className="px-2 hover:text-gray-600 cursor-pointer transition-colors">1</span>
                   <span className="px-2 hover:text-gray-600 cursor-pointer transition-colors">2</span>
                   <div className="w-8 h-8 rounded border border-blue-400 text-blue-600 font-bold flex items-center justify-center bg-blue-50 shadow-sm">
                      3
                   </div>
                   <span className="px-2 hover:text-gray-600 cursor-pointer transition-colors">4</span>
                   <span className="px-2 hover:text-gray-600 cursor-pointer transition-colors">5</span>

                   <div className="flex items-center ml-2 relative z-10">
                       <button className="bg-blue-600 text-white p-1.5 rounded-l-md hover:bg-blue-700 transition-colors shadow-sm focus:outline-none">
                          <ChevronLeft className="w-5 h-5" />
                       </button>
                       <div className="w-[1px] h-8 bg-blue-700"></div>
                       <button className="bg-blue-600 text-white p-1.5 rounded-r-md hover:bg-blue-700 transition-colors shadow-sm focus:outline-none">
                          <ChevronRight className="w-5 h-5" />
                       </button>
                   </div>
               </div>
           </div>

       </div>
    </div>
  );
}
