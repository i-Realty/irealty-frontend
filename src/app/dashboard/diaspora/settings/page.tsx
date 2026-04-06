'use client';

import { useSettingsStore, SettingsTab } from '@/lib/store/useSettingsStore';
import { User, CreditCard, FileText, HelpCircle, type LucideIcon } from 'lucide-react';
import ProfileSettings from '@/components/dashboard/agent/settings/forms/ProfileSettings';
import PayoutSettings from '@/components/dashboard/agent/settings/forms/PayoutSettings';
import AccountSettings from '@/components/dashboard/agent/settings/forms/AccountSettings';
import HelpCenterSettings from '@/components/dashboard/agent/settings/forms/HelpCenterSettings';
import AddAccountModal from '@/components/dashboard/agent/settings/AddAccountModal';

const DIASPORA_TABS: { id: SettingsTab; icon: LucideIcon }[] = [
  { id: 'Profile',     icon: User },
  { id: 'Payout',      icon: CreditCard },
  { id: 'Account',     icon: FileText },
  { id: 'Help Center', icon: HelpCircle },
];

export default function DiasporaSettingsPage() {
  const { activeTab, setActiveTab } = useSettingsStore();

  const validTab = DIASPORA_TABS.find((t) => t.id === activeTab) ? activeTab : 'Profile';

  return (
    <div className="w-full min-h-full bg-gray-50/30 md:bg-white flex flex-col p-4 md:p-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-2 md:mb-8 md:pl-0 pl-1">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-0 md:gap-12 flex-1 relative">
        <div className="hidden md:flex flex-col w-56 shrink-0 relative border-r border-gray-100 pr-4">
          <div className="sticky top-24 flex flex-col space-y-2">
            {DIASPORA_TABS.map((tab) => {
              const isActive = validTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all font-bold text-[14px] text-left relative ${
                    isActive ? 'bg-blue-50/50 text-blue-600' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon strokeWidth={2.5} className={`w-5 h-5 ${isActive ? 'text-blue-500' : 'text-gray-300'}`} />
                  {tab.id}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-blue-600 rounded-r-full -ml-[1px]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="md:hidden w-[calc(100%+2rem)] -ml-4 px-4 overflow-x-auto no-scrollbar border-b border-gray-200 mb-6 flex space-x-6 sticky top-0 bg-gray-50/30 z-10 font-bold backdrop-blur-md">
          {DIASPORA_TABS.map((tab) => {
            const isActive = validTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 pt-2 text-[14px] whitespace-nowrap transition-colors relative ${
                  isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                {tab.id}
                {isActive && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-full z-10" />}
              </button>
            );
          })}
        </div>

        <div className="flex-1 w-full max-w-4xl min-h-[500px]">
          {validTab === 'Profile'     && <ProfileSettings />}
          {validTab === 'Payout'      && <PayoutSettings />}
          {validTab === 'Account'     && <AccountSettings />}
          {validTab === 'Help Center' && <HelpCenterSettings />}
        </div>
      </div>

      <AddAccountModal />
    </div>
  );
}
