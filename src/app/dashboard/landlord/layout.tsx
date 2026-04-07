import { ReactNode } from 'react';
import type { Metadata } from 'next';
import DashboardShell from '@/components/dashboard/DashboardShell';

export const metadata: Metadata = {
  title: 'Landlord Dashboard — i-Realty',
  description: 'Manage your rental properties, tenants, and income on i-Realty.',
};

export default function LandlordDashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
