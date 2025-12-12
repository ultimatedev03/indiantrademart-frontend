import { MetadataRoute } from 'next';
import { getDirectorySeoEntries } from '@/lib/sitemap/directorySitemapSource';

const MAIN_BASE_URL = 'https://www.indiantrademart.com';
const DIR_BASE_URL = 'https://dir.indiantrademart.com';

/**
 * Generate the sitemap for the entire Indian Trade Mart platform.
 * 
 * Includes:
 * 1. Core main-site pages (www.indiantrademart.com)
 * 2. Directory SEO URLs (dir.indiantrademart.com) from pluggable data source
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // 1) Core main-site pages
  const corePages = [
    '/',
    '/about-us',
    '/contact-us',
    '/directory',
    '/products',
    '/categories',
    '/cities',
    '/privacy-policy',
    '/terms-of-use',
  ];

  for (const path of corePages) {
    entries.push({
      url: `${MAIN_BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: path === '/' ? 'weekly' : 'monthly',
      priority: path === '/' ? 1.0 : 0.8,
    });
  }

  // 2) Directory SEO URLs (on dir. subdomain)
  // These are built from the pluggable data source
  // Until DB is integrated, this will be empty
  const directoryEntries = await getDirectorySeoEntries();

  for (const entry of directoryEntries) {
    const { serviceSlug, citySlug, stateSlug, lastModified } = entry;

    if (!serviceSlug) continue;

    let path: string;

    if (citySlug && stateSlug) {
      path = `/${serviceSlug}-in-${citySlug}-${stateSlug}`;
    } else {
      path = `/${serviceSlug}`;
    }

    entries.push({
      url: `${DIR_BASE_URL}${path}`,
      lastModified: lastModified ? new Date(lastModified) : now,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  return entries;
}
