/**
 * SEO slug utilities for directory URLs.
 * Converts human-readable text to slugs and builds SEO paths.
 */

/**
 * Convert text to URL-friendly slug.
 * Removes special characters, converts spaces to hyphens, collapses multiple hyphens.
 * 
 * Examples:
 * - "PEB Building Design Consultant" → "peb-building-design-consultant"
 * - "Visakhapatnam" → "visakhapatnam"
 * - "Andhra Pradesh" → "andhra-pradesh"
 */
export function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')  // remove special chars (keep only alphanumeric, spaces, hyphens)
    .replace(/\s+/g, '-')           // replace spaces with hyphens
    .replace(/-+/g, '-')            // collapse multiple consecutive hyphens to single
    .replace(/^-+|-+$/g, '');       // remove leading/trailing hyphens
}

/**
 * Build SEO directory path from service/city/state names.
 * 
 * Supported patterns:
 * 1. Service only: /directory/{serviceSlug}
 * 2. Service + City + State: /directory/{serviceSlug}-in-{citySlug}-{stateSlug}
 * 3. No service: returns null (use fallback non-SEO behavior)
 * 
 * @returns SEO path string or null if no service provided
 * 
 * Examples:
 * - buildDirectorySeoPath({ serviceName: "Land Surveyors" })
 *   → "/directory/land-surveyors"
 * 
 * - buildDirectorySeoPath({
 *     serviceName: "PEB Building Design Consultant",
 *     cityName: "Visakhapatnam",
 *     stateName: "Andhra Pradesh"
 *   })
 *   → "/directory/peb-building-design-consultant-in-visakhapatnam-andhra-pradesh"
 */
export function buildDirectorySeoPath(opts: {
  serviceName?: string | null;
  cityName?: string | null;
  stateName?: string | null;
}): string | null {
  const serviceSlug = opts.serviceName ? toSlug(opts.serviceName) : null;
  const citySlug = opts.cityName ? toSlug(opts.cityName) : null;
  const stateSlug = opts.stateName ? toSlug(opts.stateName) : null;

  // Service + City + State
  if (serviceSlug && citySlug && stateSlug) {
    return `/directory/${serviceSlug}-in-${citySlug}-${stateSlug}`;
  }

  // Service only
  if (serviceSlug) {
    return `/directory/${serviceSlug}`;
  }

  // No service → no SEO path, use fallback behavior
  return null;
}
