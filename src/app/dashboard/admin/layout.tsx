import { ReactNode } from 'react';
import type { Metadata } from 'next';
import DashboardShell from '@/components/dashboard/DashboardShell';

export const metadata: Metadata = {
  title: 'Admin Dashboard — i-Realty',
  description: 'Platform administration: users, properties, transactions, finance, and settings.',
};

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
