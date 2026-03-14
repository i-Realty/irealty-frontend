import type { PropertyWithCoords } from '@/lib/types';

// Single source of truth for sample property data.
// Used by: listings page, developers listings page, property detail page.
export const sampleProperties: PropertyWithCoords[] = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  title: 'Residential Plot - GRA Enugu',
  location: 'Independence Layout, Enugu',
  price: '₦ 20,000,000.00',
  beds: 3,
  baths: 2,
  area: '120 sqm',
  tag: i % 2 === 0 ? 'For Rent' : 'For Sale',
  image: i % 2 === 0 ? '/images/property1.png' : '/images/property2.png',
  agent: 'Sarah Homes',
  agentId: (i % 3) + 1,
  lat: 6.5 + i * 0.02,
  lng: 7.4 + (i % 3) * 0.03,
}));
