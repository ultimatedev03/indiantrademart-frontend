/**
 * Order Service
 * Handles all order related API calls
 */

import apiService from './api.service';
import API_CONFIG from '@/config/api.config';

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  userId: number;
  vendorId?: number;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  shippingAddress: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  cartItems: Array<{
    productId: number;
    quantity: number;
  }>;
  shippingAddressId: number;
  paymentMethodId: number;
}

export interface UpdateOrderRequest {
  orderStatus?: string;
  paymentStatus?: string;
  trackingNumber?: string;
}

class OrderService {
  // CRUD Operations
  async createOrder(data: CreateOrderRequest) {
    return apiService.post<Order>(API_CONFIG.ENDPOINTS.ORDERS.CREATE_ORDER, data);
  }

  async getOrderById(id: number) {
    return apiService.get<Order>(API_CONFIG.ENDPOINTS.ORDERS.GET_ORDER_BY_ID(id));
  }

  async updateOrder(id: number, data: UpdateOrderRequest) {
    return apiService.put<Order>(API_CONFIG.ENDPOINTS.ORDERS.UPDATE_ORDER(id), data);
  }

  async deleteOrder(id: number) {
    return apiService.delete(API_CONFIG.ENDPOINTS.ORDERS.DELETE_ORDER(id));
  }

  // Listing & Filtering
  async getAllOrders(page = 0, size = 20, params?: any) {
    return apiService.get(API_CONFIG.ENDPOINTS.ORDERS.GET_ALL_ORDERS, {
      params: { page, size, ...params },
    });
  }

  async getUserOrders(userId: number, page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.ORDERS.GET_USER_ORDERS(userId), {
      params: { page, size },
    });
  }

  async getMyOrders(page = 0, size = 20, params?: any) {
    return apiService.get(API_CONFIG.ENDPOINTS.ORDERS.GET_MY_ORDERS, {
      params: { page, size, ...params },
    });
  }

  async filterOrders(params: any) {
    return apiService.get(API_CONFIG.ENDPOINTS.ORDERS.FILTER_ORDERS, { params });
  }

  async searchOrders(searchTerm: string, page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.ORDERS.SEARCH_ORDERS, {
      params: { searchTerm, page, size },
    });
  }

  // Order Status
  async getOrdersByStatus(status: string, page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.ORDERS.GET_BY_STATUS(status), {
      params: { page, size },
    });
  }

  async updateOrderStatus(id: number, status: string) {
    return apiService.patch(API_CONFIG.ENDPOINTS.ORDERS.UPDATE_STATUS(id), null, {
      params: { status },
    });
  }

  async cancelOrder(id: number, reason?: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.ORDERS.CANCEL_ORDER(id), { reason });
  }

  async completeOrder(id: number) {
    return apiService.post(API_CONFIG.ENDPOINTS.ORDERS.COMPLETE_ORDER(id), {});
  }

  async shipOrder(id: number, trackingNumber: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.ORDERS.SHIP_ORDER(id), null, {
      params: { trackingNumber },
    });
  }

  // Payment
  async updatePaymentStatus(id: number, status: string) {
    return apiService.patch(API_CONFIG.ENDPOINTS.ORDERS.UPDATE_PAYMENT_STATUS(id), null, {
      params: { status },
    });
  }

  async getPaymentDetails(id: number) {
    return apiService.get(API_CONFIG.ENDPOINTS.ORDERS.GET_PAYMENT_DETAILS(id));
  }

  async refundOrder(id: number, reason: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.ORDERS.REFUND_ORDER(id), { reason });
  }

  // Tracking
  async trackOrder(orderNumber: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.ORDERS.TRACK_ORDER(orderNumber));
  }

  async getTrackingDetails(id: number) {
    return apiService.get(API_CONFIG.ENDPOINTS.ORDERS.GET_TRACKING_DETAILS(id));
  }

  // Statistics & Analytics
  async getStatistics() {
    return apiService.get(API_CONFIG.ENDPOINTS.ORDERS.GET_STATISTICS);
  }

  async getTotalCount() {
    return apiService.get(API_CONFIG.ENDPOINTS.ORDERS.GET_TOTAL_COUNT);
  }

  async getTotalRevenue() {
    return apiService.get(API_CONFIG.ENDPOINTS.ORDERS.GET_TOTAL_REVENUE);
  }

  async getRevenueByDate(startDate: string, endDate: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.ORDERS.GET_REVENUE_BY_DATE, {
      params: { startDate, endDate },
    });
  }

  async getPendingOrders() {
    return apiService.get(API_CONFIG.ENDPOINTS.ORDERS.GET_PENDING_ORDERS);
  }

  async getRecentOrders(limit = 10) {
    return apiService.get(API_CONFIG.ENDPOINTS.ORDERS.GET_RECENT_ORDERS, {
      params: { limit },
    });
  }

  async getOrdersByDateRange(startDate: string, endDate: string, page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.ORDERS.GET_BY_DATE_RANGE, {
      params: { startDate, endDate, page, size },
    });
  }

  // Vendor Orders
  async getVendorOrders(page = 0, size = 20, params?: any) {
    return apiService.get(API_CONFIG.ENDPOINTS.ORDERS.GET_VENDOR_ORDERS || '/api/orders/vendor/my-orders', {
      params: { page, size, ...params },
    });
  }

  async getVendorOrdersPaginated(page = 0, size = 20, params?: any) {
    return apiService.get(API_CONFIG.ENDPOINTS.ORDERS.GET_VENDOR_ORDERS_PAGINATED || '/api/orders/vendor/my-orders/paginated', {
      params: { page, size, ...params },
    });
  }

  // Export
  async exportOrders(format: 'csv' | 'pdf', params?: any) {
    return apiService.get(API_CONFIG.ENDPOINTS.ORDERS.EXPORT_ORDERS, {
      params: { format, ...params },
      responseType: format === 'pdf' ? 'blob' : 'text',
    });
  }
}

export default new OrderService();
