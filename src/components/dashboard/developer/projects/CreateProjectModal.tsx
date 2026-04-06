'use client';

import { useCreateProjectStore } from '@/lib/store/useCreateProjectStore';
import { X } from 'lucide-react';
import Step1ProjectType from './Step1ProjectType';
import Step2ProjectDetails from './Step2ProjectDetails';
import Step3Milestones from './Step3Milestones';
import Step4MediaUpload from './Step4MediaUpload';
import Step5Review from './Step5Review';

const STEP_TITLES = ['Property Type', 'Property Details', 'Milestones', 'Media Upload', 'Review & Submit'];

export default function CreateProjectModal() {
  const { isOpen, closeWizard, currentStep } = useCreateProjectStore();

  if (!isOpen) return null;

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1ProjectType />;
      case 2: return <Step2ProjectDetails />;
      case 3: return <Step3Milestones />;
      case 4: return <Step4MediaUpload />;
      case 5: return <Step5Review />;
      default: return <Step1ProjectType />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeWizard} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden my-auto sm:my-8 h-full sm:h-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full block" />
            i-REALTY
          </h2>
          <button onClick={closeWizard} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto w-full">
          {/* Step Progress */}
          <div className="bg-white px-6 py-4">
            <h3 className="text-lg font-bold text-gray-900">Create New Project</h3>
            <div className="flex flex-col gap-2 mt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">Step {currentStep}/5</span>
                <span className="text-sm font-bold text-gray-900">{STEP_TITLES[currentStep - 1]}</span>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`h-[3px] flex-1 rounded-full ${
                      step === currentStep ? 'bg-blue-600' :
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 pt-2">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}
