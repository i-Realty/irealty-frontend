'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, ChevronDown, Check, Plus } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '@/lib/store/useSidebarStore';
import { useMessagesStore } from '@/lib/store/useMessagesStore';
import { useSettingsStore } from '@/lib/store/useSettingsStore';

export default function TopNavBar() {
  const pathname = usePathname();
  const { toggle } = useSidebarStore();
  const activeChatId = useMessagesStore((state) => state.activeChatId);
  
  const { 
     activeAccount, 
     accounts, 
     setActiveAccount, 
     setAddAccountModalOpen 
  } = useSettingsStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const getPageTitle = () => {
    if (!pathname) return 'Dashboard';
    if (pathname.includes('/properties')) return 'My Properties';
    if (pathname.includes('/messages')) return 'Messages';
    if (pathname.includes('/documents')) return 'Documents';
    if (pathname.includes('/wallet')) return 'Wallet';
    if (pathname.includes('/transactions')) return 'Transactions';
    if (pathname.includes('/calendar')) return 'Calendar';
    if (pathname.includes('/settings')) return 'Settings';
    return 'Dashboard';
  };

  const isMessagesActive = pathname?.includes('/messages') && activeChatId !== null;

  return (
    <header className={`h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 z-[60] relative ${isMessagesActive ? 'hidden md:flex' : ''}`}>
      <div className="flex items-center gap-4 border-l border-gray-100 pl-4 ml-0 md:ml-0 md:border-l-0 md:pl-0">
         <div className="flex items-center gap-2">
           <Image src="/logo.png" alt="i-Realty" width={110} height={36} className="md:hidden object-contain" />
           <h1 className="text-xl font-bold text-gray-900 hidden md:block">{getPageTitle()}</h1>
         </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Mobile menu button */}
        <button onClick={toggle} className="md:hidden p-1 text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
          <Menu className="w-8 h-8" />
        </button>

        {/* Desktop User profile + Dropdown Switcher */}
        <div className="hidden md:flex relative" ref={dropdownRef}>
           <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200 focus:outline-none"
           >
               <Image 
                 src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" 
                 alt="User" 
                 width={32} 
                 height={32} 
                 className="w-8 h-8 rounded-full border border-gray-200 object-cover" 
               />
               <span className="text-sm font-bold text-gray-800 tracking-tight">{activeAccount.name}</span>
               <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
           </button>

           {/* Dropdown Menu */}
           {isDropdownOpen && (
              <div className="absolute top-full mt-2 right-0 w-64 bg-white border border-gray-100 rounded-2xl shadow-lg shadow-gray-200/50 py-2 z-[70] animate-in slide-in-from-top-2 fade-in duration-200">
                 
                 <div className="flex flex-col">
                    {accounts.map(acc => {
                       const isActive = activeAccount.id === acc.id;
                       return (
                          <button 
                             key={acc.id}
                             onClick={() => {
                                setActiveAccount(acc.id);
                                setIsDropdownOpen(false);
                             }}
                             className={`w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0`}
                          >
                             <div className="flex items-center gap-3">
                                <Image 
                                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" 
                                  alt="User" 
                                  width={36} 
                                  height={36} 
                                  className="w-9 h-9 rounded-full border border-gray-200 object-cover shadow-sm" 
                                />
                                <div className="flex flex-col items-start gap-0">
                                   <span className="text-[14px] font-bold text-gray-900 leading-tight">{acc.name}</span>
                                   <span className="text-[11px] font-medium text-gray-400 capitalize">{acc.role}</span>
                                </div>
                             </div>
                             {isActive && <Check className="w-4 h-4 text-blue-600" />}
                          </button>
                       )
                    })}
                 </div>

                 <div className="px-5 py-3 border-t border-gray-100 mt-1">
                    <button 
                       onClick={() => {
                          setIsDropdownOpen(false);
                          setAddAccountModalOpen(true);
                       }}
                       className="w-full flex items-center gap-2 text-blue-600 font-bold text-[14px] hover:text-blue-700 transition-colors py-1"
                    >
                       <Plus className="w-4 h-4" /> Add Account
                    </button>
                 </div>
              </div>
           )}
        </div>
      </div>
    </header>
  );
}
