// =============================================================================
// Authentication Service Layer
// =============================================================================
// Handles all auth operations: login, register, OTP, password reset, etc.

import { apiClient } from '../api-client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  VendorRegisterRequest,
  VerifyOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  User,
} from '../types/api-types';

class AuthService {
  private tokenKey = 'authToken';
  private refreshTokenKey = 'refreshToken';
  private userKey = 'currentUser';

  // =========================================================================
  // LOGIN & AUTHENTICATION
  // =========================================================================

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.login(email, password);
      this.setAuthToken(response.token);
      if (response.refreshToken) {
        this.setRefreshToken(response.refreshToken);
      }
      this.setCurrentUser(response.user);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Login failed');
    }
  }

  async vendorLogin(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.vendorLogin(email, password);
      this.setAuthToken(response.token);
      if (response.refreshToken) {
        this.setRefreshToken(response.refreshToken);
      }
      this.setCurrentUser(response.vendor);
      return { token: response.token, refreshToken: response.refreshToken, expiresIn: response.expiresIn, user: response.vendor };
    } catch (error) {
      throw this.handleError(error, 'Vendor login failed');
    }
  }

  async adminLogin(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.adminLogin(email, password);
      this.setAuthToken(response.token);
      if (response.refreshToken) {
        this.setRefreshToken(response.refreshToken);
      }
      this.setCurrentUser(response.admin);
      return { token: response.token, refreshToken: response.refreshToken, expiresIn: response.expiresIn, user: response.admin };
    } catch (error) {
      throw this.handleError(error, 'Admin login failed');
    }
  }

  // =========================================================================
  // REGISTRATION
  // =========================================================================

  async register(data: RegisterRequest): Promise<any> {
    try {
      const response = await apiClient.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        userType: data.userType || 'BUYER',
      });
      return response;
    } catch (error) {
      throw this.handleError(error, 'Registration failed');
    }
  }

  async vendorRegister(data: VendorRegisterRequest): Promise<any> {
    try {
      const response = await apiClient.vendorRegister({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        companyName: data.companyName,
        businessType: data.businessType,
        gstNumber: data.gstNumber,
        panNumber: data.panNumber,
      });
      return response;
    } catch (error) {
      throw this.handleError(error, 'Vendor registration failed');
    }
  }

  // =========================================================================
  // OTP VERIFICATION
  // =========================================================================

  async sendOtp(email: string): Promise<any> {
    try {
      // Assuming backend has this endpoint
      const response = await apiClient.post('/auth/send-otp', { email });
      return response;
    } catch (error) {
      throw this.handleError(error, 'Failed to send OTP');
    }
  }

  async verifyOtp(email: string, otp: string): Promise<any> {
    try {
      const response = await apiClient.verifyOtp(email, otp);
      return response;
    } catch (error) {
      throw this.handleError(error, 'OTP verification failed');
    }
  }

  async resendOtp(email: string): Promise<any> {
    try {
      const response = await apiClient.post('/auth/resend-otp', { email });
      return response;
    } catch (error) {
      throw this.handleError(error, 'Failed to resend OTP');
    }
  }

  // =========================================================================
  // PASSWORD MANAGEMENT
  // =========================================================================

  async forgotPassword(email: string): Promise<any> {
    try {
      const response = await apiClient.forgotPassword(email);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Password reset request failed');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    try {
      const response = await apiClient.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Password reset failed');
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<any> {
    try {
      const response = await apiClient.changePassword(currentPassword, newPassword);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Password change failed');
    }
  }

  // =========================================================================
  // PROFILE MANAGEMENT
  // =========================================================================

  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.getProfile();
      this.setCurrentUser(response);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch profile');
    }
  }

  async updateProfile(data: any): Promise<User> {
    try {
      const response = await apiClient.updateProfile(data);
      this.setCurrentUser(response);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Profile update failed');
    }
  }

  async uploadAvatar(file: File): Promise<string> {
    try {
      const response = await apiClient.uploadFile(file, 'avatar');
      return response.url || response;
    } catch (error) {
      throw this.handleError(error, 'Avatar upload failed');
    }
  }

  // =========================================================================
  // TOKEN MANAGEMENT
  // =========================================================================

  getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  setAuthToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.tokenKey, token);
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.refreshTokenKey);
  }

  setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.refreshTokenKey, token);
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return null;

      const response = await apiClient.post('/auth/refresh', { refreshToken });
      this.setAuthToken(response.token);
      return response.token;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  // =========================================================================
  // USER SESSION
  // =========================================================================

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  setCurrentUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isVendor(): boolean {
    return this.getUserRole() === 'VENDOR';
  }

  isBuyer(): boolean {
    return this.getUserRole() === 'BUYER';
  }

  // =========================================================================
  // LOGOUT & CLEANUP
  // =========================================================================

  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
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

export const authService = new AuthService();
export default authService;
