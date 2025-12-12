// =============================================================================
// Vendor Service Layer
// =============================================================================
// Handles vendor operations: dashboard, products, analytics, profile

import { apiClient } from '../api-client';
import {
  Vendor,
  VendorProfile,
  Product,
  Order,
  VendorAnalytics,
  PaginatedResponse,
} from '../types/api-types';

class VendorService {
  // =========================================================================
  // VENDOR PROFILE
  // =========================================================================

  async getVendorProfile(): Promise<VendorProfile> {
    try {
      return await apiClient.get('/vendors/profile');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch vendor profile');
    }
  }

  async updateVendorProfile(vendorId: string, data: any): Promise<VendorProfile> {
    try {
      return await apiClient.updateVendorProfile(vendorId, data);
    } catch (error) {
      throw this.handleError(error, 'Failed to update vendor profile');
    }
  }

  async updateProfilePicture(vendorId: string, file: File): Promise<string> {
    try {
      const response = await apiClient.uploadFile(file, 'avatar');
      return response.url || response;
    } catch (error) {
      throw this.handleError(error, 'Profile picture upload failed');
    }
  }

  async updateBankDetails(vendorId: string, bankDetails: any): Promise<any> {
    try {
      return await apiClient.patch(`/vendors/${vendorId}/banking`, bankDetails);
    } catch (error) {
      throw this.handleError(error, 'Failed to update bank details');
    }
  }

  async updateBusinessInfo(vendorId: string, businessInfo: any): Promise<any> {
    try {
      return await apiClient.patch(`/vendors/${vendorId}/business-info`, businessInfo);
    } catch (error) {
      throw this.handleError(error, 'Failed to update business information');
    }
  }

  // =========================================================================
  // VENDOR DASHBOARD
  // =========================================================================

  async getDashboard(): Promise<any> {
    try {
      return await apiClient.getVendorDashboard();
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch dashboard');
    }
  }

  async getDashboardStats(): Promise<any> {
    try {
      return await apiClient.get('/analytics/vendor/dashboard');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch dashboard statistics');
    }
  }

  async getQuickStats(): Promise<any> {
    try {
      return await apiClient.get('/vendors/quick-stats');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch quick statistics');
    }
  }

  // =========================================================================
  // PRODUCT MANAGEMENT
  // =========================================================================

  async getMyProducts(params?: {
    page?: number;
    size?: number;
    status?: string;
  }): Promise<PaginatedResponse<Product>> {
    try {
      return await apiClient.getVendorProducts(params);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch products');
    }
  }

  async createProduct(productData: any): Promise<Product> {
    try {
      return await apiClient.createProduct(productData);
    } catch (error) {
      throw this.handleError(error, 'Product creation failed');
    }
  }

  async updateProduct(productId: string, productData: any): Promise<Product> {
    try {
      return await apiClient.updateProduct(productId, productData);
    } catch (error) {
      throw this.handleError(error, 'Product update failed');
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      await apiClient.deleteProduct(productId);
    } catch (error) {
      throw this.handleError(error, 'Product deletion failed');
    }
  }

  async bulkImportProducts(file: File): Promise<any> {
    try {
      return await apiClient.post('/products/bulk-import', 
        { file: file }, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    } catch (error) {
      throw this.handleError(error, 'Bulk import failed');
    }
  }

  async getProductTemplate(): Promise<Blob> {
    try {
      return await apiClient.getAxiosInstance().get('/products/template', {
        responseType: 'blob',
      }).then(r => r.data);
    } catch (error) {
      throw this.handleError(error, 'Failed to download template');
    }
  }

  // =========================================================================
  // PRODUCT IMAGES & MEDIA
  // =========================================================================

  async uploadProductImages(productId: string, files: File[]): Promise<any> {
    try {
      return await apiClient.uploadProductImages(productId, files);
    } catch (error) {
      throw this.handleError(error, 'Image upload failed');
    }
  }

  async uploadProductVideo(productId: string, videoData: any): Promise<any> {
    try {
      return await apiClient.post(`/products/${productId}/videos`, videoData);
    } catch (error) {
      throw this.handleError(error, 'Video upload failed');
    }
  }

  async deleteProductImage(imageId: string): Promise<void> {
    try {
      await apiClient.delete(`/products/images/${imageId}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to delete image');
    }
  }

  // =========================================================================
  // ORDER MANAGEMENT
  // =========================================================================

  async getVendorOrders(params?: {
    page?: number;
    size?: number;
    status?: string;
  }): Promise<PaginatedResponse<Order>> {
    try {
      return await apiClient.getVendorOrders(params);
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

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    try {
      return await apiClient.put(`/orders/${orderId}/status`, { status });
    } catch (error) {
      throw this.handleError(error, 'Failed to update order status');
    }
  }

  async markOrderShipped(orderId: string, trackingNumber?: string): Promise<Order> {
    try {
      return await apiClient.put(`/orders/${orderId}/status`, { 
        status: 'SHIPPED',
        trackingNumber 
      });
    } catch (error) {
      throw this.handleError(error, 'Failed to mark order as shipped');
    }
  }

  // =========================================================================
  // VENDOR ANALYTICS
  // =========================================================================

  async getAnalytics(timeRange?: string): Promise<VendorAnalytics> {
    try {
      return await apiClient.getVendorAnalytics(timeRange);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch analytics');
    }
  }

  async getProductPerformance(): Promise<any[]> {
    try {
      return await apiClient.get('/analytics/products');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch product performance');
    }
  }

  async getRevenueAnalytics(timeRange?: string): Promise<any> {
    try {
      return await apiClient.get('/analytics/revenue', {
        params: { timeRange },
      });
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch revenue analytics');
    }
  }

  async getOrderAnalytics(timeRange?: string): Promise<any> {
    try {
      return await apiClient.get('/analytics/orders', {
        params: { timeRange },
      });
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch order analytics');
    }
  }

  async getCustomerAnalytics(): Promise<any> {
    try {
      return await apiClient.get('/analytics/customers');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch customer analytics');
    }
  }

  // =========================================================================
  // INQUIRIES & QUOTES
  // =========================================================================

  async getVendorInquiries(params?: any): Promise<any[]> {
    try {
      return await apiClient.getVendorInquiries();
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch inquiries');
    }
  }

  async respondToInquiry(inquiryId: string, response: string): Promise<any> {
    try {
      return await apiClient.put(`/inquiries/${inquiryId}/resolve`, { response });
    } catch (error) {
      throw this.handleError(error, 'Failed to respond to inquiry');
    }
  }

  // =========================================================================
  // REVIEWS & RATINGS
  // =========================================================================

  async getVendorReviews(params?: any): Promise<any> {
    try {
      return await apiClient.get('/reviews/vendor', { params });
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch vendor reviews');
    }
  }

  async getProductReviews(productId: string): Promise<any> {
    try {
      return await apiClient.get(`/reviews/product/${productId}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch product reviews');
    }
  }

  // =========================================================================
  // SUBSCRIPTION & BILLING
  // =========================================================================

  async getCurrentSubscription(): Promise<any> {
    try {
      return await apiClient.get('/subscriptions/vendor/current');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch subscription details');
    }
  }

  async getSubscriptionPlans(): Promise<any[]> {
    try {
      return await apiClient.get('/subscriptions/plans');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch subscription plans');
    }
  }

  async upgradeSubscription(planId: string): Promise<any> {
    try {
      return await apiClient.post(`/subscriptions/vendor/upgrade`, { planId });
    } catch (error) {
      throw this.handleError(error, 'Subscription upgrade failed');
    }
  }

  async getBillingHistory(): Promise<any[]> {
    try {
      return await apiClient.get('/subscriptions/vendor/history');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch billing history');
    }
  }

  // =========================================================================
  // VERIFICATION & COMPLIANCE
  // =========================================================================

  async getVerificationStatus(): Promise<any> {
    try {
      return await apiClient.get('/vendors/verification-status');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch verification status');
    }
  }

  async uploadKYCDocuments(documents: any[]): Promise<any> {
    try {
      return await apiClient.post('/vendors/kyc/upload', { documents });
    } catch (error) {
      throw this.handleError(error, 'KYC upload failed');
    }
  }

  // =========================================================================
  // EXPORT & REPORTS
  // =========================================================================

  async exportOrders(format: 'CSV' | 'PDF' = 'CSV'): Promise<Blob> {
    try {
      const response = await apiClient.getAxiosInstance().get('/vendors/export/orders', {
        params: { format },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Export failed');
    }
  }

  async generateReport(reportType: string, dateRange?: any): Promise<Blob> {
    try {
      const response = await apiClient.getAxiosInstance().get('/vendors/reports', {
        params: { type: reportType, ...dateRange },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Report generation failed');
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

export const vendorService = new VendorService();
export default vendorService;
