import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | i-Realty',
  description: 'Log in to your i-Realty account to browse listings, manage properties, and connect with agents.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
