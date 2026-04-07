import { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in — i-Realty',
  description: 'Log in or create an account to access the i-Realty real estate platform.',
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
