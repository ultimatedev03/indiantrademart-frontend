// =============================================================================
// Unified API Client - Complete Backend Integration
// =============================================================================
// Handles all 777+ endpoints with error handling, auth, retries, and logging

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

interface ApiClientConfig extends AxiosRequestConfig {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
  enableLogging?: boolean;
}

interface ApiResponse<T = any> {
  status: number;
  data?: T;
  message?: string;
  errors?: Record<string, any>;
  timestamp?: number;
}

interface PaginatedResponse<T = any> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private baseUrl: string;
  private wsUrl: string;
  private retryCount = 3;
  private retryDelay = 1000;
  private enableLogging: boolean;

  constructor(
    baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    apiVersion: string = 'v1'
  ) {
    this.baseUrl = `${baseUrl}/api/${apiVersion}`;
    this.wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080/ws';
    this.enableLogging = process.env.NEXT_PUBLIC_DEBUG_API === 'true';

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        if (this.enableLogging) {
          console.log(`🌐 [${config.method?.toUpperCase()}] ${config.url}`, config.data);
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (this.enableLogging) {
          console.log(`✅ [${response.status}] ${response.config.url}`, response.data);
        }
        return response;
      },
      (error) => {
        if (this.enableLogging) {
          console.error(`❌ API Error:`, error.response?.data || error.message);
        }
        
        // Handle 401 - redirect to login
        if (error.response?.status === 401) {
          this.clearAuthToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  private clearAuthToken() {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  }

  private async retryRequest<T>(
    config: AxiosRequestConfig & { retries?: number; retryDelay?: number },
    attempt = 0
  ): Promise<T> {
    const maxRetries = config.retries ?? this.retryCount;
    const delay = config.retryDelay ?? this.retryDelay;

    try {
      const response = await this.axiosInstance.request<ApiResponse<T>>(config);
      return (response.data.data || response.data) as T;
    } catch (error: any) {
      if (
        attempt < maxRetries &&
        (error.code === 'ECONNABORTED' || 
         error.response?.status >= 500 ||
         error.code === 'ECONNREFUSED')
      ) {
        await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
        return this.retryRequest(config, attempt + 1);
      }
      throw error;
    }
  }

  // =========================================================================
  // AUTH ENDPOINTS
  // =========================================================================

  async login(email: string, password: string): Promise<{ token: string; refreshToken?: string; expiresIn: number; user: any }> {
    return this.retryRequest({
      method: 'POST',
      url: '/auth/login',
      data: { email, password },
    });
  }

  async vendorLogin(email: string, password: string): Promise<{ token: string; refreshToken?: string; expiresIn: number; vendor: any }> {
    return this.retryRequest({
      method: 'POST',
      url: '/auth/seller/login',
      data: { email, password },
    });
  }

  async adminLogin(email: string, password: string): Promise<{ token: string; refreshToken?: string; expiresIn: number; admin: any }> {
    return this.retryRequest({
      method: 'POST',
      url: '/auth/admin/login',
      data: { email, password },
    });
  }

  async register(data: any): Promise<any> {
    return this.retryRequest({
      method: 'POST',
      url: '/auth/register',
      data,
    });
  }

  async vendorRegister(data: any): Promise<any> {
    return this.retryRequest({
      method: 'POST',
      url: '/auth/vendor/register',
      data,
    });
  }

  async verifyOtp(email: string, otp: string): Promise<any> {
    return this.retryRequest({
      method: 'POST',
      url: '/auth/verify-otp',
      data: { email, otp },
    });
  }

  async forgotPassword(email: string): Promise<any> {
    return this.retryRequest({
      method: 'POST',
      url: '/auth/forgot-password',
      data: { email },
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    return this.retryRequest({
      method: 'POST',
      url: '/auth/verify-forgot-password-otp',
      data: { token, newPassword },
    });
  }

  async getProfile(): Promise<any> {
    return this.retryRequest({
      method: 'GET',
      url: '/auth/profile',
    });
  }

  async updateProfile(data: any): Promise<any> {
    return this.retryRequest({
      method: 'PUT',
      url: '/auth/profile',
      data,
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<any> {
    return this.retryRequest({
      method: 'POST',
      url: '/auth/change-password',
      data: { currentPassword, newPassword },
    });
  }

  // =========================================================================
  // PRODUCT ENDPOINTS
  // =========================================================================

  async getProducts(params?: {
    page?: number;
    size?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<PaginatedResponse<any>> {
    return this.retryRequest({
      method: 'GET',
      url: '/products',
      params,
    });
  }

  async searchProducts(query: string, filters?: any): Promise<PaginatedResponse<any>> {
    return this.retryRequest({
      method: 'GET',
      url: '/products/search',
      params: { q: query, ...filters },
    });
  }

  async getProductById(id: string): Promise<any> {
    return this.retryRequest({
      method: 'GET',
      url: `/products/${id}`,
    });
  }

  async getProductsByCategory(categoryId: string, params?: any): Promise<PaginatedResponse<any>> {
    return this.retryRequest({
      method: 'GET',
      url: `/products/category/${categoryId}`,
      params,
    });
  }

  async getProductsByVendor(vendorId: string, params?: any): Promise<PaginatedResponse<any>> {
    return this.retryRequest({
      method: 'GET',
      url: `/products/vendor/${vendorId}`,
      params,
    });
  }

  async getFeaturedProducts(): Promise<any[]> {
    return this.retryRequest({
      method: 'GET',
      url: '/products/featured',
    });
  }

  async createProduct(data: any): Promise<any> {
    return this.retryRequest({
      method: 'POST',
      url: '/products',
      data,
    });
  }

  async updateProduct(id: string, data: any): Promise<any> {
    return this.retryRequest({
      method: 'PUT',
      url: `/products/${id}`,
      data,
    });
  }

  async deleteProduct(id: string): Promise<any> {
    return this.retryRequest({
      method: 'DELETE',
      url: `/products/${id}`,
    });
  }

  async uploadProductImages(productId: string, files: File[]): Promise<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    return this.retryRequest({
      method: 'POST',
      url: `/products/${productId}/images`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  // =========================================================================
  // CATEGORY ENDPOINTS
  // =========================================================================

  async getCategories(): Promise<any[]> {
    return this.retryRequest({
      method: 'GET',
      url: '/categories/active',
    });
  }

  async getCategoryHierarchy(): Promise<any> {
    return this.retryRequest({
      method: 'GET',
      url: '/categories/hierarchy',
    });
  }

  async getSubCategories(categoryId: string): Promise<any[]> {
    return this.retryRequest({
      method: 'GET',
      url: `/categories/${categoryId}/subcategories`,
    });
  }

  // =========================================================================
  // CART ENDPOINTS
  // =========================================================================

  async addToCart(productId: string, quantity: number): Promise<any> {
    return this.retryRequest({
      method: 'POST',
      url: '/cart/add',
      data: { productId, quantity },
    });
  }

  async updateCartItem(cartItemId: string, quantity: number): Promise<any> {
    return this.retryRequest({
      method: 'PUT',
      url: `/cart/item/${cartItemId}`,
      data: { quantity },
    });
  }

  async removeFromCart(cartItemId: string): Promise<any> {
    return this.retryRequest({
      method: 'DELETE',
      url: `/cart/item/${cartItemId}`,
    });
  }

  async clearCart(): Promise<any> {
    return this.retryRequest({
      method: 'DELETE',
      url: '/cart/clear',
    });
  }

  // =========================================================================
  // ORDER ENDPOINTS
  // =========================================================================

  async checkout(data: any): Promise<any> {
    return this.retryRequest({
      method: 'POST',
      url: '/orders/checkout',
      data,
    });
  }

  async verifyPayment(orderId: string, paymentId: string): Promise<any> {
    return this.retryRequest({
      method: 'POST',
      url: '/checkout/verify-payment',
      data: { orderId, paymentId },
    });
  }

  async getMyOrders(params?: { page?: number; size?: number }): Promise<PaginatedResponse<any>> {
    return this.retryRequest({
      method: 'GET',
      url: '/orders/my-orders',
      params,
    });
  }

  async getOrderById(orderId: string): Promise<any> {
    return this.retryRequest({
      method: 'GET',
      url: `/orders/${orderId}`,
    });
  }

  async trackOrder(orderNumber: string): Promise<any> {
    return this.retryRequest({
      method: 'GET',
      url: `/orders/number/${orderNumber}`,
    });
  }

  async cancelOrder(orderId: string, reason?: string): Promise<any> {
    return this.retryRequest({
      method: 'POST',
      url: `/checkout/cancel/${orderId}`,
      data: { reason },
    });
  }

  // =========================================================================
  // WISHLIST ENDPOINTS
  // =========================================================================

  async addToWishlist(productId: string): Promise<any> {
    return this.retryRequest({
      method: 'POST',
      url: `/wishlist/add/${productId}`,
    });
  }

  async removeFromWishlist(productId: string): Promise<any> {
    return this.retryRequest({
      method: 'DELETE',
      url: `/wishlist/remove/${productId}`,
    });
  }

  async getWishlist(): Promise<any[]> {
    return this.retryRequest({
      method: 'GET',
      url: '/wishlist/my-wishlist',
    });
  }

  async checkInWishlist(productId: string): Promise<boolean> {
    return this.retryRequest({
      method: 'GET',
      url: `/wishlist/check/${productId}`,
    });
  }

  // =========================================================================
  // VENDOR ENDPOINTS
  // =========================================================================

  async getVendorProfile(vendorId: string): Promise<any> {
    return this.retryRequest({
      method: 'GET',
      url: `/vendors/${vendorId}`,
    });
  }

  async updateVendorProfile(vendorId: string, data: any): Promise<any> {
    return this.retryRequest({
      method: 'PUT',
      url: `/vendors/${vendorId}`,
      data,
    });
  }

  async getVendorDashboard(): Promise<any> {
    return this.retryRequest({
      method: 'GET',
      url: '/analytics/dashboard',
    });
  }

  async getVendorProducts(params?: any): Promise<PaginatedResponse<any>> {
    return this.retryRequest({
      method: 'GET',
      url: '/products/vendor/my-products',
      params,
    });
  }

  async getVendorOrders(params?: any): Promise<PaginatedResponse<any>> {
    return this.retryRequest({
      method: 'GET',
      url: '/orders/vendor/my-orders',
      params,
    });
  }

  async getVendorAnalytics(timeRange?: string): Promise<any> {
    return this.retryRequest({
      method: 'GET',
      url: '/analytics/vendor/dashboard',
      params: { timeRange },
    });
  }

  async searchVendors(query: string, filters?: any): Promise<PaginatedResponse<any>> {
    return this.retryRequest({
      method: 'GET',
      url: '/vendors/search',
      params: { q: query, ...filters },
    });
  }

  // =========================================================================
  // INQUIRY/QUOTE ENDPOINTS
  // =========================================================================

  async createInquiry(data: any): Promise<any> {
    return this.retryRequest({
      method: 'POST',
      url: '/inquiries/direct',
      data,
    });
  }

  async getMyInquiries(): Promise<any[]> {
    return this.retryRequest({
      method: 'GET',
      url: '/inquiries/my-inquiries',
    });
  }

  async getVendorInquiries(): Promise<any[]> {
    return this.retryRequest({
      method: 'GET',
      url: '/inquiries/vendor-inquiries',
    });
  }

  async resolveInquiry(inquiryId: string, response: string): Promise<any> {
    return this.retryRequest({
      method: 'PUT',
      url: `/inquiries/${inquiryId}/resolve`,
      data: { response },
    });
  }

  // =========================================================================
  // BUYER ENDPOINTS
  // =========================================================================

  async getBuyerProfile(): Promise<any> {
    return this.retryRequest({
      method: 'GET',
      url: '/buyers/profile',
    });
  }

  async updateBuyerProfile(data: any): Promise<any> {
    return this.retryRequest({
      method: 'PUT',
      url: '/buyers/profile',
      data,
    });
  }

  async getBuyerDashboard(): Promise<any> {
    return this.retryRequest({
      method: 'GET',
      url: '/buyers/dashboard',
    });
  }

  // =========================================================================
  // ADMIN ENDPOINTS
  // =========================================================================

  async getAdminDashboard(): Promise<any> {
    return this.retryRequest({
      method: 'GET',
      url: '/analytics/dashboard',
    });
  }

  async getAllUsers(params?: any): Promise<PaginatedResponse<any>> {
    return this.retryRequest({
      method: 'GET',
      url: '/users',
      params,
    });
  }

  async getAllVendors(params?: any): Promise<PaginatedResponse<any>> {
    return this.retryRequest({
      method: 'GET',
      url: '/vendors',
      params,
    });
  }

  async getAllBuyers(params?: any): Promise<PaginatedResponse<any>> {
    return this.retryRequest({
      method: 'GET',
      url: '/buyers',
      params,
    });
  }

  async getAllOrders(params?: any): Promise<PaginatedResponse<any>> {
    return this.retryRequest({
      method: 'GET',
      url: '/orders',
      params,
    });
  }

  async getAdminAnalytics(type: string, params?: any): Promise<any> {
    return this.retryRequest({
      method: 'GET',
      url: `/analytics/${type}`,
      params,
    });
  }

  // =========================================================================
  // SUPPORT ENDPOINTS
  // =========================================================================

  async createTicket(data: any): Promise<any> {
    return this.retryRequest({
      method: 'POST',
      url: '/support/tickets',
      data,
    });
  }

  async getTickets(): Promise<any[]> {
    return this.retryRequest({
      method: 'GET',
      url: '/support/tickets',
    });
  }

  async sendMessage(chatId: string, message: string): Promise<any> {
    return this.retryRequest({
      method: 'POST',
      url: '/chat/send',
      data: { chatId, message },
    });
  }

  async getChatHistory(userId1: string, userId2: string): Promise<any[]> {
    return this.retryRequest({
      method: 'GET',
      url: `/chat/conversation/${userId1}/${userId2}`,
    });
  }

  // =========================================================================
  // FILE UPLOAD ENDPOINTS
  // =========================================================================

  async uploadFile(file: File, type: 'image' | 'document' | 'avatar' = 'image'): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.retryRequest({
      method: 'POST',
      url: `/upload/${type}`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  // =========================================================================
  // HEALTH & STATUS
  // =========================================================================

  async getHealth(): Promise<any> {
    return this.retryRequest({
      method: 'GET',
      url: '/health',
    });
  }

  async getApiStatus(): Promise<any> {
    return this.retryRequest({
      method: 'GET',
      url: '/status',
    });
  }

  // =========================================================================
  // GENERIC METHODS
  // =========================================================================

  async get<T = any>(url: string, config?: ApiClientConfig): Promise<T> {
    return this.retryRequest({ ...config, method: 'GET', url });
  }

  async post<T = any>(url: string, data?: any, config?: ApiClientConfig): Promise<T> {
    return this.retryRequest({ ...config, method: 'POST', url, data });
  }

  async put<T = any>(url: string, data?: any, config?: ApiClientConfig): Promise<T> {
    return this.retryRequest({ ...config, method: 'PUT', url, data });
  }

  async patch<T = any>(url: string, data?: any, config?: ApiClientConfig): Promise<T> {
    return this.retryRequest({ ...config, method: 'PATCH', url, data });
  }

  async delete<T = any>(url: string, config?: ApiClientConfig): Promise<T> {
    return this.retryRequest({ ...config, method: 'DELETE', url });
  }

  // Get axios instance for custom configurations
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  // Get WebSocket URL
  getWsUrl(): string {
    return this.wsUrl;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

export default apiClient;
