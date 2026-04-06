import { ReactNode } from 'react';
import DashboardShell from '@/components/dashboard/DashboardShell';

export default function DeveloperDashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
