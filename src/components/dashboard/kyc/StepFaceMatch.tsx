'use client';

import { useKYCStore } from './useKYCStore';
import { useState } from 'react';
import { Camera, CheckCircle2, User, RefreshCw } from 'lucide-react';

export default function StepFaceMatch() {
  const { setCurrentKycStep, updateKycProgress } = useKYCStore();
  const [hasCaptured, setHasCaptured] = useState(false);

  const handleNext = () => {
    updateKycProgress(4);
    setCurrentKycStep(5);
  };

  const handleCapture = () => {
    setHasCaptured(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Verify with a selfie</h2>
      </div>

      <div className="relative w-full h-[240px] bg-gray-900 rounded-xl overflow-hidden flex flex-col items-center justify-center border-4 border-gray-100">
         {!hasCaptured ? (
           <>
             <User className="w-16 h-16 text-gray-700" />
             <div className="absolute bottom-4 left-4 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <Camera className="w-5 h-5 text-white stroke-2" />
             </div>
           </>
         ) : (
           <>
             <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center">
               <img src="/images/avatar.png" alt="Selfie preview" className="w-full h-full object-cover opacity-80 mix-blend-overlay" />
               <CheckCircle2 className="w-16 h-16 text-green-400 absolute z-10 drop-shadow-lg" />
             </div>
             <button 
               onClick={() => setHasCaptured(false)}
               className="absolute bottom-4 left-4 bg-gray-800/80 hover:bg-gray-700 rounded-full p-2"
             >
                <RefreshCw className="w-5 h-5 text-white" />
             </button>
           </>
         )}
      </div>

      <div className="bg-[#FFF8E7] border border-[#FBE3A4] rounded-xl p-5 space-y-3">
         <p className="text-sm font-bold text-[#8A5100]">Note:</p>
         <ul className="space-y-2">
           <li className="flex gap-2 text-sm text-[#8A5100]">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Ensure camera/phone is ready and working
           </li>
           <li className="flex gap-2 text-sm text-[#8A5100]">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Ensure good lighting is available
           </li>
           <li className="flex gap-2 text-sm text-[#8A5100]">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Ensure the picture is clear because if it isn&apos;t, it can affect your verification
           </li>
         </ul>
      </div>

      <div className="pt-2 flex justify-end gap-3">
        {hasCaptured && (
          <button 
             onClick={() => setHasCaptured(false)}
             className="border border-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
          >
             Retake
          </button>
        )}
        <button 
          onClick={hasCaptured ? handleNext : handleCapture}
          className="bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {hasCaptured ? 'Proceed' : 'Capture'}
        </button>
      </div>
    </div>
  );
}
