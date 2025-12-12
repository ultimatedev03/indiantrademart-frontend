'use client';

import React from 'react';
import DirectoryPage from '@/modules/directory/components/DirectoryPage';

interface DirectorySeoPageProps {
  params: Promise<{
    seoParams: string[];
  }>;
}

/**
 * Parse SEO slug into component parts.
 * 
 * Supported patterns:
 * 1. /land-surveyors
 *    → serviceSlug = "land-surveyors"
 *    
 * 2. /peb-building-deign-consultant-in-visakhapatnam-andhra-pradesh
 *    → serviceSlug = "peb-building-deign-consultant"
 *    → citySlug = "visakhapatnam"
 *    → stateSlug = "andhra-pradesh"
 */
function parseSeoSlug(slugArray: string[]): {
  serviceSlug: string | null;
  citySlug: string | null;
  stateSlug: string | null;
} {
  const slug = slugArray.join('-');
  
  let serviceSlug: string | null = null;
  let citySlug: string | null = null;
  let stateSlug: string | null = null;

  if (slug.includes('-in-')) {
    // Pattern: service-in-city-state
    const [servicePart, locationPart] = slug.split('-in-');
    serviceSlug = servicePart;

    const parts = locationPart.split('-');
    
    // Heuristic: last 2 hyphen-separated parts = state (e.g., "andhra-pradesh")
    // Remaining parts before that = city name (e.g., "visakhapatnam")
    if (parts.length >= 3) {
      // At least 3 parts: treat last 2 as state, rest as city
      stateSlug = parts.slice(-2).join('-');
      citySlug = parts.slice(0, -2).join('-') || null;
    } else if (parts.length === 2) {
      // Exactly 2 parts: first is city, second is state
      citySlug = parts[0];
      stateSlug = parts[1];
    } else if (parts.length === 1) {
      // Only 1 part: treat as city
      citySlug = parts[0];
    }
  } else {
    // Pattern: service-only
    serviceSlug = slug;
  }

  return { serviceSlug, citySlug, stateSlug };
}

export default async function DirectorySeoPage({ params }: DirectorySeoPageProps) {
  const resolvedParams = await params;
  const { serviceSlug, citySlug, stateSlug } = parseSeoSlug(resolvedParams.seoParams ?? []);

  return (
    <DirectoryPage
      initialServiceSlug={serviceSlug}
      initialCitySlug={citySlug}
      initialStateSlug={stateSlug}
      source="seo"
    />
  );
}
