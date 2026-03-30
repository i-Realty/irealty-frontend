'use client';

import { useAgentDashboardStore } from '@/lib/store/useAgentDashboardStore';
import { Check, X } from 'lucide-react';

interface ValidationResultProps {
  success: boolean;
  onRetry?: () => void;
}

export default function ValidationResult({ success, onRetry }: ValidationResultProps) {
  const { setKycModalOpen } = useAgentDashboardStore();

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
         {/* Success Icon */}
         <div className="relative flex items-center justify-center">
            {/* Outer circles */}
            <div className="w-32 h-32 rounded-full bg-green-50 absolute"></div>
            <div className="w-24 h-24 rounded-full bg-green-100 absolute"></div>
            {/* Inner circle */}
            <div className="w-20 h-20 rounded-full bg-green-500 relative flex items-center justify-center z-10 shadow-lg">
               <Check className="w-10 h-10 text-white stroke-[3]" />
            </div>
         </div>

         <div className="space-y-3 max-w-sm mt-4">
            <h2 className="text-2xl font-bold text-gray-900">You&apos;re Now Verified!</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your KYC is complete. Welcome to our trusted community of agents — you can now list properties and start earning securely
            </p>
         </div>

         <div className="w-full pt-6">
            <button 
              onClick={() => setKycModalOpen(false)}
              className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Go To Dashboard
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
       {/* Error Icon */}
       <div className="relative flex items-center justify-center">
          {/* Outer circles */}
          <div className="w-32 h-32 rounded-full bg-red-50 absolute"></div>
          <div className="w-24 h-24 rounded-full bg-red-100 absolute"></div>
          {/* Inner circle */}
          <div className="w-20 h-20 rounded-full bg-red-500 relative flex items-center justify-center z-10 shadow-lg">
             <X className="w-10 h-10 text-white stroke-[3]" />
          </div>
       </div>

       <div className="space-y-3 max-w-sm mt-4">
          <h2 className="text-2xl font-bold text-gray-900">Verification Not Successful!</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your identification could not be verified, please try a different means of identification
          </p>
       </div>

       <div className="w-full pt-6">
          <button 
            onClick={onRetry}
            className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Try again
          </button>
       </div>
    </div>
  );
}
