'use client';

import { useAgentDashboardStore } from '@/lib/store/useAgentDashboardStore';
import { X } from 'lucide-react';
import StepPersonalInformation from './StepPersonalInformation';
import StepVerifyPhone from './StepVerifyPhone';
import StepIDVerification from './StepIDVerification';
import StepFaceMatch from './StepFaceMatch';
import StepPaymentDetails from './StepPaymentDetails';
import ValidationResult from './ValidationResult';
import { useState } from 'react';

export default function KYCModal() {
  const { isKycModalOpen, setKycModalOpen, currentKycStep } = useAgentDashboardStore();
  const [validationResult, setValidationResult] = useState<'none' | 'success' | 'failed'>('none');

  if (!isKycModalOpen) return null;

  const totalSteps = 5;

  const renderStep = () => {
    if (validationResult === 'success') {
      return <ValidationResult success={true} />;
    }
    if (validationResult === 'failed') {
      return <ValidationResult success={false} onRetry={() => setValidationResult('none')} />;
    }

    switch (currentKycStep) {
      case 1:
        return <StepPersonalInformation />;
      case 2:
        return <StepVerifyPhone />;
      case 3:
        return <StepIDVerification />;
      case 4:
        return <StepFaceMatch />;
      case 5:
        return <StepPaymentDetails onComplete={() => handleVerificationSubmit()} />;
      default:
        return <StepPersonalInformation />;
    }
  };

  const handleVerificationSubmit = async () => {
    const { mockSubmitKycForVerification } = useAgentDashboardStore.getState();
    const result = await mockSubmitKycForVerification();
    if (result) {
      setValidationResult('success');
    } else {
      setValidationResult('failed');
    }
  };

  const getStepTitle = () => {
    switch (currentKycStep) {
      case 1: return 'Personal Information';
      case 2: return 'Verify Phone number';
      case 3: return 'ID Verification';
      case 4: return 'Face Match';
      case 5: return 'Payment Details';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setKycModalOpen(false)}></div>
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden my-auto sm:my-8 h-full sm:h-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            {/* Logo placeholder */}
            <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full block"></span>
            i-REALTY
          </h2>
          <button 
            onClick={() => setKycModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto w-full max-h-full">
          {validationResult === 'none' && (
            <div className="bg-gray-50 px-6 py-4 flex flex-col items-center">
              <div className="w-full max-w-xs flex flex-col items-start gap-2">
                 <span className="text-xs text-gray-400 font-medium">Step {currentKycStep}/{totalSteps}</span>
                 <h3 className="text-sm font-bold text-gray-900">{getStepTitle()}</h3>
                 <div className="flex justify-between items-center w-full mt-2 gap-1.5">
                   {[1, 2, 3, 4, 5].map((step) => (
                     <div 
                       key={step} 
                       className={`h-[3px] flex-1 rounded-full ${
                         step === currentKycStep ? 'bg-blue-600 w-4' :
                         step < currentKycStep ? 'bg-blue-600' : 'bg-gray-200'
                       }`}
                     />
                   ))}
                 </div>
              </div>
            </div>
          )}

          <div className="p-6">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}
