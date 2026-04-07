import { ReactNode } from 'react';
import type { Metadata } from 'next';
import DashboardShell from '@/components/dashboard/DashboardShell';

export const metadata: Metadata = {
  title: 'Developer Dashboard — i-Realty',
  description: 'Manage your development projects, milestones, and transactions on i-Realty.',
};

export default function DeveloperDashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
