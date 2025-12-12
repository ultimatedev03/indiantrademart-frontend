/**
 * Analytics Service
 * Handles all analytics and reporting API calls
 */

import apiService from './api.service';
import API_CONFIG from '@/config/api.config';

export interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  totalVendors: number;
  averageOrderValue: number;
  conversionRate: number;
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
  revenue: number;
}

export interface ProductStats {
  productId: number;
  productName: string;
  sales: number;
  revenue: number;
  rating: number;
  reviews: number;
}

export interface CategoryStats {
  categoryId: number;
  categoryName: string;
  sales: number;
  revenue: number;
  products: number;
}

export interface VendorStats {
  vendorId: number;
  vendorName: string;
  sales: number;
  revenue: number;
  orders: number;
  rating: number;
}

class AnalyticsService {
  async getDashboardData(startDate?: string, endDate?: string) {
    return apiService.get<DashboardData>(API_CONFIG.ENDPOINTS.ANALYTICS.GET_DASHBOARD_DATA, {
      params: { startDate, endDate },
    });
  }

  async getSalesData(period: 'daily' | 'weekly' | 'monthly', startDate: string, endDate: string) {
    return apiService.get<SalesData[]>(API_CONFIG.ENDPOINTS.ANALYTICS.GET_SALES_DATA, {
      params: { period, startDate, endDate },
    });
  }

  async getRevenueData(period: 'daily' | 'weekly' | 'monthly', startDate: string, endDate: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.GET_REVENUE_DATA, {
      params: { period, startDate, endDate },
    });
  }

  async getTopProducts(limit = 10, startDate?: string, endDate?: string) {
    return apiService.get<ProductStats[]>(API_CONFIG.ENDPOINTS.ANALYTICS.GET_TOP_PRODUCTS, {
      params: { limit, startDate, endDate },
    });
  }

  async getTopCategories(limit = 10, startDate?: string, endDate?: string) {
    return apiService.get<CategoryStats[]>(API_CONFIG.ENDPOINTS.ANALYTICS.GET_TOP_CATEGORIES, {
      params: { limit, startDate, endDate },
    });
  }

  async getTopVendors(limit = 10, startDate?: string, endDate?: string) {
    return apiService.get<VendorStats[]>(API_CONFIG.ENDPOINTS.ANALYTICS.GET_TOP_VENDORS, {
      params: { limit, startDate, endDate },
    });
  }

  async getCustomerData(startDate?: string, endDate?: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.GET_CUSTOMER_DATA, {
      params: { startDate, endDate },
    });
  }

  async getNewCustomers(period: 'daily' | 'weekly' | 'monthly', startDate: string, endDate: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.GET_NEW_CUSTOMERS, {
      params: { period, startDate, endDate },
    });
  }

  async getCustomerRetention(startDate?: string, endDate?: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.GET_CUSTOMER_RETENTION, {
      params: { startDate, endDate },
    });
  }

  async getOrderData(startDate?: string, endDate?: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.GET_ORDER_DATA, {
      params: { startDate, endDate },
    });
  }

  async getOrderStatus(startDate?: string, endDate?: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.GET_ORDER_STATUS, {
      params: { startDate, endDate },
    });
  }

  async getAverageOrderValue(period: 'daily' | 'weekly' | 'monthly', startDate: string, endDate: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.GET_AVERAGE_ORDER_VALUE, {
      params: { period, startDate, endDate },
    });
  }

  async getConversionRate(startDate?: string, endDate?: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.GET_CONVERSION_RATE, {
      params: { startDate, endDate },
    });
  }

  async getTrafficData(period: 'daily' | 'weekly' | 'monthly', startDate: string, endDate: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.GET_TRAFFIC_DATA, {
      params: { period, startDate, endDate },
    });
  }

  async getSearchAnalytics(startDate?: string, endDate?: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.GET_SEARCH_ANALYTICS, {
      params: { startDate, endDate },
    });
  }

  async getInventoryAnalytics() {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.GET_INVENTORY_ANALYTICS);
  }

  async getPaymentMethodStats(startDate?: string, endDate?: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.GET_PAYMENT_METHOD_STATS, {
      params: { startDate, endDate },
    });
  }

  async getShippingData(startDate?: string, endDate?: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.GET_SHIPPING_DATA, {
      params: { startDate, endDate },
    });
  }

  async getReturnData(startDate?: string, endDate?: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.GET_RETURN_DATA, {
      params: { startDate, endDate },
    });
  }

  async getRefundData(startDate?: string, endDate?: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.GET_REFUND_DATA, {
      params: { startDate, endDate },
    });
  }

  async getMarketingData(startDate?: string, endDate?: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.GET_MARKETING_DATA, {
      params: { startDate, endDate },
    });
  }

  async getCouponUsageData(startDate?: string, endDate?: string) {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.GET_COUPON_USAGE_DATA, {
      params: { startDate, endDate },
    });
  }

  async getCustomReport(params: any) {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.GET_CUSTOM_REPORT, { params });
  }

  async exportReport(reportType: string, format: 'csv' | 'pdf' | 'excel', params?: any) {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.EXPORT_REPORT, {
      params: { reportType, format, ...params },
      responseType: format === 'pdf' ? 'blob' : 'text',
    });
  }

  async scheduleReport(reportType: string, frequency: string, email: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.ANALYTICS.SCHEDULE_REPORT, {
      reportType,
      frequency,
      email,
    });
  }

  async getScheduledReports() {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.GET_SCHEDULED_REPORTS);
  }

  async deleteScheduledReport(reportId: number) {
    return apiService.delete(API_CONFIG.ENDPOINTS.ANALYTICS.DELETE_SCHEDULED_REPORT(reportId));
  }
}

export default new AnalyticsService();
