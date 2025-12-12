/**
 * Vendor Service
 * Handles all vendor related API calls
 */

import apiService from './api.service';
import API_CONFIG from '@/config/api.config';

export interface Vendor {
  id: number;
  vendorName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  isActive: boolean;
  isVerified: boolean;
  kycApproved: boolean;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVendorRequest {
  vendorName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
}

export interface UpdateVendorRequest {
  vendorName?: string;
  businessName?: string;
  businessType?: string;
  description?: string;
}

class VendorService {
  // CRUD Operations
  async createVendor(data: CreateVendorRequest) {
    return apiService.post<Vendor>(API_CONFIG.ENDPOINTS.VENDORS.CREATE_VENDOR, data);
  }

  async getVendorById(id: number) {
    return apiService.get<Vendor>(API_CONFIG.ENDPOINTS.VENDORS.GET_VENDOR_BY_ID(id));
  }

  async updateVendor(id: number, data: UpdateVendorRequest) {
    return apiService.put<Vendor>(API_CONFIG.ENDPOINTS.VENDORS.UPDATE_VENDOR(id), data);
  }

  async deleteVendor(id: number) {
    return apiService.delete(API_CONFIG.ENDPOINTS.VENDORS.DELETE_VENDOR(id));
  }

  // Listing & Search
  async getAllVendors(page = 0, size = 20, params?: any) {
    return apiService.get(API_CONFIG.ENDPOINTS.VENDORS.GET_ALL_VENDORS, {
      params: { page, size, ...params },
    });
  }

  async searchVendors(searchTerm: string, page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.VENDORS.SEARCH_VENDORS, {
      params: { searchTerm, page, size },
    });
  }

  async filterVendors(params: any) {
    return apiService.get(API_CONFIG.ENDPOINTS.VENDORS.FILTER_VENDORS, { params });
  }

  // Verification & KYC
  async verifyVendor(vendorId: number, status: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.VENDORS.VERIFY_VENDOR, {
      vendorId,
      verificationStatus: status,
    });
  }

  async submitKyc(id: number, documentUrls: string[]) {
    return apiService.post(API_CONFIG.ENDPOINTS.VENDORS.SUBMIT_KYC(id), documentUrls);
  }

  async getPendingKyc(page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.VENDORS.GET_PENDING_KYC, {
      params: { page, size },
    });
  }

  async getPendingApproval(page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.VENDORS.GET_PENDING_APPROVAL, {
      params: { page, size },
    });
  }

  async getByStatus(status: string, page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.VENDORS.GET_BY_STATUS(status), {
      params: { page, size },
    });
  }

  // Status Management
  async updateStatus(id: number, status: string) {
    return apiService.patch(API_CONFIG.ENDPOINTS.VENDORS.UPDATE_STATUS(id), null, {
      params: { status },
    });
  }

  async activateVendor(id: number) {
    return apiService.post(API_CONFIG.ENDPOINTS.VENDORS.ACTIVATE_VENDOR(id), {});
  }

  async deactivateVendor(id: number) {
    return apiService.post(API_CONFIG.ENDPOINTS.VENDORS.DEACTIVATE_VENDOR(id), {});
  }

  async suspendVendor(id: number, reason: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.VENDORS.SUSPEND_VENDOR(id), null, {
      params: { reason },
    });
  }

  // Statistics
  async getStatistics() {
    return apiService.get(API_CONFIG.ENDPOINTS.VENDORS.GET_STATISTICS);
  }

  async getTotalCount() {
    return apiService.get(API_CONFIG.ENDPOINTS.VENDORS.GET_TOTAL_COUNT);
  }

  async getActiveCount() {
    return apiService.get(API_CONFIG.ENDPOINTS.VENDORS.GET_ACTIVE_COUNT);
  }

  async getVerifiedCount() {
    return apiService.get(API_CONFIG.ENDPOINTS.VENDORS.GET_VERIFIED_COUNT);
  }

  async getTopPerforming(page = 0, size = 10) {
    return apiService.get(API_CONFIG.ENDPOINTS.VENDORS.GET_TOP_PERFORMING, {
      params: { page, size },
    });
  }

  async getFeaturedVendors(page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.VENDORS.GET_FEATURED_VENDORS, {
      params: { page, size },
    });
  }

  async getRecentVendors(page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.VENDORS.GET_RECENT_VENDORS, {
      params: { page, size },
    });
  }
}

export default new VendorService();
