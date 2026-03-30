import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Listings',
  description: 'Explore premium real estate in Nigeria.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
