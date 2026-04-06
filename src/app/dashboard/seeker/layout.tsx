import { ReactNode } from 'react';
import DashboardShell from '@/components/dashboard/DashboardShell';

export default function SeekerDashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
