import { MetadataRoute } from 'next';
import { standardProperties, developerProperties } from '@/lib/data/properties';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.i-realty.app';

  // Static routes
  const staticRoutes = [
    '',
    '/listings',
    '/listings?purpose=sale',
    '/listings?purpose=rent',
    '/listings/developers',
    '/auth/login',
    '/auth/signup',
    '/auth/reset',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    priority: route === '' ? 1 : 0.8,
  }));

  // Standard property routes
  const propertyRoutes = standardProperties.map((prop) => ({
    url: `${baseUrl}/listings/${prop.id}`,
    lastModified: new Date(prop.listedAt || new Date()),
    priority: 0.8,
  }));

  const propertyProfileRoutes = standardProperties.map((prop) => ({
    url: `${baseUrl}/listings/${prop.id}/profile`,
    lastModified: new Date(prop.listedAt || new Date()),
    priority: 0.64,
  }));

  // Developer property routes
  const developerRoutes = developerProperties.map((prop) => ({
    url: `${baseUrl}/listings/developers/${prop.id}`,
    lastModified: new Date(prop.listedAt || new Date()),
    priority: 0.8,
  }));

  const developerProfileRoutes = developerProperties.map((prop) => ({
    url: `${baseUrl}/listings/developers/${prop.id}/profile`,
    lastModified: new Date(prop.listedAt || new Date()),
    priority: 0.64,
  }));

  return [...staticRoutes, ...propertyRoutes, ...propertyProfileRoutes, ...developerRoutes, ...developerProfileRoutes];
}
