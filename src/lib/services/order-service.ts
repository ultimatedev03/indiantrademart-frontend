// =============================================================================
// Order Service Layer
// =============================================================================
// Handles cart, checkout, payment, and order operations

import { apiClient } from '../api-client';
import {
  Cart,
  CartItem,
  CheckoutRequest,
  CheckoutResponse,
  Order,
  Payment,
  PaginatedResponse,
} from '../types/api-types';

class OrderService {
  // =========================================================================
  // CART OPERATIONS
  // =========================================================================

  async addToCart(productId: string, quantity: number): Promise<CartItem> {
    try {
      return await apiClient.addToCart(productId, quantity);
    } catch (error) {
      throw this.handleError(error, 'Failed to add item to cart');
    }
  }

  async updateCartItem(cartItemId: string, quantity: number): Promise<CartItem> {
    try {
      return await apiClient.updateCartItem(cartItemId, quantity);
    } catch (error) {
      throw this.handleError(error, 'Failed to update cart item');
    }
  }

  async removeFromCart(cartItemId: string): Promise<void> {
    try {
      await apiClient.removeFromCart(cartItemId);
    } catch (error) {
      throw this.handleError(error, 'Failed to remove item from cart');
    }
  }

  async clearCart(): Promise<void> {
    try {
      await apiClient.clearCart();
    } catch (error) {
      throw this.handleError(error, 'Failed to clear cart');
    }
  }

  async getCart(): Promise<Cart> {
    try {
      return await apiClient.get('/cart');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch cart');
    }
  }

  // =========================================================================
  // CHECKOUT OPERATIONS
  // =========================================================================

  async getCheckoutSummary(): Promise<any> {
    try {
      return await apiClient.get('/checkout/summary');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch checkout summary');
    }
  }

  async checkout(data: CheckoutRequest): Promise<CheckoutResponse> {
    try {
      return await apiClient.checkout(data);
    } catch (error) {
      throw this.handleError(error, 'Checkout failed');
    }
  }

  async verifyPayment(orderId: string, paymentId: string): Promise<Order> {
    try {
      return await apiClient.verifyPayment(orderId, paymentId);
    } catch (error) {
      throw this.handleError(error, 'Payment verification failed');
    }
  }

  // =========================================================================
  // ORDER OPERATIONS
  // =========================================================================

  async getMyOrders(params?: {
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Order>> {
    try {
      return await apiClient.getMyOrders(params);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch orders');
    }
  }

  async getOrderById(orderId: string): Promise<Order> {
    try {
      return await apiClient.getOrderById(orderId);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch order');
    }
  }

  async getOrderByNumber(orderNumber: string): Promise<Order> {
    try {
      return await apiClient.trackOrder(orderNumber);
    } catch (error) {
      throw this.handleError(error, 'Failed to track order');
    }
  }

  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    try {
      return await apiClient.cancelOrder(orderId, reason);
    } catch (error) {
      throw this.handleError(error, 'Failed to cancel order');
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    try {
      return await apiClient.put(`/orders/${orderId}/status`, { status });
    } catch (error) {
      throw this.handleError(error, 'Failed to update order status');
    }
  }

  // =========================================================================
  // VENDOR ORDER OPERATIONS
  // =========================================================================

  async getVendorOrders(params?: any): Promise<PaginatedResponse<Order>> {
    try {
      return await apiClient.getVendorOrders(params);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch vendor orders');
    }
  }

  async getVendorOrderStats(): Promise<any> {
    try {
      return await apiClient.get('/orders/vendor/stats');
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch order statistics');
    }
  }

  // =========================================================================
  // PAYMENT OPERATIONS
  // =========================================================================

  async initiatePayment(data: {
    orderId: string;
    amount: number;
    method: string;
  }): Promise<any> {
    try {
      return await apiClient.post('/payments/initiate', data);
    } catch (error) {
      throw this.handleError(error, 'Payment initiation failed');
    }
  }

  async getPaymentStatus(paymentId: string): Promise<Payment> {
    try {
      return await apiClient.get(`/payments/${paymentId}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch payment status');
    }
  }

  async getOrderPayments(orderId: string): Promise<Payment[]> {
    try {
      return await apiClient.get(`/orders/${orderId}/payments`);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch order payments');
    }
  }

  // =========================================================================
  // COUPON & DISCOUNTS
  // =========================================================================

  async validateCoupon(couponCode: string): Promise<any> {
    try {
      return await apiClient.post('/coupons/validate', { code: couponCode });
    } catch (error) {
      throw this.handleError(error, 'Invalid coupon code');
    }
  }

  async applyCoupon(couponCode: string): Promise<any> {
    try {
      return await apiClient.post('/cart/apply-coupon', { code: couponCode });
    } catch (error) {
      throw this.handleError(error, 'Failed to apply coupon');
    }
  }

  async removeCoupon(): Promise<void> {
    try {
      await apiClient.post('/cart/remove-coupon', {});
    } catch (error) {
      throw this.handleError(error, 'Failed to remove coupon');
    }
  }

  // =========================================================================
  // ORDER TRACKING
  // =========================================================================

  async trackOrderRealtime(orderNumber: string): Promise<any> {
    try {
      return await apiClient.get(`/orders/track/${orderNumber}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to track order');
    }
  }

  async getOrderTimeline(orderId: string): Promise<any[]> {
    try {
      return await apiClient.get(`/orders/${orderId}/timeline`);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch order timeline');
    }
  }

  // =========================================================================
  // INVOICE & DOCUMENTS
  // =========================================================================

  async downloadInvoice(orderId: string): Promise<Blob> {
    try {
      const response = await apiClient.getAxiosInstance().get(
        `/orders/${orderId}/invoice`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to download invoice');
    }
  }

  async downloadShippingLabel(orderId: string): Promise<Blob> {
    try {
      const response = await apiClient.getAxiosInstance().get(
        `/orders/${orderId}/shipping-label`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to download shipping label');
    }
  }

  // =========================================================================
  // ORDER ANALYTICS
  // =========================================================================

  async getOrderAnalytics(dateRange?: string): Promise<any> {
    try {
      return await apiClient.get('/analytics/orders', {
        params: { dateRange },
      });
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch order analytics');
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

export const orderService = new OrderService();
export default orderService;
