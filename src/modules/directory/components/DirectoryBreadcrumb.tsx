'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { buildDirectorySeoPath } from '../utils/seoSlug';

interface DirectoryBreadcrumbProps {
  // Category hierarchy (optional)
  headCategory?: string | null;
  microCategory?: string | null;
  serviceName?: string | null;
  
  // Location hierarchy (optional)
  stateName?: string | null;
  cityName?: string | null;
  
  // Legacy slug props (for backward compatibility)
  serviceSlug?: string | null;
  citySlug?: string | null;
  stateSlug?: string | null;
}

/**
 * Convert slug (kebab-case) to human-readable text (Title Case)
 * Example: "peb-building-deign-consultant" → "Peb Building Deign Consultant"
 */
const humanizeSlug = (slug?: string | null): string => {
  if (!slug) return '';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function DirectoryBreadcrumb({
  headCategory,
  microCategory,
  serviceName,
  stateName,
  cityName,
  serviceSlug,
  citySlug,
  stateSlug,
}: DirectoryBreadcrumbProps) {
  // Build breadcrumb items with full category hierarchy
  const items: Array<{ label: string; href?: string }> = [
    { label: 'Indian Trade Mart', href: '/' },
  ];

  // Add category hierarchy if provided (prefer explicit names over slugs)
  if (headCategory) {
    items.push({ label: headCategory });
  }
  if (microCategory) {
    items.push({ label: microCategory });
  }
  if (serviceName) {
    items.push({ label: serviceName });
  }

  // Add location hierarchy if provided
  if (stateName) {
    items.push({ label: stateName });
  }
  if (cityName) {
    items.push({ label: cityName });
  }

  // Fallback to slug-based breadcrumb for backward compatibility
  // Only use slugs if no explicit names were provided
  if (
    !headCategory && !microCategory && !serviceName &&
    !stateName && !cityName &&
    (serviceSlug || citySlug || stateSlug)
  ) {
    if (serviceSlug) {
      items.push({ label: humanizeSlug(serviceSlug) });
    }
    if (stateSlug) {
      items.push({ label: humanizeSlug(stateSlug) });
    }
    if (citySlug) {
      items.push({ label: humanizeSlug(citySlug) });
    }
  }

  return (
    <nav className="flex items-center text-xs text-gray-600 mb-3 flex-wrap gap-1">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="text-gray-400 mx-1">&gt;</span>}
          {/* Last item is non-clickable (current page) */}
          {idx === items.length - 1 ? (
            <span className="text-gray-900 font-semibold">{item.label}</span>
          ) : item.href ? (
            <Link
              href={item.href}
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline transition-colors">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
