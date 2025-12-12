/**
 * API Service
 * Centralized HTTP client with interceptors, error handling, and request/response management
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import API_CONFIG from '@/config/api.config';
import { toast } from 'react-hot-toast';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  status: number;
}

class ApiService {
  private axiosInstance: AxiosInstance;
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup Axios Interceptors
   */
  private setupInterceptors(): void {
    // Request Interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => this.handleError(error)
    );
  }

  /**
   * Handle API Errors
   */
  private handleError(error: AxiosError): Promise<never> {
    let message = 'An error occurred';
    const status = error.response?.status;

    if (error.response) {
      const errorData = error.response.data as any;
      message = errorData?.message || errorData?.error || message;

      // Handle specific status codes
      switch (status) {
        case 400:
          toast.error(message || 'Bad Request');
          break;
        case 401:
          // Token expired or unauthorized
          this.clearAuth();
          toast.error('Session expired. Please login again.');
          window.location.href = '/auth/login';
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
        default:
          toast.error(message);
      }
    } else if (error.request) {
      toast.error('No response from server');
    } else {
      toast.error(message);
    }

    return Promise.reject({
      status,
      message,
      data: error.response?.data,
    });
  }

  /**
   * GET Request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * POST Request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * PUT Request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * PATCH Request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * DELETE Request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload Files
   */
  async uploadFiles<T = any>(url: string, files: File[], additionalData?: any): Promise<T> {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload Single File
   */
  async uploadFile<T = any>(url: string, file: File, additionalData?: any): Promise<T> {
    return this.uploadFiles<T>(url, [file], additionalData);
  }

  /**
   * Token Management
   */
  setToken(token: string, refreshToken?: string): void {
    localStorage.setItem(this.tokenKey, token);
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  clearAuth(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Get Axios Instance (for advanced usage)
   */
  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export default new ApiService();
