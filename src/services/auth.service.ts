/**
 * Authentication Service
 * Handles all authentication related API calls
 */

import apiService from './api.service';
import API_CONFIG from '@/config/api.config';

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  emailOrPhone: string;
  password: string;
}

export interface OtpRequest {
  email?: string;
  emailOrPhone?: string;
  otp?: string;
  password?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
  avatar?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

class AuthService {
  // Registration
  async sendRegistrationOtp(email: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.AUTH.SEND_REGISTRATION_OTP, { email });
  }

  async registerUser(data: RegisterRequest) {
    return apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data);
  }

  async registerVendor(data: RegisterRequest) {
    return apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.VENDOR_REGISTER, data);
  }

  async registerAdmin(data: RegisterRequest) {
    return apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.ADMIN_REGISTER, data);
  }

  async registerSupport(data: RegisterRequest) {
    return apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.SUPPORT_REGISTER, data);
  }

  async registerCTO(data: RegisterRequest) {
    return apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.CTO_REGISTER, data);
  }

  async registerDataEntry(data: RegisterRequest) {
    return apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.DATA_ENTRY_REGISTER, data);
  }

  // Login
  async login(credentials: LoginRequest) {
    return apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
  }

  async buyerLogin(credentials: LoginRequest) {
    return apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.BUYER_LOGIN, credentials);
  }

  async sellerLogin(credentials: LoginRequest) {
    return apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.SELLER_LOGIN, credentials);
  }

  async adminLogin(credentials: LoginRequest) {
    return apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.ADMIN_LOGIN, credentials);
  }

  async supportLogin(credentials: LoginRequest) {
    return apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.SUPPORT_LOGIN, credentials);
  }

  async ctoLogin(credentials: LoginRequest) {
    return apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.CTO_LOGIN, credentials);
  }

  async dataEntryLogin(credentials: LoginRequest) {
    return apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.DATA_ENTRY_LOGIN, credentials);
  }

  // OTP Management
  async sendLoginOtp(credentials: LoginRequest) {
    return apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN_OTP, credentials);
  }

  async verifyOtp(data: { emailOrPhone: string; otp: string }) {
    return apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP, data);
  }

  // Password Management
  async forgotPassword(data: ForgotPasswordRequest) {
    return apiService.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  }

  async verifyForgotPasswordOtp(data: ResetPasswordRequest) {
    return apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.VERIFY_FORGOT_PASSWORD_OTP, data);
  }

  async changePassword(data: ChangePasswordRequest) {
    return apiService.post(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  }

  // Profile Management
  async getProfile() {
    return apiService.get(API_CONFIG.ENDPOINTS.AUTH.GET_PROFILE);
  }

  async updateProfile(profileData: any) {
    return apiService.put(API_CONFIG.ENDPOINTS.AUTH.UPDATE_PROFILE, profileData);
  }

  // Email Validation
  async checkEmailRole(email: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.AUTH.CHECK_EMAIL_ROLE, { email });
  }

  // Token Management (via ApiService)
  setToken(token: string, refreshToken?: string): void {
    apiService.setToken(token, refreshToken);
  }

  getToken(): string | null {
    return apiService.getToken();
  }

  getRefreshToken(): string | null {
    return apiService.getRefreshToken();
  }

  clearAuth(): void {
    apiService.clearAuth();
  }

  isAuthenticated(): boolean {
    return apiService.isAuthenticated();
  }

  // Logout
  logout(): void {
    this.clearAuth();
  }
}

export default new AuthService();
