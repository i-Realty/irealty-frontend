'use client';

import { useState } from 'react';
import { User, Coins, ShieldCheck, HelpCircle, type LucideIcon } from 'lucide-react';

import AdminProfileSettings from '@/components/dashboard/admin/settings/AdminProfileSettings';
import AdminPlatformFees from '@/components/dashboard/admin/settings/AdminPlatformFees';
import AdminAccountSettings from '@/components/dashboard/admin/settings/AdminAccountSettings';
import AdminHelpCenter from '@/components/dashboard/admin/settings/AdminHelpCenter';

type AdminSettingsTab = 'Profile' | 'Platform Fees' | 'Account' | 'Help Center';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<AdminSettingsTab>('Profile');

  const TABS: { id: AdminSettingsTab; icon: LucideIcon }[] = [
    { id: 'Profile', icon: User },
    { id: 'Platform Fees', icon: Coins },
    { id: 'Account', icon: ShieldCheck },
    { id: 'Help Center', icon: HelpCircle },
  ];

  return (
    <div className="w-full min-h-full bg-gray-50/30 md:bg-white flex flex-col p-4 md:p-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2 md:mb-8 md:pl-0 pl-1">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-0 md:gap-12 flex-1 relative">
         
         {/* Desktop Left Nav list */}
         <div className="hidden md:flex flex-col w-56 shrink-0 relative border-r border-gray-100 pr-4">
            <div className="sticky top-24 flex flex-col space-y-2">
               {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all font-bold text-[14px] text-left relative ${
                           isActive 
                           ? 'bg-blue-50/50 text-blue-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]' 
                           : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                     >
                        <Icon strokeWidth={2.5} className={`w-5 h-5 ${isActive ? 'text-blue-500' : 'text-gray-300'}`} />
                        {tab.id}
                        
                        {isActive && (
                           <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-blue-600 rounded-r-full -ml-[1px]"></div>
                        )}
                     </button>
                  );
               })}
            </div>
         </div>

         {/* Mobile Horizontal Tabbing List */}
         <div className="md:hidden w-[calc(100%+2rem)] -ml-4 px-4 overflow-x-auto no-scrollbar border-b border-gray-200 mb-6 flex space-x-6 sticky top-0 bg-gray-50/30 z-10 font-bold backdrop-blur-md">
             {TABS.map((tab) => {
                 const isActive = activeTab === tab.id;
                 return (
                    <button
                       key={tab.id}
                       onClick={() => setActiveTab(tab.id)}
                       className={`pb-3 pt-2 text-[14px] whitespace-nowrap transition-colors relative flex items-center gap-2 ${
                         isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-900'
                       }`}
                    >
                       {tab.id}
                       {isActive && (
                          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-full z-10"></div>
                       )}
                    </button>
                 );
             })}
         </div>

         {/* Content View Boundary */}
         <div className="flex-1 w-full max-w-4xl min-h-[500px]">
            {activeTab === 'Profile' && <AdminProfileSettings />}
            {activeTab === 'Platform Fees' && <AdminPlatformFees />}
            {activeTab === 'Account' && <AdminAccountSettings />}
            {activeTab === 'Help Center' && <AdminHelpCenter />}
         </div>

      </div>
    </div>
  );
}
