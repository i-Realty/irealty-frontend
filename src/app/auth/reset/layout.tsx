import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your i-Realty secure password.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
