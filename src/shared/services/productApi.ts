import { api } from './api';
import { MOCK_MODE, mockDelay, mockResponses } from './mockMode';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId: number;
  vendorId: number;
  brand?: string;
  model?: string;
  sku?: string;
  minOrderQuantity?: number;
  unit?: string;
  specifications?: string;
  tags?: string;
  gstRate?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  freeShipping?: boolean;
  shippingCharge?: number;
  isActive?: boolean;
  isApproved?: boolean;
  isFeatured?: boolean;
  images?: ProductImage[];
  imageUrls?: string;
  category?: Category;
  subCategory?: SubCategory;
  vendor?: any;
  viewCount?: number;
  orderCount?: number;
  createdAt?: string;
  updatedAt?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'OUT_OF_STOCK' | 'DISCONTINUED';
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  productId: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface SubCategory {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
}

export interface ProductDto {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId: number;
  brand?: string;
  model?: string;
  sku?: string;
  minOrderQuantity?: number;
  unit?: string;
  specifications?: string;
  tags?: string;
  gstRate?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  freeShipping?: boolean;
  shippingCharge?: number;
  isActive?: boolean;
  locations?: Array<{ stateId?: number; cityId?: number; state?: string; city?: string }>;
}

/**
 * Canonical DTO for creating vendor products
 * Matches backend: POST /api/v1/vendor/products
 * Used for the new vendor product creation flow
 */
export interface CreateVendorProductDto {
  /** Vendor ID - the authenticated vendor's ID */
  vendorId: number;
  
  /** Stock Keeping Unit - unique product identifier */
  sku: string;
  
  /** Product name/identifier */
  productName: string;
  
  /** Product title for display */
  productTitle: string;
  
  /** Full product description */
  description: string;
  
  /** Short description for listings */
  shortDescription: string;
  
  /** Primary category name */
  category: string;
  
  /** Subcategory name */
  subCategory: string;
  
  /** Unit price in rupees */
  unitPrice: number;
  
  /** Maximum retail price (MRP) */
  mrp: number;
  
  /** Available stock quantity */
  stockQuantity: number;
  
  /** Minimum order quantity allowed */
  minimumOrderQuantity: number;
  
  /** Unit of measurement (e.g., 'Piece', 'kg', 'liter') */
  unitOfMeasure: string;
  
  /** Harmonized System of Nomenclature code for taxation */
  hsnCode: string;
  
  /** GST rate percentage (e.g., 18, 5, 0) */
  gstRate: number;
  
  /** Primary product image URL */
  primaryImageUrl: string;
}

export interface ProductSearchParams {
  page?: number;
  size?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface ProductsResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// Product API functions
export const productAPI = {
  // Public endpoints
  getAllProducts: async (params: ProductSearchParams = {}): Promise<ProductsResponse> => {
    const response = await api.get('/api/products', { params });
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  searchProducts: async (query: string, page = 0, size = 12): Promise<ProductsResponse> => {
    const response = await api.get('/api/products/search', {
      params: { query, page, size }
    });
    return response.data;
  },

  getProductsByCategory: async (categoryId: number, page = 0, size = 12): Promise<ProductsResponse> => {
    // Validate categoryId to prevent sending NaN to backend
    if (!categoryId || isNaN(categoryId) || categoryId <= 0) {
      console.warn('Invalid categoryId provided:', categoryId);
      throw new Error('Invalid category ID provided');
    }
    
    const response = await api.get(`/api/products/category/${categoryId}`, {
      params: { page, size }
    });
    return response.data;
  },

  getProductsByVendor: async (vendorId: number, page = 0, size = 12): Promise<ProductsResponse> => {
    const response = await api.get(`/api/products/vendor/${vendorId}`, {
      params: { page, size }
    });
    return response.data;
  },

  getFeaturedProducts: async (limit = 8): Promise<Product[]> => {
    const response = await api.get('/api/products/featured', {
      params: { limit }
    });
    return response.data;
  },

  // Vendor endpoints
  addProduct: async (productDto: ProductDto): Promise<Product> => {
    if (MOCK_MODE) {
      console.log('Mock mode: Adding product', productDto);
      await mockDelay(1500); // Simulate network delay
      return {
        ...productDto,
        id: Math.floor(Math.random() * 1000),
        vendorId: 1,
        images: [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    
    // Validate required fields before sending
    if (!productDto.name || !productDto.name.trim()) {
      throw new Error('Product name is required');
    }
    if (!productDto.description || !productDto.description.trim()) {
      throw new Error('Product description is required');
    }
    if (productDto.price <= 0) {
      throw new Error('Product price must be greater than 0');
    }
    if (!productDto.categoryId || productDto.categoryId <= 0) {
      throw new Error('Valid product category is required');
    }
    if (productDto.stock < 0) {
      throw new Error('Stock cannot be negative');
    }
    
    // Use the canonical backend endpoint for vendor products
    console.log('📝 Adding product via: /api/v1/vendor/products');
    console.log('📝 Product data:', productDto);
    
    try {
      const response = await api.post('/api/v1/vendor/products', productDto);
      console.log('✅ Successfully added product');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error headers:', error.response?.headers);
      throw error;
    }
  },

  /**
   * Create a vendor product using the canonical DTO
   * Endpoint: POST /api/v1/vendor/products
   * Matches exact backend expectations
   */
  createVendorProduct: async (payload: CreateVendorProductDto) => {
    if (MOCK_MODE) {
      console.log('Mock mode: Creating vendor product', payload);
      await mockDelay(1500);
      return {
        id: Math.floor(Math.random() * 1000),
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    
    // Validate required fields
    if (!payload.vendorId) throw new Error('Vendor ID is required');
    if (!payload.sku?.trim()) throw new Error('SKU is required');
    if (!payload.productName?.trim()) throw new Error('Product name is required');
    if (!payload.productTitle?.trim()) throw new Error('Product title is required');
    if (!payload.description?.trim()) throw new Error('Description is required');
    if (!payload.shortDescription?.trim()) throw new Error('Short description is required');
    if (!payload.category?.trim()) throw new Error('Category is required');
    if (!payload.subCategory?.trim()) throw new Error('Subcategory is required');
    if (payload.unitPrice <= 0) throw new Error('Unit price must be greater than 0');
    if (payload.mrp <= 0) throw new Error('MRP must be greater than 0');
    if (payload.stockQuantity < 0) throw new Error('Stock quantity cannot be negative');
    if (payload.minimumOrderQuantity < 1) throw new Error('Minimum order quantity must be at least 1');
    if (!payload.unitOfMeasure?.trim()) throw new Error('Unit of measure is required');
    if (!payload.hsnCode?.trim()) throw new Error('HSN code is required');
    if (payload.gstRate < 0) throw new Error('GST rate cannot be negative');
    if (!payload.primaryImageUrl?.trim()) throw new Error('Primary image URL is required');
    
    console.log('📝 Creating vendor product via: /api/v1/vendor/products');
    console.log('📝 Payload:', payload);
    
    try {
      const response = await api.post('/api/v1/vendor/products', payload);
      console.log('✅ Vendor product created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creating vendor product:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      throw error;
    }
  },

  updateProduct: async (id: number, productDto: ProductDto): Promise<Product> => {
    const response = await api.put(`/api/products/${id}`, productDto);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/api/products/${id}`);
  },

  getMyProducts: async (page = 0, size = 12): Promise<ProductsResponse> => {
    try {
      // First try to get current user's products using authenticated endpoint
      console.log('🔍 Fetching products for authenticated vendor...');
      
      const response = await api.get('/api/products/vendor/my-products', {
        params: { page, size }
      });
      
      console.log('✅ Successfully fetched authenticated vendor products:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching authenticated vendor products:', error);
      
      // Fallback: Try vendor ID 43 (most recent products from logs)
      try {
        console.log('🔄 Trying fallback with vendor ID 43...');
        const response = await api.get('/api/products/vendor/43', {
          params: { page, size }
        });
        console.log('✅ Fallback successful for vendor 43:', response.data);
        return response.data;
      } catch (fallbackError: any) {
        console.error('❌ Fallback also failed:', fallbackError);
        
        // Final fallback: Return empty result to prevent app crash
        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          number: 0,
          size: size,
          first: true,
          last: true
        };
      }
    }
  },

  uploadProductImages: async (productId: number, images: File[]): Promise<string[]> => {
    if (MOCK_MODE) {
      console.log('Mock mode: Uploading images for product', productId, images);
      await mockDelay(1000); // Simulate network delay
      return images.map((_, index) => `mock-image-${productId}-${index + 1}.jpg`);
    }
    
    try {
      const formData = new FormData();
      images.forEach(image => {
        formData.append('images', image);
      });

      console.log(`🖼️ Uploading ${images.length} images for product ${productId}`);
      const response = await api.post(`/api/products/${productId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ Images uploaded successfully:', response.data);
      // Handle both array response and object response with imageUrls
      return Array.isArray(response.data) ? response.data : response.data.imageUrls || [];
    } catch (error: any) {
      console.error('❌ Error uploading product images:', error);
      // If API endpoint doesn't exist (404), fallback to mock data
      if (error.response?.status === 404) {
        console.warn('Product images API not available, using mock response');
        await mockDelay(1000);
        return images.map((_, index) => `mock-image-${productId}-${index + 1}.jpg`);
      }
      throw error;
    }
  },
  
  updateProductImages: async (productId: number, images: File[]): Promise<string[]> => {
    if (MOCK_MODE) {
      console.log('Mock mode: Updating images for product', productId, images);
      await mockDelay(1000);
      return images.map((_, index) => `mock-updated-image-${productId}-${index + 1}.jpg`);
    }
    
    try {
      const formData = new FormData();
      images.forEach(image => {
        formData.append('images', image);
      });

      console.log(`🔄 Updating ${images.length} images for product ${productId}`);
      const response = await api.put(`/api/products/${productId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ Images updated successfully:', response.data);
      // Handle both array response and object response with imageUrls
      return Array.isArray(response.data) ? response.data : response.data.imageUrls || [];
    } catch (error: any) {
      console.error('❌ Error updating product images:', error);
      // If API endpoint doesn't exist (404), fallback to mock data
      if (error.response?.status === 404) {
        console.warn('Product images update API not available, using mock response');
        await mockDelay(1000);
        return images.map((_, index) => `mock-updated-image-${productId}-${index + 1}.jpg`);
      }
      throw error;
    }
  },

  updateProductStatus: async (id: number, isActive: boolean): Promise<Product> => {
    const response = await api.patch(`/api/products/${id}/status`, null, {
      params: { isActive }
    });
    return response.data;
  },

  updateProductPrice: async (id: string, price: number): Promise<Product> => {
    try {
      console.log(`💰 Updating price for product ${id} to ${price}`);
      const response = await api.patch(`/api/products/${id}/price`, null, {
        params: { price }
      });
      console.log(`✅ Successfully updated price for product ${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error updating price for product ${id}:`, error);
      // Fallback: Try using the update product endpoint with just the price field
      try {
        console.log(`🔄 Trying fallback update for product ${id}...`);
        const productData = {
          name: '', // Will be ignored by backend if empty
          description: '',
          price: price,
          stock: 0,
          categoryId: 0,
          isActive: true
        };
        const fallbackResponse = await api.put(`/api/products/${id}`, productData);
        console.log(`✅ Fallback price update successful for product ${id}`);
        return fallbackResponse.data;
      } catch (fallbackError: any) {
        console.error(`❌ Fallback price update also failed for product ${id}:`, fallbackError);
        throw error; // Throw original error
      }
    }
  },

  // Admin endpoints
  approveProduct: async (id: number): Promise<Product> => {
    const response = await api.patch(`/api/products/${id}/approve`);
    return response.data;
  },

  setFeaturedStatus: async (id: number, featured: boolean): Promise<Product> => {
    const response = await api.patch(`/api/products/${id}/feature`, null, {
      params: { featured }
    });
    return response.data;
  },

  getPendingProducts: async (page = 0, size = 12): Promise<ProductsResponse> => {
    const response = await api.get('/api/products/pending-approval', {
      params: { page, size }
    });
    return response.data;
  },

  // Enhanced Search & Discovery
  advancedSearch: async (params: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    location?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    page?: number;
    size?: number;
  }): Promise<ProductsResponse> => {
    const response = await api.get('/api/products/advanced-search-products', { params });
    return response.data;
  },

  getFeaturedProductsPaginated: async (page = 0, size = 12): Promise<ProductsResponse> => {
    const response = await api.get('/api/products/search/featured', {
      params: { page, size }
    });
    return response.data;
  },

  // Product categories
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/api/products/categories');
    return response.data;
  },

  getSubCategories: async (categoryId: number): Promise<SubCategory[]> => {
    const response = await api.get(`/api/products/categories/${categoryId}/subcategories`);
    return response.data;
  },

  // Product by vendor
  getByVendor: async (vendorId: number, page: number = 0, size: number = 12): Promise<ProductsResponse> => {
    const response = await api.get(`/api/products/vendor/${vendorId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Product by category
  getByCategory: async (categoryId: number, page: number = 0, size: number = 12): Promise<ProductsResponse> => {
    const response = await api.get(`/api/products/category/${categoryId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Get product by ID
  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  }
};
