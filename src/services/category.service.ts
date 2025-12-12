/**
 * Category Service
 * Handles all product category related API calls
 */

import apiService from './api.service';
import API_CONFIG from '@/config/api.config';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  parentId?: number;
  isActive: boolean;
  displayOrder: number;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description: string;
  image: string;
  icon?: string;
  parentId?: number;
  displayOrder?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  icon?: string;
  parentId?: number;
  displayOrder?: number;
  isActive?: boolean;
}

class CategoryService {
  async createCategory(data: CreateCategoryRequest) {
    return apiService.post<Category>(API_CONFIG.ENDPOINTS.CATEGORIES.CREATE_CATEGORY, data);
  }

  async getCategoryById(id: number) {
    return apiService.get<Category>(API_CONFIG.ENDPOINTS.CATEGORIES.GET_CATEGORY_BY_ID(id));
  }

  async getCategoryBySlug(slug: string) {
    return apiService.get<Category>(API_CONFIG.ENDPOINTS.CATEGORIES.GET_CATEGORY_BY_SLUG(slug));
  }

  async updateCategory(id: number, data: UpdateCategoryRequest) {
    return apiService.put<Category>(API_CONFIG.ENDPOINTS.CATEGORIES.UPDATE_CATEGORY(id), data);
  }

  async deleteCategory(id: number) {
    return apiService.delete(API_CONFIG.ENDPOINTS.CATEGORIES.DELETE_CATEGORY(id));
  }

  async getAllCategories(page = 0, size = 100) {
    return apiService.get(API_CONFIG.ENDPOINTS.CATEGORIES.GET_ALL_CATEGORIES, {
      params: { page, size },
    });
  }

  async getActiveCategories(page = 0, size = 100) {
    return apiService.get(API_CONFIG.ENDPOINTS.CATEGORIES.GET_ACTIVE_CATEGORIES, {
      params: { page, size },
    });
  }

  async getCategoriesWithProducts(page = 0, size = 100) {
    return apiService.get(API_CONFIG.ENDPOINTS.CATEGORIES.GET_CATEGORIES_WITH_PRODUCTS, {
      params: { page, size },
    });
  }

  async getParentCategories() {
    return apiService.get(API_CONFIG.ENDPOINTS.CATEGORIES.GET_PARENT_CATEGORIES);
  }

  async getSubCategories(parentId: number) {
    return apiService.get(API_CONFIG.ENDPOINTS.CATEGORIES.GET_SUBCATEGORIES(parentId));
  }

  async getCategoryTree() {
    return apiService.get(API_CONFIG.ENDPOINTS.CATEGORIES.GET_CATEGORY_TREE);
  }

  async searchCategories(searchTerm: string, page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.CATEGORIES.SEARCH_CATEGORIES, {
      params: { searchTerm, page, size },
    });
  }

  async filterCategories(params: any) {
    return apiService.get(API_CONFIG.ENDPOINTS.CATEGORIES.FILTER_CATEGORIES, { params });
  }

  async getCategoryStatistics() {
    return apiService.get(API_CONFIG.ENDPOINTS.CATEGORIES.GET_STATISTICS);
  }

  async getTotalCategories() {
    return apiService.get(API_CONFIG.ENDPOINTS.CATEGORIES.GET_TOTAL_COUNT);
  }

  async getTrendingCategories(limit = 10) {
    return apiService.get(API_CONFIG.ENDPOINTS.CATEGORIES.GET_TRENDING_CATEGORIES, {
      params: { limit },
    });
  }

  async getTopCategories(limit = 10) {
    return apiService.get(API_CONFIG.ENDPOINTS.CATEGORIES.GET_TOP_CATEGORIES, {
      params: { limit },
    });
  }

  async reorderCategories(categoryIds: number[]) {
    return apiService.post(API_CONFIG.ENDPOINTS.CATEGORIES.REORDER_CATEGORIES, {
      categoryIds,
    });
  }

  async bulkUpdateCategories(updates: Array<{ id: number; data: UpdateCategoryRequest }>) {
    return apiService.post(API_CONFIG.ENDPOINTS.CATEGORIES.BULK_UPDATE_CATEGORIES, updates);
  }

  async bulkActivateCategories(categoryIds: number[]) {
    return apiService.post(API_CONFIG.ENDPOINTS.CATEGORIES.BULK_ACTIVATE_CATEGORIES, {
      categoryIds,
    });
  }

  async bulkDeactivateCategories(categoryIds: number[]) {
    return apiService.post(API_CONFIG.ENDPOINTS.CATEGORIES.BULK_DEACTIVATE_CATEGORIES, {
      categoryIds,
    });
  }

  async bulkDeleteCategories(categoryIds: number[]) {
    return apiService.post(API_CONFIG.ENDPOINTS.CATEGORIES.BULK_DELETE_CATEGORIES, {
      categoryIds,
    });
  }

  async exportCategories(format: 'csv' | 'pdf') {
    return apiService.get(API_CONFIG.ENDPOINTS.CATEGORIES.EXPORT_CATEGORIES, {
      params: { format },
      responseType: format === 'pdf' ? 'blob' : 'text',
    });
  }

  async importCategories(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return apiService.post(API_CONFIG.ENDPOINTS.CATEGORIES.IMPORT_CATEGORIES, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}

export default new CategoryService();
