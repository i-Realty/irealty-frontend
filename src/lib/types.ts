// Shared property types used across listing pages and components

export type Property = {
  id: number;
  title: string;
  location: string;
  price: string;
  priceValue: number;
  beds?: number;
  baths?: number;
  area?: string;
  tag?: 'For Rent' | 'For Sale';
  image?: string;
  agent?: string;
  agentId?: number;
};

export type PropertyWithCoords = Property & {
  lat?: number;
  lng?: number;
  // Extended map fields
  category?: 'sale' | 'rent' | 'shortlet';
  neighbourhood?: string;
  thumbnail?: string;
  isVerified?: boolean;
  hasVirtualTour?: boolean;
  isFavourited?: boolean;
  listedAt?: string; // ISO date string
  priceReduced?: boolean;
  originalPrice?: string;
  priceLabel?: string; // pre-formatted e.g. "₦1.5M"
  sizeSqm?: number;
  // Location hierarchy
  state?: string;
  lga?: string;
  // Amenities list
  amenities?: string[];
};
