import { ReactNode } from 'react';
import DashboardShell from '@/components/dashboard/DashboardShell';

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
