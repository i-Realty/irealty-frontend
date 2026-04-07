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

  const ogImage = prop.image || '/images/og-default.png';
  const ogDescription = `${prop.location} · ${prop.price}${prop.beds ? ` · ${prop.beds} bed` : ''}${prop.baths ? ` · ${prop.baths} bath` : ''}`;
  const canonicalUrl = `https://www.irealty.ng/listings/${id}`;

  return {
    title: `${prop.title} — i-Realty`,
    description: `View details for ${prop.title} located in ${prop.location}. Listed at ${prop.price}.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: prop.title,
      description: ogDescription,
      url: canonicalUrl,
      siteName: 'i-Realty',
      locale: 'en_NG',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: prop.title }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@irealty_ng',
      title: prop.title,
      description: ogDescription,
      images: [{ url: ogImage, width: 1200, height: 630, alt: prop.title }],
    },
    other: {
      'og:price:amount': String(prop.priceValue ?? ''),
      'og:price:currency': 'NGN',
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
