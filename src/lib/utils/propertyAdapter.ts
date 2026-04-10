/**
 * propertyAdapter — Converts UnifiedProperty (from usePropertyStore) to
 * PropertyWithCoords (expected by ClientListingsContent / map components).
 *
 * This bridges the unified store with the existing listings UI without
 * requiring a full rewrite of those components.
 */

import type { PropertyWithCoords } from '@/lib/types';
import type { UnifiedProperty } from '@/lib/store/usePropertyStore';

// Use a large base ID to avoid collisions with hardcoded numeric IDs (1–200)
const STORE_ID_BASE = 100000;

export function unifiedToListingProperty(p: UnifiedProperty, index: number): PropertyWithCoords {
  // Stable numeric ID derived from the store ID string
  const numericId = STORE_ID_BASE + index;

  const isRent = p.listingType === 'For Rent';
  const formattedPrice = `₦ ${p.price.toLocaleString()}${p.priceType ? `/${p.priceType.replace('Per ', '').replace('Every ', 'Every ')}` : ''}`;

  return {
    id: numericId,
    title: `${p.bedrooms ? `${p.bedrooms} Bed ` : ''}${p.category} · ${p.city}`,
    location: `${p.city}, ${p.state}`,
    neighbourhood: p.city,
    price: formattedPrice,
    priceValue: p.price,
    priceLabel: p.price >= 1_000_000
      ? `₦${(p.price / 1_000_000).toFixed(1)}M`
      : `₦${(p.price / 1_000).toFixed(0)}K`,
    priceReduced: false,
    category: isRent ? 'rent' : 'sale',
    tag: p.listingType,
    beds: p.bedrooms,
    baths: p.bathrooms,
    area: p.sizeSqm ? `${p.sizeSqm} sqm` : undefined,
    sizeSqm: p.sizeSqm,
    image: p.media?.[0] ?? '/images/property1.png',
    thumbnail: p.media?.[0] ?? '/images/property1.png',
    agent: p.ownerName,
    agentId: numericId,
    isVerified: true,
    hasVirtualTour: !!p.virtualTourUrl,
    isFavourited: false,
    listedAt: p.createdAt,
    // Rough coords for Lagos/Abuja — fine for demo purposes
    lat: p.state === 'Abuja' ? 9.0579 : 6.5244,
    lng: p.state === 'Abuja' ? 7.4951 : 3.3792,
    // Pass through the store ID for deep-linking
    storeId: p.id,
  } as PropertyWithCoords & { storeId: string };
}
