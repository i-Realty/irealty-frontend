import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create a new i-Realty account.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
