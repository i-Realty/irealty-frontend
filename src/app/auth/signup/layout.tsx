import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | i-Realty',
  description: 'Create your free i-Realty account to discover properties, connect with agents, and start your real estate journey.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
