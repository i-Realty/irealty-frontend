'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Home, 
  MessageSquare, 
  FileText, 
  Wallet, 
  ArrowRightLeft, 
  Calendar, 
  Settings, 
  LogOut,
  X 
} from 'lucide-react';
import { useSidebarStore } from '@/lib/store/useSidebarStore';

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebarStore();

  const navItems = [
    { label: 'OVERVIEW', isHeader: true },
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/agent' },
    { label: 'My Properties', icon: Home, href: '/dashboard/agent/properties' },
    { label: 'Messages', icon: MessageSquare, href: '/dashboard/agent/messages' },
    { label: 'Documents', icon: FileText, href: '/dashboard/agent/documents' },
    
    { label: 'FINANCIAL', isHeader: true },
    { label: 'Wallet', icon: Wallet, href: '/dashboard/agent/wallet' },
    { label: 'Transactions', icon: ArrowRightLeft, href: '/dashboard/transactions' },
    
    { label: 'TOOLS', isHeader: true },
    { label: 'Calendar', icon: Calendar, href: '/dashboard/agent/calendar' },
    
    { label: 'ACCOUNT', isHeader: true },
    { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={close} 
      />
      
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 md:w-64 bg-white border-r border-gray-200 h-screen flex flex-col transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 shadow-xl md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <Link href="/" className="font-bold text-xl text-blue-600 flex items-center gap-2">
             <Home className="w-6 h-6 text-blue-600" />
             i-Realty
          </Link>
          <button onClick={close} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1">
          {navItems.map((item, index) => {
            if (item.isHeader) {
              return (
                <div key={index} className="px-6 pt-5 pb-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
              );
            }

            const isActive = pathname === item.href || (item.href !== '/dashboard/agent' && pathname.startsWith(item.href!));
            const Icon = item.icon!;

            return (
              <Link
                key={index}
                href={item.href!}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100 pb-10 md:pb-4">
        <button className="flex items-center gap-3 px-2 py-3 w-full text-sm font-medium text-red-500 hover:bg-red-50 rounded-md transition-colors">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
   </>
  );
}
