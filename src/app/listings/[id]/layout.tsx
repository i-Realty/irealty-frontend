import type { Metadata } from 'next';
import { standardProperties } from '@/lib/data/properties';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id || 0);
  const prop = standardProperties.find((p) => p.id === id);

  if (!prop) {
    return {
      title: 'Property Not Found',
      description: 'The requested property could not be found.',
    };
  }

  return {
    title: prop.title,
    description: `View details for ${prop.title} located in ${prop.location}. Listed at ${prop.price}.`,
    openGraph: {
      images: [prop.image || '/images/og-default.png'],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
