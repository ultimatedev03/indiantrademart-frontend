import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/api-config';

// ====== CATEGORY SERVICES ======
export const categoryService = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.CATEGORIES.BASE);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  },

  // Get category by ID
  getCategoryById: async (id: number) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.CATEGORIES.BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch category:', error);
      throw error;
    }
  },

  // Get subcategories for a category
  getSubCategories: async (categoryId: number) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.CATEGORIES.SUB_CATEGORIES(String(categoryId))}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
      throw error;
    }
  }
};

// ====== PRODUCT SERVICES ======
export const productService = {
  // Get featured products
  getFeaturedProducts: async (limit: number = 6) => {
    try {
      const response = await api.get(`/api/products/featured?limit=${limit}` as any);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (categoryId: number, page: number = 1, limit: number = 20) => {
    try {
      const response = await api.get(`/api/products/category/${categoryId}?page=${page}&limit=${limit}` as any);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products by category:', error);
      throw error;
    }
  },

  // Search products
  searchProducts: async (query: string, filters: any = {}) => {
    try {
      // Use fallback endpoint if BUYER.SEARCH is not defined
      const searchEndpoint = '/api/search';
      console.log('🔍 Searching products with endpoint:', searchEndpoint);
      
      const response = await api.post(searchEndpoint as any, {
        query,
        ...filters
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search products:', error);
      throw error;
    }
  },

  // Get product details
  getProductById: async (id: number) => {
    try {
      const response = await api.get(`/api/products/${id}` as any);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      throw error;
    }
  }
};

// ====== VENDOR SERVICES ======
export const vendorService = {
  // Get featured vendors
  getFeaturedVendors: async (limit: number = 10) => {
    try {
      const response = await api.get(`/api/vendors/featured?limit=${limit}` as any);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch featured vendors:', error);
      throw error;
    }
  },

  // Get vendors by city
  getVendorsByCity: async (city: string) => {
    try {
      const response = await api.get(`/api/vendors/city/${city}` as any);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch vendors by city:', error);
      throw error;
    }
  },

  // Get vendor details
  getVendorById: async (id: number) => {
    try {
      const response = await api.get(`/api/vendors/${id}` as any);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch vendor details:', error);
      throw error;
    }
  }
};

// ====== CART SERVICES ======
export const cartService = {
  // Get cart items
  getCartItems: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.BUYERS.CART);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (productId: number, quantity: number = 1) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.BUYERS.CART}/add`, {
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (cartItemId: number, quantity: number) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.BUYERS.CART}/update/${cartItemId}`, {
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (cartItemId: number) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.BUYERS.CART}/remove/${cartItemId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  }
};

// ====== WISHLIST SERVICES ======
export const wishlistService = {
  // Get wishlist items
  getWishlistItems: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.BUYERS.WISHLIST);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch wishlist items:', error);
      throw error;
    }
  },

  // Add item to wishlist
  addToWishlist: async (productId: number) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.BUYERS.WISHLIST}/add`, {
        productId
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      throw error;
    }
  },

  // Remove item from wishlist
  removeFromWishlist: async (productId: number) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.BUYERS.WISHLIST}/remove/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      throw error;
    }
  }
};

// ====== ORDER SERVICES ======
export const orderService = {
  // Get user orders
  getUserOrders: async (page: number = 1, limit: number = 10) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.BUYERS.ORDERS}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user orders:', error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId: number) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.BUYERS.ORDERS}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      throw error;
    }
  },

  // Create new order
  createOrder: async (orderData: any) => {
    try {
      const response = await api.post(API_ENDPOINTS.BUYERS.ORDERS, orderData);
      return response.data;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }
};

// ====== ANALYTICS SERVICES ======
export const analyticsService = {
  // Get dashboard analytics
  getDashboardAnalytics: async (userType: 'admin' | 'vendor' | 'user') => {
    try {
      let endpoint = '/api/analytics/dashboard';
      if (userType === 'admin') {
        endpoint = '/api/analytics/admin';
      } else if (userType === 'vendor') {
        endpoint = '/api/analytics/vendor';
      }
      
      const response = await api.get(endpoint as any);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      throw error;
    }
  },

  // Get vendor analytics
  getVendorAnalytics: async () => {
    try {
      const response = await api.get('/api/analytics/vendor' as any);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch vendor analytics:', error);
      throw error;
    }
  }
};

// ====== INQUIRY & QUOTE SERVICES ======
export const inquiryService = {
  // Create inquiry
  createInquiry: async (inquiryData: any) => {
    try {
      const response = await api.post(API_ENDPOINTS.BUYERS.INQUIRIES, inquiryData);
      return response.data;
    } catch (error) {
      console.error('Failed to create inquiry:', error);
      throw error;
    }
  },

  // Get user inquiries
  getUserInquiries: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.BUYERS.INQUIRIES);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
      throw error;
    }
  },

  // Get quotes for inquiry
  getQuotesForInquiry: async (inquiryId: number) => {
    try {
      const response = await api.get(`/api/quotes/inquiry/${inquiryId}` as any);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
      throw error;
    }
  }
};

// ====== SUPPORT SERVICES ======
export const supportService = {
  // Create support ticket
  createTicket: async (ticketData: any) => {
    try {
      const response = await api.post(API_ENDPOINTS.SUPPORT.TICKETS, ticketData);
      return response.data;
    } catch (error) {
      console.error('Failed to create ticket:', error);
      throw error;
    }
  },

  // Get user tickets
  getUserTickets: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.SUPPORT.TICKETS);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      throw error;
    }
  },

  // Get chat messages
  getChatMessages: async (chatId: number) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.SUPPORT.CHAT}/${chatId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch chat messages:', error);
      throw error;
    }
  }
};

// ====== UNIFIED SERVICE EXPORT ======
export const dynamicDataService = {
  categories: categoryService,
  products: productService,
  vendors: vendorService,
  cart: cartService,
  wishlist: wishlistService,
  orders: orderService,
  analytics: analyticsService,
  inquiries: inquiryService,
  support: supportService,
};

export default dynamicDataService;

