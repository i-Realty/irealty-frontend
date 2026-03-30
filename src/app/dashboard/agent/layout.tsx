import { ReactNode } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNavBar from '@/components/dashboard/TopNavBar';

export default function AgentDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar - fixed on desktop, hidden on mobile unless toggled */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navigation */}
        <TopNavBar />
        
        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC] p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
