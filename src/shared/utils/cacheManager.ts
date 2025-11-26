/**
 * Simple cache manager for storing API responses with TTL
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();

  /**
   * Set a value in cache with TTL (in milliseconds)
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in milliseconds (default: 5 minutes)
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    console.log(`💾 Caching [${key}] with TTL ${ttl}ms`);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Get a value from cache if it exists and hasn't expired
   * @param key - Cache key
   * @returns Cached data or undefined if expired/not found
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      console.log(`❌ Cache miss [${key}]`);
      return undefined;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    if (age > entry.ttl) {
      console.log(`⏰ Cache expired [${key}] (age: ${age}ms, TTL: ${entry.ttl}ms)`);
      this.cache.delete(key);
      return undefined;
    }

    console.log(`✅ Cache hit [${key}] (age: ${age}ms, TTL: ${entry.ttl}ms)`);
    return entry.data as T;
  }

  /**
   * Check if a key exists in cache and is still valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const age = Date.now() - entry.timestamp;
    const valid = age <= entry.ttl;

    if (!valid) {
      this.cache.delete(key);
    }

    return valid;
  }

  /**
   * Remove a specific key from cache
   */
  remove(key: string): void {
    console.log(`🗑️ Removing cache [${key}]`);
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    console.log('🧹 Clearing all cache');
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();

/**
 * Cache key constants for vendor data
 */
export const CACHE_KEYS = {
  VENDOR_STATS: 'vendor:stats',
  VENDOR_PRODUCTS: 'vendor:products',
  VENDOR_ORDERS: 'vendor:orders',
  VENDOR_PROFILE: 'vendor:profile',
  CATEGORY_HIERARCHY: 'categories:hierarchy',
  STATES: 'locations:states',
  CITIES: 'locations:cities'
} as const;

/**
 * Cache TTL constants (in milliseconds)
 */
export const CACHE_TTL = {
  SHORT: 2 * 60 * 1000,      // 2 minutes
  MEDIUM: 5 * 60 * 1000,     // 5 minutes
  LONG: 15 * 60 * 1000,      // 15 minutes
  VERY_LONG: 60 * 60 * 1000  // 1 hour
} as const;
