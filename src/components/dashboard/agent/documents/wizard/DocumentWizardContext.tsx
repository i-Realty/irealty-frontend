import { useDocumentsStore } from '@/lib/store/useDocumentsStore';
import { Home, X } from 'lucide-react';

import Step1ChooseType from './Step1_ChooseType';
import Step2DocumentDetails from './Step2_DocumentDetails';
import Step3ReviewCreate from './Step3_ReviewCreate';

export default function DocumentWizardContext() {
  const { setWizardOpen, wizardStep } = useDocumentsStore();

  const stepTitles: Record<number, string> = {
    1: 'Choose Type',
    2: 'Document Details',
    3: 'Review & Create',
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-gray-50/95 overflow-y-auto w-full min-h-screen">
       
       {/* Wizard Top Nav */}
       <div className="sticky top-0 w-full h-16 md:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-12 z-50 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-2">
             <Home className="w-6 h-6 text-blue-600" />
             <span className="font-bold text-xl text-blue-600 tracking-tight">i-Realty</span>
          </div>
          <button 
             onClick={() => setWizardOpen(false)}
             className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
             <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
       </div>

       {/* Main Form Centering Frame */}
       <div className="flex-1 w-full max-w-[800px] mx-auto flex flex-col pt-8 md:pt-12 pb-24 px-4 md:px-8">
          
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 px-1">Create New Document</h1>

          {/* Progress Indicator Card */}
          <div className="w-full bg-white rounded-2xl md:rounded-[24px] p-6 mb-6 md:mb-8 border border-gray-100/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
             
             <div className="flex flex-col">
                <span className="text-[13px] font-medium text-gray-400 mb-1">Step {wizardStep}/3</span>
                <span className="font-bold text-[16px] text-gray-900 leading-tight">{stepTitles[wizardStep]}</span>
             </div>

             {/* Node Line Visual */}
             <div className="flex items-center gap-2 pr-4 md:flex-initial">
                 {/* Step 1 Visual Node */}
                 <div className={`h-1.5 rounded-full transition-all duration-300 ${wizardStep >= 1 ? 'w-16 bg-blue-600' : 'w-16 bg-gray-200'}`}></div>
                 <div className={`w-3 h-3 rounded-full transition-all duration-300 ${wizardStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                 
                 {/* Step 2 Visual Node */}
                 <div className={`h-1.5 rounded-full transition-all duration-300 ${wizardStep >= 2 ? 'w-16 bg-blue-600' : 'w-16 bg-gray-200'}`}></div>
                 <div className={`w-3 h-3 rounded-full transition-all duration-300 ${wizardStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                 
                 {/* Step 3 Visual Node */}
                 <div className={`h-1.5 rounded-full transition-all duration-300 ${wizardStep >= 3 ? 'w-16 bg-blue-600' : 'w-16 bg-gray-200'}`}></div>
                 <div className={`w-3 h-3 rounded-full transition-all duration-300 bg-gray-200`}></div> {/* End cap */}
             </div>
          </div>

          {/* Form Routing */}
          <div className="w-full bg-white rounded-2xl md:rounded-[24px] border border-gray-100/50 shadow-sm">
             {wizardStep === 1 && <Step1ChooseType />}
             {wizardStep === 2 && <Step2DocumentDetails />}
             {wizardStep === 3 && <Step3ReviewCreate />}
          </div>

       </div>

    </div>
  );
}
