// =============================================================================
// Product Service Layer
// =============================================================================
// Handles product operations: search, browse, CRUD, media uploads

import { apiClient } from '../api-client';
import {
  Product,
  Category,
  ProductDetailed,
  ProductSearchFilters,
  PaginatedResponse,
} from '../types/api-types';

class ProductService {
  // =========================================================================
  // PRODUCT BROWSING & SEARCH
  // =========================================================================

  async getProducts(filters?: {
    page?: number;
    size?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<PaginatedResponse<Product>> {
    try {
      return await apiClient.getProducts(filters);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch products');
    }
  }

  async searchProducts(query: string, filters?: any): Promise<PaginatedResponse<Product>> {
    try {
      return await apiClient.searchProducts(query, filters);
    } catch (error) {
      throw this.handleError(error, 'Product search failed');
    }
  }

  async getProductById(id: string): Promise<ProductDetailed> {
    try {
      return await apiClient.getProductById(id);
    } catch (error) {
      throw this.handleError(error, `Failed to fetch product ${id}`);
    }
  }

  async getProductsByCategory(
    categoryId: string,
    params?: any
  ): Promise<PaginatedResponse<Product>> {
    try {
      return await apiClient.getProductsByCategory(categoryId, params);
    } catch (error) {
      throw this.handleError(error, `Failed to fetch products for category ${categoryId}`);
    }
  }

  async getProductsByVendor(
    vendorId: string,
    params?: any
  ): Promise<PaginatedResponse<Product>> {
    try {
      return await apiClient.getProductsByVendor(vendorId, params);
    } catch (error) {
      throw this.handleError(error, `Failed to fetch products for vendor ${vendorId}`);
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      return await apiClient.getFeaturedProducts();
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch featured products');
    }
  }

  async getSimilarProducts(productId: string): Promise<Product[]> {
    try {
      return await apiClient.get(`/products/similar/${productId}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch similar products');
    }
  }

  // =========================================================================
  // PRODUCT CRUD (Vendor)
  // =========================================================================

  async createProduct(data: any): Promise<Product> {
    try {
      return await apiClient.createProduct(data);
    } catch (error) {
      throw this.handleError(error, 'Product creation failed');
    }
  }

  async updateProduct(id: string, data: any): Promise<Product> {
    try {
      return await apiClient.updateProduct(id, data);
    } catch (error) {
      throw this.handleError(error, 'Product update failed');
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await apiClient.deleteProduct(id);
    } catch (error) {
      throw this.handleError(error, 'Product deletion failed');
    }
  }

  async bulkImportProducts(file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      return await apiClient.post('/products/bulk-import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      throw this.handleError(error, 'Bulk import failed');
    }
  }

  // =========================================================================
  // PRODUCT MEDIA
  // =========================================================================

  async uploadProductImages(productId: string, files: File[]): Promise<any> {
    try {
      return await apiClient.uploadProductImages(productId, files);
    } catch (error) {
      throw this.handleError(error, 'Image upload failed');
    }
  }

  async uploadProductVideo(productId: string, data: any): Promise<any> {
    try {
      return await apiClient.post(`/products/${productId}/videos`, data);
    } catch (error) {
      throw this.handleError(error, 'Video upload failed');
    }
  }

  // =========================================================================
  // PRODUCT STATUS
  // =========================================================================

  async approveProduct(productId: string): Promise<Product> {
    try {
      return await apiClient.patch(`/products/${productId}/approve`, {});
    } catch (error) {
      throw this.handleError(error, 'Product approval failed');
    }
  }

  async featureProduct(productId: string, isFeatured: boolean): Promise<Product> {
    try {
      return await apiClient.patch(`/products/${productId}/feature`, { isFeatured });
    } catch (error) {
      throw this.handleError(error, 'Failed to update product feature status');
    }
  }

  async changeProductStatus(
    productId: string,
    status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'ARCHIVED'
  ): Promise<Product> {
    try {
      return await apiClient.patch(`/products/${productId}/status`, { status });
    } catch (error) {
      throw this.handleError(error, 'Failed to update product status');
    }
  }

  // =========================================================================
  // CATEGORIES
  // =========================================================================

  async getCategories(): Promise<Category[]> {
    try {
      return await apiClient.getCategories();
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch categories');
    }
  }

  async getCategoryHierarchy(): Promise<any> {
    try {
      return await apiClient.getCategoryHierarchy();
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch category hierarchy');
    }
  }

  async getSubCategories(categoryId: string): Promise<Category[]> {
    try {
      return await apiClient.getSubCategories(categoryId);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch sub-categories');
    }
  }

  async getMicroCategories(subCategoryId: string): Promise<Category[]> {
    try {
      return await apiClient.get(`/categories/microcategories/${subCategoryId}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch micro-categories');
    }
  }

  async getCategoryById(categoryId: string): Promise<Category> {
    try {
      return await apiClient.get(`/categories/${categoryId}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch category');
    }
  }

  // =========================================================================
  // REVIEWS & RATINGS
  // =========================================================================

  async getProductReviews(
    productId: string,
    params?: { page?: number; size?: number }
  ): Promise<any> {
    try {
      return await apiClient.get(`/reviews/product/${productId}`, { params });
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch reviews');
    }
  }

  async submitReview(productId: string, data: any): Promise<any> {
    try {
      return await apiClient.post('/reviews/product', {
        productId,
        ...data,
      });
    } catch (error) {
      throw this.handleError(error, 'Review submission failed');
    }
  }

  // =========================================================================
  // PRODUCT ANALYTICS (Vendor)
  // =========================================================================

  async getProductAnalytics(productId: string): Promise<any> {
    try {
      return await apiClient.get(`/analytics/product/${productId}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch product analytics');
    }
  }

  async trackProductView(productId: string): Promise<void> {
    try {
      await apiClient.post(`/products/track-view/${productId}`, {});
    } catch (error) {
      // Silently fail for tracking
      console.warn('Failed to track product view');
    }
  }

  // =========================================================================
  // PRODUCT EXPORT & IMPORT
  // =========================================================================

  async exportProducts(format: 'CSV' | 'EXCEL' = 'EXCEL'): Promise<Blob> {
    try {
      const response = await apiClient.getAxiosInstance().get('/products/export', {
        params: { format },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Product export failed');
    }
  }

  async getProductTemplate(): Promise<Blob> {
    try {
      const response = await apiClient.getAxiosInstance().get('/products/template', {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to download product template');
    }
  }

  // =========================================================================
  // PRODUCT INVENTORY
  // =========================================================================

  async updateProductInventory(productId: string, quantity: number): Promise<Product> {
    try {
      return await apiClient.put(`/products/${productId}/inventory`, { quantity });
    } catch (error) {
      throw this.handleError(error, 'Inventory update failed');
    }
  }

  async getInventoryStatus(productId: string): Promise<any> {
    try {
      return await apiClient.get(`/products/${productId}/inventory`);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch inventory status');
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

export const productService = new ProductService();
export default productService;
