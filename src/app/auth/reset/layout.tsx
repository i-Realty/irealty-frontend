import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password | i-Realty',
  description: 'Reset your i-Realty account password securely. Enter your email to receive a password reset link.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
