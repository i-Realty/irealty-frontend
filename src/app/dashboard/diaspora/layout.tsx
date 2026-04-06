import { ReactNode } from 'react';
import DashboardShell from '@/components/dashboard/DashboardShell';

export default function DiasporaDashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
