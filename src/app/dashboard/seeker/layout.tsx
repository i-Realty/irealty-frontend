import { ReactNode } from 'react';
import type { Metadata } from 'next';
import DashboardShell from '@/components/dashboard/DashboardShell';

export const metadata: Metadata = {
  title: 'Dashboard — i-Realty',
  description: 'Search properties, manage favorites, and track your transactions on i-Realty.',
};

export default function SeekerDashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
