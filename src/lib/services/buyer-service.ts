// =============================================================================
// Buyer Service Layer
// =============================================================================
// Handles buyer operations: profile, orders, wishlist, inquiries

import { apiClient } from '../api-client';
import {
  Buyer,
  Order,
  Wishlist,
  Inquiry,
  Review,
  PaginatedResponse,
} from '../types/api-types';

class BuyerService {
  // =========================================================================
  // BUYER PROFILE
  // =========================================================================

  async getBuyerProfile(): Promise<Buyer> {
    try {
      return await apiClient.getBuyerProfile();
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch buyer profile');
    }
  }

  async updateBuyerProfile(data: any): Promise<Buyer> {
    try {
      return await apiClient.updateBuyerProfile(data);
    } catch (error) {
      throw this.handleError(error, 'Failed to update buyer profile');
    }
  }

  async updateAvatar(file: File): Promise<string> {
    try {
      const response = await apiClient.uploadFile(file, 'avatar');
      return response.url || response;
    } catch (error) {
      throw this.handleError(error, 'Avatar upload failed');
    }
  }

  async upgradeToPremium(): Promise<any> {
    try {
      return await apiClient.post('/buyers/upgrade-premium', {});
    } catch (error) {
      throw this.handleError(error, 'Premium upgrade failed');
    }
  }

  // =========================================================================
  // BUYER DASHBOARD
  // =========================================================================

  async getBuyerDashboard(): Promise<any> {
    try {
      return await apiClient.getBuyerDashboard();
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch dashboard');
    }
  }

  async getDashboardStats(): Promise<any> {
    try {
      return await apiClient.get('/analytics/buyer/dashboard');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch dashboard statistics');
    }
  }

  // =========================================================================
  // ORDERS
  // =========================================================================

  async getMyOrders(params?: {
    page?: number;
    size?: number;
    status?: string;
  }): Promise<PaginatedResponse<Order>> {
    try {
      return await apiClient.getMyOrders(params);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch orders');
    }
  }

  async getOrderDetails(orderId: string): Promise<Order> {
    try {
      return await apiClient.getOrderById(orderId);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch order details');
    }
  }

  async trackOrder(orderNumber: string): Promise<Order> {
    try {
      return await apiClient.trackOrder(orderNumber);
    } catch (error) {
      throw this.handleError(error, 'Failed to track order');
    }
  }

  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    try {
      return await apiClient.cancelOrder(orderId, reason);
    } catch (error) {
      throw this.handleError(error, 'Failed to cancel order');
    }
  }

  async returnOrder(orderId: string, reason: string): Promise<any> {
    try {
      return await apiClient.post(`/orders/${orderId}/return`, { reason });
    } catch (error) {
      throw this.handleError(error, 'Failed to initiate return');
    }
  }

  async getOrderInvoice(orderId: string): Promise<Blob> {
    try {
      const response = await apiClient.getAxiosInstance().get(
        `/orders/${orderId}/invoice`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to download invoice');
    }
  }

  // =========================================================================
  // WISHLIST
  // =========================================================================

  async getWishlist(): Promise<any[]> {
    try {
      return await apiClient.getWishlist();
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch wishlist');
    }
  }

  async addToWishlist(productId: string): Promise<any> {
    try {
      return await apiClient.addToWishlist(productId);
    } catch (error) {
      throw this.handleError(error, 'Failed to add to wishlist');
    }
  }

  async removeFromWishlist(productId: string): Promise<void> {
    try {
      await apiClient.removeFromWishlist(productId);
    } catch (error) {
      throw this.handleError(error, 'Failed to remove from wishlist');
    }
  }

  async isInWishlist(productId: string): Promise<boolean> {
    try {
      return await apiClient.checkInWishlist(productId);
    } catch (error) {
      console.warn('Failed to check wishlist status');
      return false;
    }
  }

  async clearWishlist(): Promise<void> {
    try {
      await apiClient.post('/wishlist/clear', {});
    } catch (error) {
      throw this.handleError(error, 'Failed to clear wishlist');
    }
  }

  // =========================================================================
  // INQUIRIES & QUOTES
  // =========================================================================

  async getMyInquiries(params?: any): Promise<Inquiry[]> {
    try {
      return await apiClient.getMyInquiries();
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch inquiries');
    }
  }

  async createInquiry(data: any): Promise<Inquiry> {
    try {
      return await apiClient.createInquiry(data);
    } catch (error) {
      throw this.handleError(error, 'Failed to create inquiry');
    }
  }

  async getInquiryDetails(inquiryId: string): Promise<Inquiry> {
    try {
      return await apiClient.get(`/inquiries/${inquiryId}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch inquiry details');
    }
  }

  async respondToQuote(inquiryId: string, vendorId: string, accept: boolean): Promise<any> {
    try {
      return await apiClient.post(`/inquiries/${inquiryId}/respond`, {
        vendorId,
        accept,
      });
    } catch (error) {
      throw this.handleError(error, 'Failed to respond to quote');
    }
  }

  // =========================================================================
  // REVIEWS
  // =========================================================================

  async submitProductReview(productId: string, reviewData: any): Promise<Review> {
    try {
      return await apiClient.post('/reviews/product', {
        productId,
        ...reviewData,
      });
    } catch (error) {
      throw this.handleError(error, 'Failed to submit review');
    }
  }

  async submitVendorReview(vendorId: string, reviewData: any): Promise<Review> {
    try {
      return await apiClient.post('/reviews/vendor', {
        vendorId,
        ...reviewData,
      });
    } catch (error) {
      throw this.handleError(error, 'Failed to submit vendor review');
    }
  }

  async getMyReviews(): Promise<Review[]> {
    try {
      return await apiClient.get('/reviews/my-reviews');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch reviews');
    }
  }

  // =========================================================================
  // SAVED ADDRESSES
  // =========================================================================

  async getSavedAddresses(): Promise<any[]> {
    try {
      return await apiClient.get('/addresses');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch addresses');
    }
  }

  async addAddress(address: any): Promise<any> {
    try {
      return await apiClient.post('/addresses', address);
    } catch (error) {
      throw this.handleError(error, 'Failed to add address');
    }
  }

  async updateAddress(addressId: string, address: any): Promise<any> {
    try {
      return await apiClient.put(`/addresses/${addressId}`, address);
    } catch (error) {
      throw this.handleError(error, 'Failed to update address');
    }
  }

  async deleteAddress(addressId: string): Promise<void> {
    try {
      await apiClient.delete(`/addresses/${addressId}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to delete address');
    }
  }

  async setDefaultAddress(addressId: string): Promise<any> {
    try {
      return await apiClient.put(`/addresses/${addressId}/set-default`, {});
    } catch (error) {
      throw this.handleError(error, 'Failed to set default address');
    }
  }

  // =========================================================================
  // ANALYTICS
  // =========================================================================

  async getOrderAnalytics(): Promise<any> {
    try {
      return await apiClient.get('/analytics/buyer/orders');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch order analytics');
    }
  }

  async getSpendingAnalytics(timeRange?: string): Promise<any> {
    try {
      return await apiClient.get('/analytics/buyer/spending', {
        params: { timeRange },
      });
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch spending analytics');
    }
  }

  // =========================================================================
  // SAVED CARDS
  // =========================================================================

  async getSavedCards(): Promise<any[]> {
    try {
      return await apiClient.get('/buyers/payment-cards');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch saved cards');
    }
  }

  async addPaymentCard(cardData: any): Promise<any> {
    try {
      return await apiClient.post('/buyers/payment-cards', cardData);
    } catch (error) {
      throw this.handleError(error, 'Failed to add payment card');
    }
  }

  async deletePaymentCard(cardId: string): Promise<void> {
    try {
      await apiClient.delete(`/buyers/payment-cards/${cardId}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to delete payment card');
    }
  }

  // =========================================================================
  // ERROR HANDLING
  // =========================================================================

  private handleError(error: any, defaultMessage: string): Error {
    const message = error.response?.data?.message || error.message || defaultMessage;
    console.error(message, error);
    return new Error(message);
  }
}

export const buyerService = new BuyerService();
export default buyerService;
