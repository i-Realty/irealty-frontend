import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Developer Properties',
  description: 'Exclusive projects from leading site developers.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
