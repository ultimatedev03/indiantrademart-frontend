/**
 * In-memory cache manager with TTL support
 * Stores cached data with expiration times
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Get cached data if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cache with TTL in milliseconds
   */
  set<T>(key: string, data: T, ttlMs: number = 300000): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs
    });
  }

  /**
   * Clear specific cache entry
   */
  clear(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.clear();
  }

  /**
   * Check if cache entry exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();

// Cache key constants
export const CACHE_KEYS = {
  VENDOR_STATS: 'vendor-stats',
  VENDOR_PRODUCTS: 'vendor-products',
  VENDOR_ORDERS: 'vendor-orders',
  BUYER_CART: 'buyer-cart',
  BUYER_WISHLIST: 'buyer-wishlist',
  DIRECTORY_RESULTS: 'directory-results',
  SEARCH_RESULTS: 'search-results'
} as const;

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  SHORT: 60000,      // 1 minute
  MEDIUM: 300000,    // 5 minutes
  LONG: 900000,      // 15 minutes
  VERY_LONG: 3600000 // 1 hour
} as const;
