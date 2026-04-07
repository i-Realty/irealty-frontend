import { ReactNode } from 'react';
import type { Metadata } from 'next';
import DashboardShell from '@/components/dashboard/DashboardShell';

export const metadata: Metadata = {
  title: 'Diaspora Dashboard — i-Realty',
  description: 'Invest in Nigerian real estate from abroad with i-Realty diaspora services.',
};

export default function DiasporaDashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
