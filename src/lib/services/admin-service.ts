// =============================================================================
// Admin Service Layer
// =============================================================================
// Handles admin operations: users, vendors, orders, verification, analytics

import { apiClient } from '../api-client';
import {
  User,
  Vendor,
  Order,
  Product,
  PaginatedResponse,
} from '../types/api-types';

class AdminService {
  // =========================================================================
  // ADMIN DASHBOARD
  // =========================================================================

  async getAdminDashboard(): Promise<any> {
    try {
      return await apiClient.getAdminDashboard();
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch admin dashboard');
    }
  }

  async getDashboardStats(): Promise<any> {
    try {
      return await apiClient.get('/analytics/dashboard');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch dashboard statistics');
    }
  }

  // =========================================================================
  // USER MANAGEMENT
  // =========================================================================

  async getAllUsers(params?: any): Promise<PaginatedResponse<User>> {
    try {
      return await apiClient.getAllUsers(params);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch users');
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      return await apiClient.get(`/users/${userId}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch user');
    }
  }

  async searchUsers(query: string, filters?: any): Promise<PaginatedResponse<User>> {
    try {
      return await apiClient.get('/users/search', {
        params: { q: query, ...filters },
      });
    } catch (error) {
      throw this.handleError(error, 'User search failed');
    }
  }

  async updateUser(userId: string, data: any): Promise<User> {
    try {
      return await apiClient.put(`/users/${userId}`, data);
    } catch (error) {
      throw this.handleError(error, 'Failed to update user');
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await apiClient.delete(`/users/${userId}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to delete user');
    }
  }

  async activateUser(userId: string): Promise<User> {
    try {
      return await apiClient.patch(`/users/${userId}/activate`, {});
    } catch (error) {
      throw this.handleError(error, 'Failed to activate user');
    }
  }

  async deactivateUser(userId: string): Promise<User> {
    try {
      return await apiClient.patch(`/users/${userId}/deactivate`, {});
    } catch (error) {
      throw this.handleError(error, 'Failed to deactivate user');
    }
  }

  async suspendUser(userId: string, reason?: string): Promise<User> {
    try {
      return await apiClient.post(`/users/${userId}/suspend`, { reason });
    } catch (error) {
      throw this.handleError(error, 'Failed to suspend user');
    }
  }

  // =========================================================================
  // VENDOR MANAGEMENT
  // =========================================================================

  async getAllVendors(params?: any): Promise<PaginatedResponse<Vendor>> {
    try {
      return await apiClient.getAllVendors(params);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch vendors');
    }
  }

  async getVendorById(vendorId: string): Promise<Vendor> {
    try {
      return await apiClient.getVendorProfile(vendorId);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch vendor');
    }
  }

  async searchVendors(query: string, filters?: any): Promise<PaginatedResponse<Vendor>> {
    try {
      return await apiClient.searchVendors(query, filters);
    } catch (error) {
      throw this.handleError(error, 'Vendor search failed');
    }
  }

  async updateVendor(vendorId: string, data: any): Promise<Vendor> {
    try {
      return await apiClient.updateVendorProfile(vendorId, data);
    } catch (error) {
      throw this.handleError(error, 'Failed to update vendor');
    }
  }

  async changeVendorType(vendorId: string, vendorType: string): Promise<Vendor> {
    try {
      return await apiClient.put(`/vendors/${vendorId}/type`, { vendorType });
    } catch (error) {
      throw this.handleError(error, 'Failed to change vendor type');
    }
  }

  async verifyVendor(vendorId: string): Promise<any> {
    try {
      return await apiClient.post(`/vendors/${vendorId}/verify`, {});
    } catch (error) {
      throw this.handleError(error, 'Failed to verify vendor');
    }
  }

  async rejectVendor(vendorId: string, reason: string): Promise<any> {
    try {
      return await apiClient.post(`/vendors/${vendorId}/reject`, { reason });
    } catch (error) {
      throw this.handleError(error, 'Failed to reject vendor');
    }
  }

  async suspendVendor(vendorId: string, reason: string): Promise<Vendor> {
    try {
      return await apiClient.post(`/vendors/${vendorId}/suspend`, { reason });
    } catch (error) {
      throw this.handleError(error, 'Failed to suspend vendor');
    }
  }

  // =========================================================================
  // BUYER MANAGEMENT
  // =========================================================================

  async getAllBuyers(params?: any): Promise<PaginatedResponse<User>> {
    try {
      return await apiClient.getAllBuyers(params);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch buyers');
    }
  }

  async getBuyerById(buyerId: string): Promise<User> {
    try {
      return await apiClient.get(`/buyers/${buyerId}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch buyer');
    }
  }

  // =========================================================================
  // PRODUCT MANAGEMENT
  // =========================================================================

  async getAllProducts(params?: any): Promise<PaginatedResponse<Product>> {
    try {
      return await apiClient.getProducts(params);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch products');
    }
  }

  async getProductById(productId: string): Promise<Product> {
    try {
      return await apiClient.getProductById(productId);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch product');
    }
  }

  async approveProduct(productId: string): Promise<Product> {
    try {
      return await apiClient.patch(`/products/${productId}/approve`, {});
    } catch (error) {
      throw this.handleError(error, 'Failed to approve product');
    }
  }

  async rejectProduct(productId: string, reason: string): Promise<any> {
    try {
      return await apiClient.post(`/products/${productId}/reject`, { reason });
    } catch (error) {
      throw this.handleError(error, 'Failed to reject product');
    }
  }

  async featureProduct(productId: string): Promise<Product> {
    try {
      return await apiClient.patch(`/products/${productId}/feature`, { isFeatured: true });
    } catch (error) {
      throw this.handleError(error, 'Failed to feature product');
    }
  }

  async unfeatureProduct(productId: string): Promise<Product> {
    try {
      return await apiClient.patch(`/products/${productId}/feature`, { isFeatured: false });
    } catch (error) {
      throw this.handleError(error, 'Failed to unfeature product');
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      await apiClient.deleteProduct(productId);
    } catch (error) {
      throw this.handleError(error, 'Failed to delete product');
    }
  }

  async getPendingProducts(): Promise<Product[]> {
    try {
      return await apiClient.get('/products/pending-approval');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch pending products');
    }
  }

  // =========================================================================
  // ORDER MANAGEMENT
  // =========================================================================

  async getAllOrders(params?: any): Promise<PaginatedResponse<Order>> {
    try {
      return await apiClient.getAllOrders(params);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch orders');
    }
  }

  async getOrderById(orderId: string): Promise<Order> {
    try {
      return await apiClient.getOrderById(orderId);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch order');
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    try {
      return await apiClient.put(`/orders/${orderId}/status`, { status });
    } catch (error) {
      throw this.handleError(error, 'Failed to update order status');
    }
  }

  // =========================================================================
  // CATEGORY MANAGEMENT
  // =========================================================================

  async getAllCategories(): Promise<any[]> {
    try {
      return await apiClient.getCategories();
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch categories');
    }
  }

  async createCategory(data: any): Promise<any> {
    try {
      return await apiClient.post('/categories', data);
    } catch (error) {
      throw this.handleError(error, 'Failed to create category');
    }
  }

  async updateCategory(categoryId: string, data: any): Promise<any> {
    try {
      return await apiClient.put(`/categories/${categoryId}`, data);
    } catch (error) {
      throw this.handleError(error, 'Failed to update category');
    }
  }

  async deleteCategory(categoryId: string): Promise<void> {
    try {
      await apiClient.delete(`/categories/${categoryId}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to delete category');
    }
  }

  // =========================================================================
  // VERIFICATION & KYC
  // =========================================================================

  async getPendingKYCDocuments(): Promise<any[]> {
    try {
      return await apiClient.get('/kyc-documents/pending');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch pending KYC documents');
    }
  }

  async approveKYCDocument(documentId: string): Promise<any> {
    try {
      return await apiClient.post(`/kyc-documents/${documentId}/approve`, {});
    } catch (error) {
      throw this.handleError(error, 'Failed to approve KYC document');
    }
  }

  async rejectKYCDocument(documentId: string, reason: string): Promise<any> {
    try {
      return await apiClient.post(`/kyc-documents/${documentId}/reject`, { reason });
    } catch (error) {
      throw this.handleError(error, 'Failed to reject KYC document');
    }
  }

  // =========================================================================
  // CONTENT MANAGEMENT
  // =========================================================================

  async manageBanners(): Promise<any[]> {
    try {
      return await apiClient.get('/banners');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch banners');
    }
  }

  async createBanner(data: any): Promise<any> {
    try {
      return await apiClient.post('/banners', data);
    } catch (error) {
      throw this.handleError(error, 'Failed to create banner');
    }
  }

  async deleteBanner(bannerId: string): Promise<void> {
    try {
      await apiClient.delete(`/banners/${bannerId}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to delete banner');
    }
  }

  // =========================================================================
  // ANALYTICS
  // =========================================================================

  async getAnalytics(type: string, params?: any): Promise<any> {
    try {
      return await apiClient.getAdminAnalytics(type, params);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch analytics');
    }
  }

  async getGrowthAnalytics(): Promise<any> {
    try {
      return await apiClient.get('/analytics/growth');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch growth analytics');
    }
  }

  async getRevenueAnalytics(): Promise<any> {
    try {
      return await apiClient.get('/analytics/revenue');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch revenue analytics');
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

export const adminService = new AdminService();
export default adminService;
