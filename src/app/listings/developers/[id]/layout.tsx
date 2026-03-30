import type { Metadata } from 'next';
import { developerProperties } from '@/lib/data/properties';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id || 0);
  const prop = developerProperties.find((p) => p.id === id);

  if (!prop) {
    return {
      title: 'Developer Property Not Found',
      description: 'The requested developer property could not be found.',
    };
  }

  return {
    title: prop.title,
    description: `View developer details for ${prop.title} located in ${prop.location}. Listed at ${prop.price}.`,
    openGraph: {
      images: [prop.image || '/images/og-default.png'],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
