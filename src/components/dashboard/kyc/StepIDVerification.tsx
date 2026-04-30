'use client';

import { useAgentDashboardStore } from '@/lib/store/useAgentDashboardStore';
import { useState, useRef } from 'react';
import { UploadCloud, File, Trash2, ChevronDown, Loader2 } from 'lucide-react';
import { apiPost } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// Map frontend labels → backend idType enum
const ID_TYPE_BACKEND: Record<string, string> = {
  'International Passport': 'INTERNATIONAL_PASSPORT',
  "Driver's License": 'DRIVERS_LICENSE',
  "Voter's Card": 'VOTERS_CARD',
  NIN: 'NIN',
  BVN: 'BVN',
};

export default function StepIDVerification() {
  const { setCurrentKycStep, updateKycProgress } = useAgentDashboardStore();

  const [idNumber, setIdNumber] = useState('');
  const [idType, setIdType] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileData, setFileData] = useState<string>('');
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = async () => {
    setAttempted(true);
    if (!idNumber || !idType || !fileName) return;
    setApiError('');
    if (USE_API) {
      setSubmitting(true);
      try {
        await apiPost('/api/kyc/id-verification', {
          idType:  ID_TYPE_BACKEND[idType] ?? idType,
          idNumber,
          // file is binary — send as base64 when file upload endpoint exists
          // For now submit without file if not available
          ...(fileData ? { file: fileData } : {}),
        });
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'Failed to submit ID. Please try again.');
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
    }
    updateKycProgress(3);
    setCurrentKycStep(4);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    // Read as base64 for API submission
    const reader = new FileReader();
    reader.onload = () => setFileData(reader.result as string);
    reader.readAsDataURL(file);
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Identification Number <span className="text-red-500">*</span></label>
        <input
          type="text"
          placeholder="Enter Identification Number"
          className={`w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${attempted && !idNumber ? 'border-red-400' : 'border-gray-200'}`}
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
        />
        {attempted && !idNumber && <p className="text-xs text-red-500 mt-1">Identification number is required</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Identification <span className="text-red-500">*</span></label>
        <div className="relative">
          <select
            className={`w-full border rounded-lg px-4 py-3 text-sm bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${attempted && !idType ? 'border-red-400' : 'border-gray-200'}`}
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
        {attempted && !idType && <p className="text-xs text-red-500 mt-1">Please select a means of identification</p>}
      </div>

      {/* Upload Zone */}
      {!fileName ? (
        <div
          className={`border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors ${attempted && !fileName ? 'border-red-300 bg-red-50/30' : 'border-gray-300'}`}
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

      {attempted && !fileName && <p className="text-xs text-red-500 -mt-4">Please upload an identification document</p>}

      {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
      <div className="pt-4 flex justify-end">
        <button
          onClick={handleNext}
          disabled={submitting}
          className="font-medium py-3 px-8 rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Proceed
        </button>
      </div>
    </div>
  );
}
