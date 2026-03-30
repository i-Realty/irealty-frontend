'use client';

import { useEffect, useState } from 'react';
import { useAgentDashboardStore } from '@/lib/store/useAgentDashboardStore';
import AgentStats from '@/components/dashboard/AgentStats';
import RevenueCharts from '@/components/dashboard/RevenueCharts';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import KYCModal from '@/components/dashboard/kyc/KYCModal';
import InspectionSetupModal from '@/components/dashboard/setup/InspectionSetupModal';
import CreatePropertyModal from '@/components/dashboard/agent/property-create/CreatePropertyModal';
import { ArrowRight, ShieldCheck, Cog, FileCheck } from 'lucide-react';

export default function AgentDashboardPage() {
  const { profile, isLoading, fetchDashboardData, setKycModalOpen, verifyProfileLocally, resetDashboard } = useAgentDashboardStore();
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading && !profile) {
    return (
      <div className="flex h-full items-center justify-center p-8">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isVerified = profile?.kycStatus === 'verified';
  const progressPercentage = profile?.kycProgress || 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Dev Tool: Fast Demo Actions (Hidden in Production) */}
      <div className="bg-gray-100 p-3 rounded-lg flex flex-wrap gap-2 text-sm justify-end border border-gray-200 shadow-sm">
         <span className="font-medium text-gray-500 flex items-center mr-auto">Demo Controls:</span>
         {!isVerified ? (
           <button onClick={verifyProfileLocally} className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors">
              <FileCheck className="w-4 h-4" /> Skip KYC (Verify)
           </button>
         ) : (
           <button onClick={resetDashboard} className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors">
              Reset Dashboard
           </button>
         )}
         {isVerified && (
           <button onClick={() => setInspectionModalOpen(true)} className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors">
              <Cog className="w-4 h-4" /> Setup Inspection Config
           </button>
         )}
      </div>

      {/* Onboarding & KYC Section */}
      {!isVerified && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          
          {/* Progress Circular Indicator */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg className="w-20 h-20 transform -rotate-90">
               <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
               <circle 
                 cx="40" 
                 cy="40" 
                 r="36" 
                 stroke="currentColor" 
                 strokeWidth="6" 
                 fill="transparent" 
                 strokeDasharray="226" 
                 strokeDashoffset={226 - (226 * progressPercentage) / 100} 
                 className="text-blue-600 transition-all duration-500" 
               />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
               <span className="text-xl font-bold text-gray-900">{progressPercentage}%</span>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="text-blue-600 w-5 h-5" /> 
              Let&apos;s Build Trust Together
            </h2>
            <p className="text-sm text-gray-500 mb-4 max-w-xl text-center md:text-left">
               By completing KYC, you help us create a trusted platform where buyers, sellers, and agents can transact with confidence
            </p>

            {/* Stepper Dots (Visual) */}
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4 hidden md:flex">
               {['Personal Information', 'Verify Phone number', 'ID Verification', 'Face Match', 'Payment Details'].map((step, idx) => (
                 <div key={idx} className="flex flex-col items-center gap-2">
                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                     (progressPercentage / 20) > idx ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                   }`}>
                     {idx < (progressPercentage / 20) ? '✓' : ''}
                   </div>
                   <span className="text-xs text-gray-500">{step}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="shrink-0 w-full md:w-auto">
            <button 
              onClick={() => setKycModalOpen(true)}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium py-3 px-6 rounded-lg transition-colors border border-blue-100"
            >
              {progressPercentage > 0 ? 'Continue' : 'Get Started'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Dashboard Modules - These naturally adapt to KYC state via Zustand store */}
      <AgentStats />
      
      <RevenueCharts />
      
      <RecentTransactions />

      {/* Modals */}
      <KYCModal />
      <InspectionSetupModal isOpen={inspectionModalOpen} onClose={() => setInspectionModalOpen(false)} />
      <CreatePropertyModal />
    </div>
  );
}
