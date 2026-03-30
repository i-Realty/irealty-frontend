import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Password',
  description: 'Create a new password for your i-Realty account.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
