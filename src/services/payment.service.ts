/**
 * Payment Service
 * Handles all payment related API calls
 */

import apiService from './api.service';
import API_CONFIG from '@/config/api.config';

export interface PaymentMethod {
  id: number;
  userId: number;
  paymentType: string;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  paymentStatus: string;
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  orderId: number;
  amount: number;
  paymentMethodId: number;
}

export interface PaymentGatewayRequest {
  orderId: number;
  amount: number;
  gatewayId: string;
}

class PaymentService {
  async getPaymentMethods() {
    return apiService.get<PaymentMethod[]>(API_CONFIG.ENDPOINTS.PAYMENTS.GET_PAYMENT_METHODS);
  }

  async getPaymentMethodById(id: number) {
    return apiService.get<PaymentMethod>(
      API_CONFIG.ENDPOINTS.PAYMENTS.GET_PAYMENT_METHOD_BY_ID(id)
    );
  }

  async addPaymentMethod(data: any) {
    return apiService.post<PaymentMethod>(
      API_CONFIG.ENDPOINTS.PAYMENTS.ADD_PAYMENT_METHOD,
      data
    );
  }

  async updatePaymentMethod(id: number, data: any) {
    return apiService.put<PaymentMethod>(
      API_CONFIG.ENDPOINTS.PAYMENTS.UPDATE_PAYMENT_METHOD(id),
      data
    );
  }

  async deletePaymentMethod(id: number) {
    return apiService.delete(API_CONFIG.ENDPOINTS.PAYMENTS.DELETE_PAYMENT_METHOD(id));
  }

  async setDefaultPaymentMethod(id: number) {
    return apiService.post<PaymentMethod>(
      API_CONFIG.ENDPOINTS.PAYMENTS.SET_DEFAULT_PAYMENT_METHOD(id),
      {}
    );
  }

  async createPayment(data: CreatePaymentRequest) {
    return apiService.post<Payment>(API_CONFIG.ENDPOINTS.PAYMENTS.CREATE_PAYMENT, data);
  }

  async getPaymentById(id: number) {
    return apiService.get<Payment>(API_CONFIG.ENDPOINTS.PAYMENTS.GET_PAYMENT_BY_ID(id));
  }

  async getOrderPayments(orderId: number) {
    return apiService.get(API_CONFIG.ENDPOINTS.PAYMENTS.GET_ORDER_PAYMENTS(orderId));
  }

  async getAllPayments(page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.PAYMENTS.GET_ALL_PAYMENTS, {
      params: { page, size },
    });
  }

  async getPaymentsByStatus(status: string, page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.PAYMENTS.GET_BY_STATUS(status), {
      params: { page, size },
    });
  }

  async processPayment(paymentId: number) {
    return apiService.post(API_CONFIG.ENDPOINTS.PAYMENTS.PROCESS_PAYMENT(paymentId), {});
  }

  async verifyPayment(transactionId: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.PAYMENTS.VERIFY_PAYMENT, {
      transactionId,
    });
  }

  async confirmPayment(paymentId: number) {
    return apiService.post(API_CONFIG.ENDPOINTS.PAYMENTS.CONFIRM_PAYMENT(paymentId), {});
  }

  async refundPayment(paymentId: number, reason: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.PAYMENTS.REFUND_PAYMENT(paymentId), {
      reason,
    });
  }

  async cancelPayment(paymentId: number) {
    return apiService.post(API_CONFIG.ENDPOINTS.PAYMENTS.CANCEL_PAYMENT(paymentId), {});
  }

  async initializeStripePayment(data: PaymentGatewayRequest) {
    return apiService.post(
      API_CONFIG.ENDPOINTS.PAYMENTS.INITIALIZE_STRIPE_PAYMENT,
      data
    );
  }

  async initializePayPalPayment(data: PaymentGatewayRequest) {
    return apiService.post(
      API_CONFIG.ENDPOINTS.PAYMENTS.INITIALIZE_PAYPAL_PAYMENT,
      data
    );
  }

  async initializeRazorpayPayment(data: PaymentGatewayRequest) {
    return apiService.post(
      API_CONFIG.ENDPOINTS.PAYMENTS.INITIALIZE_RAZORPAY_PAYMENT,
      data
    );
  }

  async handleStripeWebhook(data: any) {
    return apiService.post(API_CONFIG.ENDPOINTS.PAYMENTS.HANDLE_STRIPE_WEBHOOK, data);
  }

  async handlePayPalWebhook(data: any) {
    return apiService.post(API_CONFIG.ENDPOINTS.PAYMENTS.HANDLE_PAYPAL_WEBHOOK, data);
  }

  async handleRazorpayWebhook(data: any) {
    return apiService.post(API_CONFIG.ENDPOINTS.PAYMENTS.HANDLE_RAZORPAY_WEBHOOK, data);
  }

  async getTransactionHistory(page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.PAYMENTS.GET_TRANSACTION_HISTORY, {
      params: { page, size },
    });
  }

  async getTransactionDetails(transactionId: string) {
    return apiService.get(
      API_CONFIG.ENDPOINTS.PAYMENTS.GET_TRANSACTION_DETAILS(transactionId)
    );
  }

  async getPaymentStatistics() {
    return apiService.get(API_CONFIG.ENDPOINTS.PAYMENTS.GET_STATISTICS);
  }

  async getTotalRevenue() {
    return apiService.get(API_CONFIG.ENDPOINTS.PAYMENTS.GET_TOTAL_REVENUE);
  }

  async getRevenueByDate(startDate: string, endDate: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.PAYMENTS.GET_REVENUE_BY_DATE, {
      params: { startDate, endDate },
    });
  }

  async getPaymentMethodStats() {
    return apiService.get(API_CONFIG.ENDPOINTS.PAYMENTS.GET_PAYMENT_METHOD_STATS);
  }
}

export default new PaymentService();
