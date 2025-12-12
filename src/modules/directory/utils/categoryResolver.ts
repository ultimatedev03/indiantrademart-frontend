/**
 * Category Resolver Utility
 * 
 * Maps service/category names to the complete category hierarchy
 * (Head Category → Micro Category → Service Name).
 * 
 * This is the single source of truth for resolving category hierarchies in the directory module.
 * Uses existing ServiceCategory data structure where:
 * - Top-level category = Head Category
 * - SubCategory = Micro Category
 * - Service name = Specific service being searched
 */

import { ServiceCategory } from '../types/directory';

export interface DirectoryCategoryPath {
  headCategory: string | null;
  microCategory: string | null;
  serviceName: string | null;
}

/**
 * Resolve the complete category path for a service name.
 * 
 * Searches through ServiceCategory data to find the head and micro categories
 * that contain the given service name.
 * 
 * @param serviceName - The name of the service to resolve (e.g., "Land Surveyors", "Boundary Survey")
 * @param categories - Array of ServiceCategory objects to search within
 * @returns DirectoryCategoryPath with headCategory, microCategory, serviceName (nulls if not found)
 * 
 * Examples:
 * - resolveCategoryPathForService("Land Surveyors", mockCategories)
 *   → { headCategory: "Land Surveyors", microCategory: null, serviceName: "Land Surveyors" }
 * 
 * - resolveCategoryPathForService("Boundary Survey", mockCategories)
 *   → { headCategory: "Land Surveyors", microCategory: "Boundary Survey", serviceName: "Boundary Survey" }
 * 
 * - resolveCategoryPathForService("Unknown Service", mockCategories)
 *   → { headCategory: null, microCategory: null, serviceName: "Unknown Service" }
 */
export function resolveCategoryPathForService(
  serviceName: string | null,
  categories: ServiceCategory[]
): DirectoryCategoryPath {
  if (!serviceName || !categories || categories.length === 0) {
    return {
      headCategory: null,
      microCategory: null,
      serviceName: serviceName || null,
    };
  }

  const normalizedService = serviceName.toLowerCase().trim();

  // Search through categories
  for (const category of categories) {
    const normalizedHeadCategory = category.name.toLowerCase().trim();

    // Check if service matches the head category itself
    if (normalizedHeadCategory === normalizedService) {
      return {
        headCategory: category.name,
        microCategory: null,
        serviceName: serviceName,
      };
    }

    // Check if service matches any micro category (sub-category)
    if (category.subCategories && category.subCategories.length > 0) {
      const foundSubCategory = category.subCategories.find(
        (sub) => sub.name.toLowerCase().trim() === normalizedService
      );

      if (foundSubCategory) {
        return {
          headCategory: category.name,
          microCategory: foundSubCategory.name,
          serviceName: serviceName,
        };
      }
    }
  }

  // Service not found in hierarchy
  // Return serviceName as-is but with no category mapping
  return {
    headCategory: null,
    microCategory: null,
    serviceName: serviceName,
  };
}

/**
 * Get default/major head categories from the category list.
 * Useful for breadcrumb fallbacks or when showing category options.
 */
export function getHeadCategories(categories: ServiceCategory[]): string[] {
  return categories.map((cat) => cat.name);
}

/**
 * Get micro categories for a specific head category.
 * Useful for showing sub-services under a main category.
 */
export function getMicroCategories(
  headCategory: string,
  categories: ServiceCategory[]
): string[] {
  const found = categories.find(
    (cat) => cat.name.toLowerCase() === headCategory.toLowerCase()
  );

  if (!found || !found.subCategories) {
    return [];
  }

  return found.subCategories.map((sub) => sub.name);
}
