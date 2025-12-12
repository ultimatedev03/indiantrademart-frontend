/**
 * Directory SEO sitemap data source.
 * 
 * Provides a pluggable interface for fetching directory SEO entries to include in the sitemap.
 * Currently returns an empty array; to be replaced with real DB-backed implementation.
 */

/**
 * Represents a single directory SEO URL entry for the sitemap.
 * 
 * Examples:
 * - serviceSlug only: { serviceSlug: "land-surveyors" }
 * - service + location: { serviceSlug: "peb-building-design-consultant", citySlug: "visakhapatnam", stateSlug: "andhra-pradesh" }
 */
export interface DirectorySeoEntry {
  serviceSlug: string;
  citySlug?: string | null;
  stateSlug?: string | null;
  lastModified?: string; // ISO datetime string, optional
}

/**
 * Fetch directory SEO entries for inclusion in the sitemap.
 * 
 * @returns Array of DirectorySeoEntry objects representing SEO URLs
 * 
 * TODO: Replace this stub with real DB-backed implementation.
 * Should query a database table/view that contains:
 * - All unique services (as slugs)
 * - All service + city + state combinations
 * - Last modified timestamps for each entry
 * 
 * For now, returns empty array to avoid hardcoded mock data.
 */
export async function getDirectorySeoEntries(): Promise<DirectorySeoEntry[]> {
  // TODO: Implement real backend call
  // Example pseudo-code when DB is ready:
  // const result = await db.query('SELECT DISTINCT serviceSlug, citySlug, stateSlug, lastModified FROM directory_seo_entries');
  // return result.map(row => ({
  //   serviceSlug: row.serviceSlug,
  //   citySlug: row.citySlug,
  //   stateSlug: row.stateSlug,
  //   lastModified: row.lastModified,
  // }));

  return [];
}
