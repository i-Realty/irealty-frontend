import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Securely login to your i-Realty account.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
