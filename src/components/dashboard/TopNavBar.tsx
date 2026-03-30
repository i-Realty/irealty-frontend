'use client';

import { Menu, Bell } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '@/lib/store/useSidebarStore';

export default function TopNavBar() {
  const pathname = usePathname();
  const { toggle } = useSidebarStore();
  
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

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6">
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

        {/* Desktop User profile */}
        <div className="hidden md:flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors border border-gray-100">
           <div className="relative w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
             {/* Using a placeholder avatar for testing */}
             <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
               WW
             </div>
           </div>
           <span className="text-sm font-medium text-gray-700">Waden Warren</span>
        </div>
      </div>
    </header>
  );
}
