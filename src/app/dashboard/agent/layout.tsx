import { ReactNode } from 'react';
import type { Metadata } from 'next';
import DashboardShell from '@/components/dashboard/DashboardShell';

export const metadata: Metadata = {
  title: 'Agent Dashboard — i-Realty',
  description: 'Manage your properties, messages, transactions, and settings as an i-Realty agent.',
};

export default function AgentDashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
