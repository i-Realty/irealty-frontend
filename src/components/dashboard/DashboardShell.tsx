import { ReactNode } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNavBar from '@/components/dashboard/TopNavBar';

/**
 * Shared layout shell for all role dashboards.
 * Each role's layout.tsx wraps its children in this component.
 *
 * Usage:
 *   export default function AgentDashboardLayout({ children }) {
 *     return <DashboardShell>{children}</DashboardShell>;
 *   }
 */
export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#0a0a0a]">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNavBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC] dark:bg-[#0a0a0a] p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
