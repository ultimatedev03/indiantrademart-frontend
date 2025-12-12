/**
 * Coupon Service
 * Handles all coupon and promotional code related API calls
 */

import apiService from './api.service';
import API_CONFIG from '@/config/api.config';

export interface Coupon {
  id: number;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  applicableTo: 'all' | 'specific_products' | 'specific_categories';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponRequest {
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  applicableTo: 'all' | 'specific_products' | 'specific_categories';
  applicableIds?: number[];
}

export interface UpdateCouponRequest {
  description?: string;
  value?: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  isActive?: boolean;
}

class CouponService {
  async createCoupon(data: CreateCouponRequest) {
    return apiService.post<Coupon>(API_CONFIG.ENDPOINTS.COUPONS.CREATE_COUPON, data);
  }

  async getCouponById(id: number) {
    return apiService.get<Coupon>(API_CONFIG.ENDPOINTS.COUPONS.GET_COUPON_BY_ID(id));
  }

  async getCouponByCode(code: string) {
    return apiService.get<Coupon>(API_CONFIG.ENDPOINTS.COUPONS.GET_COUPON_BY_CODE(code));
  }

  async updateCoupon(id: number, data: UpdateCouponRequest) {
    return apiService.put<Coupon>(API_CONFIG.ENDPOINTS.COUPONS.UPDATE_COUPON(id), data);
  }

  async deleteCoupon(id: number) {
    return apiService.delete(API_CONFIG.ENDPOINTS.COUPONS.DELETE_COUPON(id));
  }

  async getAllCoupons(page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.COUPONS.GET_ALL_COUPONS, {
      params: { page, size },
    });
  }

  async getActiveCoupons(page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.COUPONS.GET_ACTIVE_COUPONS, {
      params: { page, size },
    });
  }

  async getExpiredCoupons(page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.COUPONS.GET_EXPIRED_COUPONS, {
      params: { page, size },
    });
  }

  async getCouponsByStatus(status: string, page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.COUPONS.GET_BY_STATUS(status), {
      params: { page, size },
    });
  }

  async validateCoupon(code: string, cartValue?: number) {
    return apiService.post(API_CONFIG.ENDPOINTS.COUPONS.VALIDATE_COUPON, {
      code,
      cartValue,
    });
  }

  async applyCoupon(code: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.COUPONS.APPLY_COUPON, { code });
  }

  async removeCoupon(code: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.COUPONS.REMOVE_COUPON, { code });
  }

  async searchCoupons(searchTerm: string, page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.COUPONS.SEARCH_COUPONS, {
      params: { searchTerm, page, size },
    });
  }

  async filterCoupons(params: any) {
    return apiService.get(API_CONFIG.ENDPOINTS.COUPONS.FILTER_COUPONS, { params });
  }

  async getCouponStatistics() {
    return apiService.get(API_CONFIG.ENDPOINTS.COUPONS.GET_STATISTICS);
  }

  async getTotalCoupons() {
    return apiService.get(API_CONFIG.ENDPOINTS.COUPONS.GET_TOTAL_COUNT);
  }

  async getTopCoupons(limit = 10) {
    return apiService.get(API_CONFIG.ENDPOINTS.COUPONS.GET_TOP_COUPONS, {
      params: { limit },
    });
  }

  async getMostUsedCoupons(limit = 10) {
    return apiService.get(API_CONFIG.ENDPOINTS.COUPONS.GET_MOST_USED_COUPONS, {
      params: { limit },
    });
  }

  async getTotalSavings() {
    return apiService.get(API_CONFIG.ENDPOINTS.COUPONS.GET_TOTAL_SAVINGS);
  }

  async getSavingsByDateRange(startDate: string, endDate: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.COUPONS.GET_SAVINGS_BY_DATE_RANGE, {
      params: { startDate, endDate },
    });
  }

  async bulkCreateCoupons(coupons: CreateCouponRequest[]) {
    return apiService.post(API_CONFIG.ENDPOINTS.COUPONS.BULK_CREATE_COUPONS, coupons);
  }

  async bulkUpdateCoupons(updates: Array<{ id: number; data: UpdateCouponRequest }>) {
    return apiService.post(API_CONFIG.ENDPOINTS.COUPONS.BULK_UPDATE_COUPONS, updates);
  }

  async bulkActivateCoupons(couponIds: number[]) {
    return apiService.post(API_CONFIG.ENDPOINTS.COUPONS.BULK_ACTIVATE_COUPONS, {
      couponIds,
    });
  }

  async bulkDeactivateCoupons(couponIds: number[]) {
    return apiService.post(API_CONFIG.ENDPOINTS.COUPONS.BULK_DEACTIVATE_COUPONS, {
      couponIds,
    });
  }

  async bulkDeleteCoupons(couponIds: number[]) {
    return apiService.post(API_CONFIG.ENDPOINTS.COUPONS.BULK_DELETE_COUPONS, {
      couponIds,
    });
  }

  async exportCoupons(format: 'csv' | 'pdf') {
    return apiService.get(API_CONFIG.ENDPOINTS.COUPONS.EXPORT_COUPONS, {
      params: { format },
      responseType: format === 'pdf' ? 'blob' : 'text',
    });
  }

  async importCoupons(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return apiService.post(API_CONFIG.ENDPOINTS.COUPONS.IMPORT_COUPONS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}

export default new CouponService();
