/**
 * Wishlist Service
 * Handles all wishlist related API calls
 */

import apiService from './api.service';
import API_CONFIG from '@/config/api.config';

export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  image: string;
  addedAt: string;
}

export interface Wishlist {
  id: number;
  userId: number;
  items: WishlistItem[];
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

class WishlistService {
  async getWishlist() {
    return apiService.get<Wishlist>(API_CONFIG.ENDPOINTS.WISHLIST.GET_WISHLIST);
  }

  async getWishlistItems(page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.WISHLIST.GET_WISHLIST_ITEMS, {
      params: { page, size },
    });
  }

  async addToWishlist(productId: number) {
    return apiService.post<Wishlist>(API_CONFIG.ENDPOINTS.WISHLIST.ADD_TO_WISHLIST, {
      productId,
    });
  }

  async removeFromWishlist(productId: number) {
    return apiService.delete(
      API_CONFIG.ENDPOINTS.WISHLIST.REMOVE_FROM_WISHLIST(productId)
    );
  }

  async checkInWishlist(productId: number) {
    return apiService.get(API_CONFIG.ENDPOINTS.WISHLIST.CHECK_IN_WISHLIST(productId));
  }

  async clearWishlist() {
    return apiService.post(API_CONFIG.ENDPOINTS.WISHLIST.CLEAR_WISHLIST, {});
  }

  async getWishlistCount() {
    return apiService.get(API_CONFIG.ENDPOINTS.WISHLIST.GET_WISHLIST_COUNT);
  }

  async moveToCart(productId: number) {
    return apiService.post(API_CONFIG.ENDPOINTS.WISHLIST.MOVE_TO_CART(productId), {});
  }

  async shareWishlist(email: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.WISHLIST.SHARE_WISHLIST, { email });
  }

  async createPublicWishlist(name: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.WISHLIST.CREATE_PUBLIC_WISHLIST, { name });
  }

  async getPublicWishlists(page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.WISHLIST.GET_PUBLIC_WISHLISTS, {
      params: { page, size },
    });
  }

  async getWishlistByCode(code: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.WISHLIST.GET_WISHLIST_BY_CODE(code));
  }

  async searchWishlists(searchTerm: string, page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.WISHLIST.SEARCH_WISHLISTS, {
      params: { searchTerm, page, size },
    });
  }

  async getWishlistStatistics() {
    return apiService.get(API_CONFIG.ENDPOINTS.WISHLIST.GET_STATISTICS);
  }

  async getMostWishedProducts(limit = 10) {
    return apiService.get(API_CONFIG.ENDPOINTS.WISHLIST.GET_MOST_WISHED_PRODUCTS, {
      params: { limit },
    });
  }

  async getTrendingWishedProducts(limit = 10) {
    return apiService.get(API_CONFIG.ENDPOINTS.WISHLIST.GET_TRENDING_WISHED_PRODUCTS, {
      params: { limit },
    });
  }

  async addMultipleToWishlist(productIds: number[]) {
    return apiService.post(API_CONFIG.ENDPOINTS.WISHLIST.ADD_MULTIPLE_TO_WISHLIST, {
      productIds,
    });
  }

  async exportWishlist(format: 'csv' | 'pdf') {
    return apiService.get(API_CONFIG.ENDPOINTS.WISHLIST.EXPORT_WISHLIST, {
      params: { format },
      responseType: format === 'pdf' ? 'blob' : 'text',
    });
  }
}

export default new WishlistService();
