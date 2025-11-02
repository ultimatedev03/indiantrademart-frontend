/**
 * Search Service
 * Handles all search and filtering related API calls
 */

import apiService from './api.service';
import API_CONFIG from '@/config/api.config';

export interface SearchResult {
  id: number;
  type: 'product' | 'category' | 'vendor' | 'blog';
  title: string;
  description: string;
  image: string;
  url: string;
  relevance: number;
}

export interface SearchFilter {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  vendor?: string;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
  page?: number;
  size?: number;
}

class SearchService {
  async search(query: string, filters?: SearchFilter) {
    return apiService.get<SearchResult[]>(API_CONFIG.ENDPOINTS.SEARCH.SEARCH, {
      params: { query, ...filters },
    });
  }

  async searchProducts(
    query: string,
    page = 0,
    size = 20,
    filters?: Omit<SearchFilter, 'page' | 'size'>
  ) {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.SEARCH_PRODUCTS, {
      params: { query, page, size, ...filters },
    });
  }

  async searchCategories(query: string, page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.SEARCH_CATEGORIES, {
      params: { query, page, size },
    });
  }

  async searchVendors(query: string, page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.SEARCH_VENDORS, {
      params: { query, page, size },
    });
  }

  async searchBlogs(query: string, page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.SEARCH_BLOGS, {
      params: { query, page, size },
    });
  }

  async getSearchSuggestions(query: string, limit = 10) {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.GET_SEARCH_SUGGESTIONS, {
      params: { query, limit },
    });
  }

  async getSearchHistory(limit = 10) {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.GET_SEARCH_HISTORY, {
      params: { limit },
    });
  }

  async clearSearchHistory() {
    return apiService.delete(API_CONFIG.ENDPOINTS.SEARCH.CLEAR_SEARCH_HISTORY);
  }

  async getSaveableSearches() {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.GET_SAVED_SEARCHES);
  }

  async saveSearch(query: string, name: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.SEARCH.SAVE_SEARCH, { query, name });
  }

  async removeSavedSearch(searchId: number) {
    return apiService.delete(API_CONFIG.ENDPOINTS.SEARCH.REMOVE_SAVED_SEARCH(searchId));
  }

  async getTrendingSearches(limit = 10) {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.GET_TRENDING_SEARCHES, {
      params: { limit },
    });
  }

  async getTrendingProducts(limit = 10) {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.GET_TRENDING_PRODUCTS, {
      params: { limit },
    });
  }

  async getRelatedSearches(query: string, limit = 10) {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.GET_RELATED_SEARCHES, {
      params: { query, limit },
    });
  }

  async getRelatedProducts(productId: number, limit = 10) {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.GET_RELATED_PRODUCTS, {
      params: { productId, limit },
    });
  }

  async advancedSearch(filters: any) {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.ADVANCED_SEARCH, { params: filters });
  }

  async filterProducts(filters: any) {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.FILTER_PRODUCTS, { params: filters });
  }

  async getAvailableFilters() {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.GET_AVAILABLE_FILTERS);
  }

  async getPriceRange() {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.GET_PRICE_RANGE);
  }

  async getCategories() {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.GET_CATEGORIES);
  }

  async getVendors(page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.GET_VENDORS, { params: { page, size } });
  }

  async getRatings() {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.GET_RATINGS);
  }

  async getSortOptions() {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.GET_SORT_OPTIONS);
  }

  async trackSearchAnalytics(query: string, resultCount: number) {
    return apiService.post(API_CONFIG.ENDPOINTS.SEARCH.TRACK_SEARCH_ANALYTICS, {
      query,
      resultCount,
    });
  }

  async getSearchAnalytics(startDate?: string, endDate?: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.GET_SEARCH_ANALYTICS, {
      params: { startDate, endDate },
    });
  }

  async getZeroResultsSearches(startDate?: string, endDate?: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.GET_ZERO_RESULTS_SEARCHES, {
      params: { startDate, endDate },
    });
  }

  async exportSearchResults(query: string, format: 'csv' | 'pdf') {
    return apiService.get(API_CONFIG.ENDPOINTS.SEARCH.EXPORT_SEARCH_RESULTS, {
      params: { query, format },
      responseType: format === 'pdf' ? 'blob' : 'text',
    });
  }
}

export default new SearchService();
