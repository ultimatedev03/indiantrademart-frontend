import apiService from './api.service';
import API_CONFIG from '@/config/api.config';

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  pendingApprovals: number;
  activeVendors: number;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
}

class AdminService {
  async getAdminDashboard() {
    return apiService.get('/api/admin/dashboard');
  }

  async getStats() {
    return apiService.get('/api/admin/stats');
  }

  async getAllUsers(page = 0, size = 20, params?: any) {
    return apiService.get('/api/admin/users', {
      params: { page, size, ...params },
    });
  }

  async getUserById(userId: number | string) {
    return apiService.get(`/api/admin/users/${userId}`);
  }

  async activateUser(userId: number | string) {
    return apiService.post(`/api/admin/users/${userId}/activate`, {});
  }

  async deactivateUser(userId: number | string, reason?: string) {
    return apiService.post(`/api/admin/users/${userId}/deactivate`, { reason });
  }

  async getAllVendors(page = 0, size = 20, params?: any) {
    return apiService.get('/api/admin/vendors', {
      params: { page, size, ...params },
    });
  }

  async approveVendor(vendorId: number | string, reason?: string) {
    return apiService.put(`/api/admin/vendors/${vendorId}/approve`, { reason });
  }

  async rejectVendor(vendorId: number | string, reason: string) {
    return apiService.put(`/api/admin/vendors/${vendorId}/reject`, { reason });
  }

  async getAllProducts(page = 0, size = 20, params?: any) {
    return apiService.get('/api/admin/products', {
      params: { page, size, ...params },
    });
  }

  async approveProduct(productId: number | string) {
    return apiService.put(`/api/admin/products/${productId}/approve`, {});
  }

  async rejectProduct(productId: number | string, reason: string) {
    return apiService.put(`/api/admin/products/${productId}/reject`, {
      reason,
    });
  }

  async deleteProduct(productId: number | string) {
    return apiService.delete(`/api/admin/products/${productId}`);
  }

  async getPendingApprovalProducts(page = 0, size = 20) {
    return apiService.get('/api/admin/products', {
      params: { page, size, status: 'pending' },
    });
  }

  async getAnalytics() {
    return apiService.get('/api/admin/analytics');
  }

  async getUserAnalytics() {
    return apiService.get('/api/admin/analytics/users');
  }

  async getProductAnalytics() {
    return apiService.get('/api/admin/analytics/products');
  }

  async getOrderAnalytics() {
    return apiService.get('/api/admin/analytics/orders');
  }

  async getRevenueAnalytics() {
    return apiService.get('/api/admin/analytics/revenue');
  }

  async addCategory(data: any) {
    return apiService.post('/api/categories', data);
  }

  async updateCategory(categoryId: number | string, data: any) {
    return apiService.put(`/api/categories/${categoryId}`, data);
  }

  async deleteCategory(categoryId: number | string) {
    return apiService.delete(`/api/categories/${categoryId}`);
  }

  async getConfig() {
    return apiService.get('/api/admin/config');
  }

  async updateConfig(data: any) {
    return apiService.put('/api/admin/config', data);
  }
}

const adminService = new AdminService();
export default adminService;
