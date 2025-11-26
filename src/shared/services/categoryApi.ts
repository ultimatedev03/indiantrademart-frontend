import { api } from './api';
import { MOCK_MODE, mockResponses, mockDelay } from './mockMode';

export interface Category {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubCategory {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  category?: Category;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryDto {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface SubCategoryDto {
  name: string;
  description?: string;
  categoryId: number;
  isActive?: boolean;
}

// Category API functions
export const categoryAPI = {
  // Get all categories
  getAllCategories: async (): Promise<Category[]> => {
    if (MOCK_MODE) {
      console.log('Mock mode: Getting categories');
      await mockDelay(500);
      return mockResponses.categories.all;
    }
    
    try {
      const response = await api.get('/api/categories');
      return response.data;
    } catch (error: any) {
      // If API endpoint doesn't exist (404) or other errors, fallback to mock data
      if (error.response?.status === 404 || error.request) {
        console.warn('Categories API not available, using fallback data');
        return mockResponses.categories.all;
      }
      throw error;
    }
  },

  // Get category by ID
  getCategoryById: async (id: number): Promise<Category> => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  },

  // Create new category (Admin only)
  createCategory: async (categoryDto: CategoryDto): Promise<Category> => {
    const response = await api.post('/api/categories', categoryDto);
    return response.data;
  },

  // Update category (Admin only)
  updateCategory: async (id: number, categoryDto: CategoryDto): Promise<Category> => {
    const response = await api.put(`/api/categories/${id}`, categoryDto);
    return response.data;
  },

  // Delete category (Admin only)
  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/api/categories/${id}`);
  },

  // Get subcategories by category ID
  getSubCategoriesByCategory: async (categoryId: number): Promise<SubCategory[]> => {
    try {
      console.log(`📚 Fetching subcategories for category ${categoryId}...`);
      const response = await api.get(`/api/categories/${categoryId}/subcategories`);
      console.log(`✅ Subcategories for category ${categoryId}:`, response.data);
      
      // Extract data from response - backend wraps it in {success, message, data}
      let data = response.data?.data || response.data || [];
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      console.error(`❌ Error fetching subcategories for category ${categoryId}:`, error?.response?.data || error?.message);
      throw error;
    }
  },

  // Get all subcategories
  getAllSubCategories: async (): Promise<SubCategory[]> => {
    const response = await api.get('/api/subcategories');
    return response.data;
  },

  // Get subcategory by ID
  getSubCategoryById: async (id: number): Promise<SubCategory> => {
    const response = await api.get(`/api/subcategories/${id}`);
    return response.data;
  },

  // Create new subcategory (Admin only)
  createSubCategory: async (subCategoryDto: SubCategoryDto): Promise<SubCategory> => {
    const response = await api.post('/api/subcategories', subCategoryDto);
    return response.data;
  },

  // Update subcategory (Admin only)
  updateSubCategory: async (id: number, subCategoryDto: SubCategoryDto): Promise<SubCategory> => {
    const response = await api.put(`/api/subcategories/${id}`, subCategoryDto);
    return response.data;
  },

  // Delete subcategory (Admin only)
  deleteSubCategory: async (id: number): Promise<void> => {
    await api.delete(`/api/subcategories/${id}`);
  },

  // Get category hierarchy (for cascading dropdowns)
  getCategoryHierarchy: async (): Promise<any[]> => {
    try {
      console.log('🌳 Fetching category hierarchy...');
      const response = await api.get('/api/categories/hierarchy');
      console.log('📋 Category hierarchy response:', response);
      
      // Extract data from response - backend wraps it in {success, message, data}
      let data = response.data?.data || response.data || [];
      
      // Since backend returns flat list with whitespace in subCategories field,
      // we need to fetch subcategories separately for each category
      if (Array.isArray(data)) {
        // Fetch subcategories for each main category
        const enrichedData = await Promise.all(
          data.map(async (category: any) => {
            try {
              // Try to get subcategories
              const subResponse = await api.get(`/api/categories/${category.id}/subcategories`);
              const subData = subResponse.data?.data || subResponse.data || [];
              return {
                ...category,
                children: Array.isArray(subData) ? subData : []
              };
            } catch (error) {
              console.warn(`Could not fetch subcategories for ${category.name}`);
              return { ...category, children: [] };
            }
          })
        );
        return enrichedData;
      }
      
      console.log('✅ Extracted category data:', data);
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      console.error('❌ Error fetching category hierarchy:', error?.response?.data || error?.message);
      return [];
    }
  }
};
