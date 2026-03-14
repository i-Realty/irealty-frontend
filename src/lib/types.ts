// Shared property types used across listing pages and components

export type Property = {
  id: number;
  title: string;
  location: string;
  price: string;
  beds?: number;
  baths?: number;
  area?: string;
  tag?: 'For Rent' | 'For Sale';
  image?: string;
  agent?: string;
  agentId?: number;
};

export type PropertyWithCoords = Property & { lat?: number; lng?: number };
