/**
 * Enhanced Axios Client with Cookie Support for Subdomain Routing
 * Configured for vendor, buyer, management, and employee subdomains
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { AuthCookies } from '@/utils/cookies';
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

class AxiosClient {
  private axiosInstance: AxiosInstance;
  private refreshing: boolean = false;
  private failedQueue: any[] = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      withCredentials: true, // Enable cookies for cross-domain requests
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request Interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token from cookies
        const token = AuthCookies.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add subdomain header for backend routing
        if (typeof window !== 'undefined') {
          const subdomain = this.getSubdomain();
          if (subdomain) {
            config.headers['X-Subdomain'] = subdomain;
          }
        }

        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest: any = error.config;

        // Handle 401 Unauthorized - Token Expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.refreshing) {
            // Queue requests while refreshing
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.axiosInstance(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.refreshing = true;

          try {
            const refreshToken = AuthCookies.getRefreshToken();
            if (refreshToken) {
              const response = await this.refreshAuthToken(refreshToken);
              const newToken = response.data.token;

              AuthCookies.setAuthToken(newToken, response.data.refreshToken);

              // Process queued requests
              this.processQueue(null, newToken);
              this.failedQueue = [];

              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.failedQueue = [];
            this.handleAuthError();
            return Promise.reject(refreshError);
          } finally {
            this.refreshing = false;
          }
        }

        return this.handleError(error);
      }
    );
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });
  }

  private async refreshAuthToken(refreshToken: string): Promise<any> {
    return this.axiosInstance.post('/auth/refresh', { refreshToken });
  }

  private handleAuthError(): void {
    AuthCookies.clearAuth();
    toast.error('Session expired. Please login again.');
    
    if (typeof window !== 'undefined') {
      const subdomain = this.getSubdomain();
      const loginPath = subdomain ? `/${subdomain}/login` : '/auth/login';
      window.location.href = loginPath;
    }
  }

  private getSubdomain(): string | null {
    if (typeof window === 'undefined') return null;
    
    const hostname = window.location.hostname;
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'companyname.com';
    
    if (hostname.endsWith(`.${rootDomain}`)) {
      return hostname.replace(`.${rootDomain}`, '').split('.')[0];
    }
    
    return null;
  }

  private handleError(error: AxiosError): Promise<never> {
    let message = 'An error occurred';
    const status = error.response?.status;

    if (error.response) {
      const errorData = error.response.data as any;
      message = errorData?.message || errorData?.error || message;

      switch (status) {
        case 400:
          toast.error(message || 'Bad Request');
          break;
        case 403:
          toast.error('Access Denied');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 422:
          toast.error('Validation Error: ' + message);
          break;
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        case 502:
          toast.error('Backend service unavailable');
          break;
        case 503:
          toast.error('Service temporarily unavailable');
          break;
        default:
          if (status !== 401) {
            toast.error(message);
          }
      }
    } else if (error.request) {
      toast.error('No response from server. Please check your connection.');
    } else {
      toast.error(message);
    }

    return Promise.reject({
      status,
      message,
      data: error.response?.data,
    });
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  // File Upload
  async uploadFile<T = any>(url: string, file: File, additionalData?: any): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, additionalData[key]);
      });
    }

    const response = await this.axiosInstance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async uploadFiles<T = any>(url: string, files: File[], additionalData?: any): Promise<T> {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('files', file);
    });

    if (additionalData) {
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, additionalData[key]);
      });
    }

    const response = await this.axiosInstance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // Get Axios instance for advanced usage
  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  // WebSocket URL helper
  getWebSocketUrl(endpoint: string): string {
    return `${WS_BASE_URL}${endpoint}`;
  }
}

export const axiosClient = new AxiosClient();
export default axiosClient;
