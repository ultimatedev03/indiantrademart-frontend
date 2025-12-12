/**
 * Review Service
 * Handles all product review related API calls
 */

import apiService from './api.service';
import API_CONFIG from '@/config/api.config';

export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerified: boolean;
  helpful: number;
  unhelpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  comment?: string;
  images?: string[];
}

class ReviewService {
  async createReview(data: CreateReviewRequest) {
    return apiService.post<Review>(API_CONFIG.ENDPOINTS.REVIEWS.CREATE_REVIEW, data);
  }

  async getReviewById(id: number) {
    return apiService.get<Review>(API_CONFIG.ENDPOINTS.REVIEWS.GET_REVIEW_BY_ID(id));
  }

  async updateReview(id: number, data: UpdateReviewRequest) {
    return apiService.put<Review>(API_CONFIG.ENDPOINTS.REVIEWS.UPDATE_REVIEW(id), data);
  }

  async deleteReview(id: number) {
    return apiService.delete(API_CONFIG.ENDPOINTS.REVIEWS.DELETE_REVIEW(id));
  }

  async getProductReviews(productId: number, page = 0, size = 20, sortBy = 'recent') {
    return apiService.get(API_CONFIG.ENDPOINTS.REVIEWS.GET_PRODUCT_REVIEWS(productId), {
      params: { page, size, sortBy },
    });
  }

  async getMyReviews(page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.REVIEWS.GET_MY_REVIEWS, {
      params: { page, size },
    });
  }

  async getAllReviews(page = 0, size = 20, params?: any) {
    return apiService.get(API_CONFIG.ENDPOINTS.REVIEWS.GET_ALL_REVIEWS, {
      params: { page, size, ...params },
    });
  }

  async getReviewsByRating(productId: number, rating: number, page = 0, size = 20) {
    return apiService.get(
      API_CONFIG.ENDPOINTS.REVIEWS.GET_BY_RATING(productId, rating),
      {
        params: { page, size },
      }
    );
  }

  async getReviewsByUser(userId: number, page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.REVIEWS.GET_BY_USER(userId), {
      params: { page, size },
    });
  }

  async getAverageRating(productId: number) {
    return apiService.get(API_CONFIG.ENDPOINTS.REVIEWS.GET_AVERAGE_RATING(productId));
  }

  async getRatingDistribution(productId: number) {
    return apiService.get(API_CONFIG.ENDPOINTS.REVIEWS.GET_RATING_DISTRIBUTION(productId));
  }

  async searchReviews(searchTerm: string, page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.REVIEWS.SEARCH_REVIEWS, {
      params: { searchTerm, page, size },
    });
  }

  async markAsHelpful(reviewId: number) {
    return apiService.post(API_CONFIG.ENDPOINTS.REVIEWS.MARK_AS_HELPFUL(reviewId), {});
  }

  async markAsUnhelpful(reviewId: number) {
    return apiService.post(API_CONFIG.ENDPOINTS.REVIEWS.MARK_AS_UNHELPFUL(reviewId), {});
  }

  async removeHelpfulMark(reviewId: number) {
    return apiService.delete(API_CONFIG.ENDPOINTS.REVIEWS.REMOVE_HELPFUL_MARK(reviewId));
  }

  async reportReview(reviewId: number, reason: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.REVIEWS.REPORT_REVIEW(reviewId), { reason });
  }

  async verifyReview(reviewId: number) {
    return apiService.post(API_CONFIG.ENDPOINTS.REVIEWS.VERIFY_REVIEW(reviewId), {});
  }

  async approveReview(reviewId: number) {
    return apiService.post(API_CONFIG.ENDPOINTS.REVIEWS.APPROVE_REVIEW(reviewId), {});
  }

  async rejectReview(reviewId: number, reason: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.REVIEWS.REJECT_REVIEW(reviewId), { reason });
  }

  async getPendingReviews(page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.REVIEWS.GET_PENDING_REVIEWS, {
      params: { page, size },
    });
  }

  async getReviewStatistics() {
    return apiService.get(API_CONFIG.ENDPOINTS.REVIEWS.GET_STATISTICS);
  }

  async getTopRatedProducts(limit = 10) {
    return apiService.get(API_CONFIG.ENDPOINTS.REVIEWS.GET_TOP_RATED_PRODUCTS, {
      params: { limit },
    });
  }

  async getLowestRatedProducts(limit = 10) {
    return apiService.get(API_CONFIG.ENDPOINTS.REVIEWS.GET_LOWEST_RATED_PRODUCTS, {
      params: { limit },
    });
  }

  async getRecentReviews(limit = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.REVIEWS.GET_RECENT_REVIEWS, {
      params: { limit },
    });
  }

  async exportReviews(format: 'csv' | 'pdf', params?: any) {
    return apiService.get(API_CONFIG.ENDPOINTS.REVIEWS.EXPORT_REVIEWS, {
      params: { format, ...params },
      responseType: format === 'pdf' ? 'blob' : 'text',
    });
  }
}

export default new ReviewService();
