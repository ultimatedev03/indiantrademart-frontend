/**
 * Product Service
 * Handles all product related API calls
 */

import apiService from './api.service';
import API_CONFIG from '@/config/api.config';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  images: string[];
  vendorId: number;
  isActive: boolean;
  isFeatured: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  subCategory?: string;
  microCategory?: string;
}

class ProductService {
  // Get Products
  async getAllProducts(page = 0, size = 12, params?: any) {
    return apiService.get(API_CONFIG.ENDPOINTS.PRODUCTS.GET_ALL_PRODUCTS, {
      params: { page, size, ...params },
    });
  }

  async getProductById(id: number) {
    return apiService.get<Product>(API_CONFIG.ENDPOINTS.PRODUCTS.GET_PRODUCT_BY_ID(id));
  }

  async searchProducts(query: string, params?: any) {
    return apiService.get(API_CONFIG.ENDPOINTS.PRODUCTS.SEARCH_PRODUCTS, {
      params: { query, ...params },
    });
  }

  async getSearchSuggestions(query: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.PRODUCTS.GET_SEARCH_SUGGESTIONS, {
      params: { query },
    });
  }

  async getProductsByCategory(categoryId: number, page = 0, size = 12) {
    return apiService.get(API_CONFIG.ENDPOINTS.PRODUCTS.GET_PRODUCTS_BY_CATEGORY(categoryId), {
      params: { page, size },
    });
  }

  async getProductsByVendor(vendorId: number, page = 0, size = 12) {
    return apiService.get(API_CONFIG.ENDPOINTS.PRODUCTS.GET_PRODUCTS_BY_VENDOR(vendorId), {
      params: { page, size },
    });
  }

  async getFeaturedProducts(limit = 8) {
    return apiService.get(API_CONFIG.ENDPOINTS.PRODUCTS.GET_FEATURED_PRODUCTS, {
      params: { limit },
    });
  }

  async getFilteredProducts(params: any) {
    return apiService.get(API_CONFIG.ENDPOINTS.PRODUCTS.GET_FILTERED_PRODUCTS, {
      params,
    });
  }

  // Create/Update Products
  async createProduct(data: CreateProductRequest) {
    return apiService.post<Product>(API_CONFIG.ENDPOINTS.PRODUCTS.ADD_PRODUCT, data);
  }

  async createProductVendor(data: CreateProductRequest) {
    return apiService.post<Product>(API_CONFIG.ENDPOINTS.PRODUCTS.ADD_PRODUCT_VENDOR, data);
  }

  async updateProduct(id: number, data: Partial<CreateProductRequest>) {
    return apiService.put<Product>(API_CONFIG.ENDPOINTS.PRODUCTS.UPDATE_PRODUCT(id), data);
  }

  async deleteProduct(id: number) {
    return apiService.delete(API_CONFIG.ENDPOINTS.PRODUCTS.DELETE_PRODUCT(id));
  }

  // Image Management
  async uploadProductImages(id: number, files: File[]) {
    return apiService.uploadFiles(API_CONFIG.ENDPOINTS.PRODUCTS.UPLOAD_PRODUCT_IMAGES(id), files);
  }

  async updateProductImages(id: number, files: File[]) {
    return apiService.uploadFiles(API_CONFIG.ENDPOINTS.PRODUCTS.UPDATE_PRODUCT_IMAGES(id), files);
  }

  // Vendor Products
  async getVendorProducts(page = 0, size = 12) {
    return apiService.get(API_CONFIG.ENDPOINTS.PRODUCTS.GET_VENDOR_PRODUCTS, {
      params: { page, size },
    });
  }

  // Status Management
  async updateProductStatus(id: number, isActive: boolean) {
    return apiService.patch(API_CONFIG.ENDPOINTS.PRODUCTS.UPDATE_PRODUCT_STATUS(id), null, {
      params: { isActive },
    });
  }

  // Admin Operations
  async approveProduct(id: number) {
    return apiService.patch(API_CONFIG.ENDPOINTS.PRODUCTS.APPROVE_PRODUCT(id));
  }

  async featureProduct(id: number, featured: boolean) {
    return apiService.patch(API_CONFIG.ENDPOINTS.PRODUCTS.FEATURE_PRODUCT(id), null, {
      params: { featured },
    });
  }

  async getPendingApprovalProducts(page = 0, size = 12) {
    return apiService.get(API_CONFIG.ENDPOINTS.PRODUCTS.GET_PENDING_APPROVAL_PRODUCTS, {
      params: { page, size },
    });
  }

  // Data Entry
  async dataEntryAddProduct(data: CreateProductRequest) {
    return apiService.post(API_CONFIG.ENDPOINTS.PRODUCTS.DATA_ENTRY_ADD_PRODUCT, data);
  }
}

export default new ProductService();
