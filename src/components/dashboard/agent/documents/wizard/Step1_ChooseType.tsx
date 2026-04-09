'use client';

import { useRef, useState } from 'react';
import { useDocumentsStore } from '@/lib/store/useDocumentsStore';
import { UploadCloud, FileText, ChevronDown, Check } from 'lucide-react';

export default function Step1_ChooseType() {
  const { templateType, setTemplateType, setWizardStep } = useDocumentsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      alert('Unsupported file type. Please upload PDF, JPG, PNG, or DOC.');
      return;
    }
    setStagedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleProceed = () => {
    if (templateType) {
       setWizardStep(2);
    }
  };

  return (
    <div className="flex flex-col p-6 md:p-8 w-full animate-in slide-in-from-right-4 fade-in duration-300">
       
       {/* Manual Upload Section */}
       <div className="flex flex-col mb-8">
           <h3 className="text-[16px] font-bold text-gray-900 mb-1">Upload Manually</h3>
           <p className="text-[13px] font-medium text-gray-400 mb-6">Upload your own property documents directly. Supported formats: PDF, JPG, PNG, DOC</p>

           <input
             ref={fileInputRef}
             type="file"
             accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
             className="hidden"
             onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
           />
           <div
             onClick={() => fileInputRef.current?.click()}
             onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
             onDragLeave={() => setIsDragging(false)}
             onDrop={handleDrop}
             className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors shadow-sm cursor-pointer group ${
               isDragging ? 'border-blue-500 bg-blue-50/50' : stagedFile ? 'border-green-400 bg-green-50/30' : 'border-gray-200 hover:border-blue-400 bg-gray-50/30'
             }`}
           >
             <div className={`w-12 h-12 rounded-full shadow-sm border flex items-center justify-center mb-3 transition-colors ${
               stagedFile ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100 group-hover:bg-blue-50'
             }`}>
               {stagedFile
                 ? <Check className="w-5 h-5 text-green-500" />
                 : <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />}
             </div>
             {stagedFile ? (
               <p className="text-[14px] font-medium text-green-700">
                 {stagedFile.name} <span className="text-green-500">({(stagedFile.size / 1024).toFixed(0)} KB)</span>
               </p>
             ) : (
               <p className="text-[14px] font-medium text-gray-900">
                 Drop your documents here, or <span className="text-blue-600 font-semibold">click to upload</span>
               </p>
             )}
             <p className="text-[12px] text-gray-400 mt-1">PDF, JPG, PNG, DOC supported</p>
           </div>

           <div className="mt-5 w-full flex flex-col">
              <label className="text-[13px] font-medium text-gray-900 mb-2">Property Reference</label>
              <div className="relative">
                 <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] text-gray-400 appearance-none focus:outline-none focus:border-blue-500 shadow-sm font-medium">
                    <option value="">Select</option>
                    <option value="lekki">3-Bed Duplex, Lekki</option>
                 </select>
                 <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                 </div>
              </div>
           </div>
       </div>

       {/* OR Divider */}
       <div className="flex items-center w-full my-4">
           <div className="flex-1 h-px bg-gray-100"></div>
           <span className="px-4 text-[13px] font-bold text-gray-300 tracking-wider">OR</span>
           <div className="flex-1 h-px bg-gray-100"></div>
       </div>

       {/* Template Selection Section */}
       <div className="flex flex-col mt-4">
           <h3 className="text-[16px] font-bold text-gray-900 mb-1">Choose a Template</h3>
           <p className="text-[13px] font-medium text-gray-400 mb-6">Select a pre-designed template for your Legal Contract. These templates are legally compliant and industry-tested.</p>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               
               <button 
                  onClick={() => setTemplateType('Standard Rental Agreement')}
                  className={`flex flex-col p-6 rounded-2xl border transition-all text-left shadow-[inset_0_2px_10px_rgba(0,0,0,0.01)] ${
                     templateType === 'Standard Rental Agreement' 
                     ? 'border-blue-500 bg-blue-50/20' 
                     : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/30'
                  }`}
               >
                   <div className="w-10 h-10 rounded-lg bg-blue-50/80 border border-blue-100 flex items-center justify-center mb-4">
                      <FileText className="w-5 h-5 text-blue-600" />
                   </div>
                   <span className="text-[15px] font-bold text-gray-900 tracking-tight leading-none mb-2">Standard Rental Agreement</span>
                   <span className="text-[12px] font-medium text-gray-400">Most popular • Updated for 2024</span>
               </button>

               <button 
                  onClick={() => setTemplateType('Property Sale Agreement')}
                  className={`flex flex-col p-6 rounded-2xl border transition-all text-left shadow-[inset_0_2px_10px_rgba(0,0,0,0.01)] ${
                     templateType === 'Property Sale Agreement' 
                     ? 'border-blue-500 bg-blue-50/20' 
                     : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/30'
                  }`}
               >
                   <div className="w-10 h-10 rounded-lg bg-blue-50/80 border border-blue-100 flex items-center justify-center mb-4">
                      <FileText className="w-5 h-5 text-blue-600" />
                   </div>
                   <span className="text-[15px] font-bold text-gray-900 tracking-tight leading-none mb-2">Property Sale Agreement</span>
                   <span className="text-[12px] font-medium text-gray-400">Professional • Comprehensive</span>
               </button>

           </div>
       </div>

       <div className="w-full flex justify-end mt-10">
           <button 
             onClick={handleProceed}
             disabled={!templateType}
             className="w-full md:w-auto min-w-[140px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium text-[15px] py-3.5 md:py-3 px-8 rounded-xl md:rounded-lg transition-colors shadow-sm"
           >
              Proceed
           </button>
       </div>

    </div>
  );
}
