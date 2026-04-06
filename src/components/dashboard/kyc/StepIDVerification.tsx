'use client';

import { useAgentDashboardStore } from '@/lib/store/useAgentDashboardStore';
import { useState, useRef } from 'react';
import { UploadCloud, File, Trash2, ChevronDown } from 'lucide-react';

export default function StepIDVerification() {
  const { setCurrentKycStep, updateKycProgress } = useAgentDashboardStore();
  
  const [idNumber, setIdNumber] = useState('');
  const [idType, setIdType] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (idNumber && idType && fileName) {
      updateKycProgress(3);
      setCurrentKycStep(4);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const removeFile = () => {
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">ID verification</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">Please provide a valid means of identification</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Identification Number</label>
        <input 
          type="text" 
          placeholder="Enter Identification Number" 
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Identification</label>
        <div className="relative">
          <select 
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
          >
            <option value="" disabled>Select Means Of Identification</option>
            <option value="International passport">International passport</option>
            <option value="Driver's license">Driver&apos;s license</option>
            <option value="Voter's card">Voter&apos;s card</option>
            <option value="NIN">NIN</option>
          </select>
          <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Upload Zone */}
      {!fileName ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm mb-3">
             <UploadCloud className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">
            Drop your documents here, or <span className="text-blue-600 font-medium">click to upload</span>
          </p>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept="image/*,.pdf"
          />
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                 <File className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{fileName}</p>
                <p className="text-xs text-gray-500">200 KB — 100% uploaded</p>
              </div>
           </div>
           <button 
             onClick={removeFile}
             className="text-gray-400 hover:text-red-500 transition-colors p-2"
           >
             <Trash2 className="w-5 h-5" />
           </button>
        </div>
      )}

      <div className="pt-4 flex justify-end">
        <button 
          onClick={handleNext}
          disabled={!idNumber || !idType || !fileName}
          className={`font-medium py-3 px-8 rounded-lg transition-colors ${
            (idNumber && idType && fileName) 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-blue-300 text-white cursor-not-allowed'
          }`}
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
