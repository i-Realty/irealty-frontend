'use client';

import { useCreatePropertyStore } from '@/lib/store/useCreatePropertyStore';
import { useEscapeKey } from '@/lib/hooks/useEscapeKey';
import { X } from 'lucide-react';
import Step1PropertyType from './Step1PropertyType';
import Step2PropertyDetails from './Step2PropertyDetails';
import Step3MediaUpload from './Step3MediaUpload';
import Step4Pricing from './Step4Pricing';
import Step5Review from './Step5Review';

export default function CreatePropertyModal() {
  const { isOpen, currentStep, closeWizard, isEditMode } = useCreatePropertyStore();

  useEscapeKey(closeWizard);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-center justify-center overflow-y-auto p-4 sm:p-6 pb-20" role="dialog" aria-modal="true" aria-label={isEditMode ? 'Edit property' : 'Create new property'}>
      {/* Main Container */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col relative my-auto overflow-hidden">
        
        {/* Absolute Close Button */}
        <button 
          onClick={closeWizard}
          className="absolute top-5 right-5 p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-full flex flex-col max-h-[85vh] overflow-y-auto px-6 py-8 md:p-10">        {/* Universal Header */}
        <div className="mb-8">
           <h2 className="text-2xl font-bold text-gray-900 mb-6">{isEditMode ? 'Edit Property' : 'Create New Property'}</h2>
           
           {/* Stepper Dummy Wrapper (we'll replace with real Stepper Component next) */}
           <div className="w-full bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col justify-center">
             <div className="text-xs text-gray-400 mb-1">Step {currentStep}/5</div>
             <div className="flex items-center gap-2">
                 <span className="font-semibold text-gray-800 mr-4 whitespace-nowrap min-w-[120px]">
                   {currentStep === 1 && 'Property Type'}
                   {currentStep === 2 && 'Property Details'}
                   {currentStep === 3 && 'Media Upload'}
                   {currentStep === 4 && 'Pricing'}
                   {currentStep === 5 && 'Review & Submit'}
                 </span>
                 {/* Visual Line Dots */}
                 <div className="flex items-center gap-2 flex-1">
                    {[1, 2, 3, 4, 5].map(step => (
                      <div key={step} className="flex items-center w-full">
                         <div className={`h-1.5 w-full rounded-full ${step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
                         {step < 5 && <div className={`w-2 h-2 rounded-full mx-1 shrink-0 ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                      </div>
                    ))}
                 </div>
             </div>
           </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 bg-white border border-gray-50 rounded-xl p-6 shadow-sm">
           {currentStep === 1 && <Step1PropertyType />}
           {currentStep === 2 && <Step2PropertyDetails />}
           {currentStep === 3 && <Step3MediaUpload />}
           {currentStep === 4 && <Step4Pricing />}
           {currentStep === 5 && <Step5Review />}
        </div>
      </div>
    </div>
  </div>
  );
}
