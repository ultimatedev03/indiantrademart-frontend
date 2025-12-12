import { api } from '@/shared/services/api';
import { API } from '@/shared/config/api-endpoints';
import {
  LoginRequestDto,
  RegisterRequestDto,
  JwtResponse,
  ForgotPasswordRequestDto,
  VerifyOtpRequestDto,
  SetPasswordDto,
  ApiResponse,
} from '@/shared/types/api';

export class AuthService {
  /**
   * Generic login method
   * Maps to:
   *  - /api/auth/buyer/login  (user / buyer)
   *  - /api/auth/vendor/login (vendor)
   *  - /api/auth/{role}/login for others (admin, cto, etc. if backend supports)
   */
  async login(
    loginData: LoginRequestDto & { emailOrPhone?: string; userType?: string }
  ): Promise<JwtResponse> {
    try {
      // Backend expects `emailOrPhone`
      const loginPayload = {
        emailOrPhone: loginData.emailOrPhone || loginData.email,
        password: loginData.password,
      };

      const userType = (loginData.userType || 'buyer').toLowerCase();

      // Default → treat as buyer login
      let endpoint = '/api/auth/buyer/login';

      switch (userType) {
        case 'admin':
          endpoint = '/api/auth/admin/login';
          break;
        case 'vendor':
          endpoint = '/api/auth/vendor/login';
          break;
        case 'cto':
          endpoint = '/api/auth/cto/login';
          break;
        case 'support':
          endpoint = '/api/auth/support/login';
          break;
        case 'finance':
          endpoint = '/api/auth/finance/login';
          break;
        case 'employee':
        case 'data_entry':
        case 'data-entry':
          endpoint = '/api/auth/data-entry/login';
          break;
        case 'buyer':
        case 'user':
        default:
          endpoint = '/api/auth/buyer/login';
          break;
      }

      console.log('🚀 Attempting login at:', endpoint, 'with payload:', loginPayload);

      const response = await api.post<JwtResponse>(endpoint, loginPayload); // endpoint from API.auth

      console.log('📥 Login response:', response.data);

      // Handle both direct login response and OTP required response
      if (response.data?.token) {
        console.log('✅ Direct login successful, storing auth data');
        this.storeAuthData(response.data);
        return response.data;
      } else if ((response.data as any)?.requiresOTP) {
        console.log('📱 OTP required, returning OTP response');
        return response.data;
      }

      throw new Error('Unexpected login response format');
    } catch (error: any) {
      console.error('❌ Login error:', error);
      const errorMessage = error.response?.data || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * User-specific / Buyer-specific login
   * Maps to: POST /api/auth/buyer/login
   */
  async loginUser(loginData: LoginRequestDto): Promise<JwtResponse> {
    return this.roleSpecificLogin(loginData, 'user');
  }

  /**
   * Vendor-specific login
   * Maps to: POST /api/auth/vendor/login
   */
  async loginVendor(loginData: LoginRequestDto): Promise<JwtResponse> {
    return this.roleSpecificLogin(loginData, 'vendor');
  }

  /**
   * Admin-specific login
   * Maps to: POST /api/auth/admin/login
   */
  async loginAdmin(loginData: LoginRequestDto): Promise<JwtResponse> {
    return this.roleSpecificLogin(loginData, 'admin');
  }

  /**
   * Role-specific login helper
   */
  private async roleSpecificLogin(
    loginData: LoginRequestDto,
    userType: 'user' | 'vendor' | 'admin'
  ): Promise<JwtResponse> {
    try {
      const loginPayload = {
        emailOrPhone: (loginData as any).emailOrPhone || loginData.email,
        password: loginData.password,
      };

      let endpoint = '';

      if (userType === 'vendor') {
        endpoint = '/api/auth/vendor/login';
      } else if (userType === 'admin') {
        endpoint = '/api/auth/admin/login';
      } else {
        // treat "user" as buyer in new backend
        endpoint = '/api/auth/buyer/login';
      }

      const response = await api.post<JwtResponse>(endpoint, loginPayload);

      if (response.data?.token) {
        this.storeAuthData(response.data);
        return response.data;
      } else if ((response.data as any)?.requiresOTP) {
        return response.data;
      }

      throw new Error('Unexpected login response');
    } catch (error: any) {
      console.error(`${userType} login error:`, error);
      throw new Error(error.response?.data || error.message || `${userType} login failed`);
    }
  }

  /**
   * Store authentication data
   */
  private storeAuthData(authData: JwtResponse): void {
    console.log('💾 Storing auth data:', authData);

    if (authData.token) {
      const userToStore = {
        userId: authData.user?.id,
        id: authData.user?.id,
        email: authData.user?.email || (authData as any).email,
        name: authData.user?.name,
        firstName: authData.user?.name,
        role: authData.user?.role,
        roles: authData.user?.role ? [authData.user.role] : (authData as any).roles,
        isVerified: (authData.user as any)?.isVerified,
        type: (authData as any).type,
      };

      console.log('👤 User data being stored:', userToStore);

      localStorage.setItem('authToken', authData.token);
      localStorage.setItem('user', JSON.stringify(userToStore));

      // Derive dashboardRole from user role for dynamic routing
      let dashboardRole = (authData as any).dashboardRole;
      if (!dashboardRole && authData.user?.role) {
        const role = authData.user.role.replace('ROLE_', '').toLowerCase();
        dashboardRole = this.mapRoleToDashboard(role);
      }

      if (dashboardRole) {
        console.log('📍 Storing dashboard role:', dashboardRole);
        localStorage.setItem('dashboardRole', dashboardRole);
      }

      console.log('✅ Auth data stored successfully');
    } else {
      console.warn('⚠️ No token found in auth data, not storing');
    }
  }

  /**
   * Map backend role to dashboard route
   */
  private mapRoleToDashboard(role: string): string {
    const roleMap: { [key: string]: string } = {
      admin: 'admin',
      vendor: 'vendor-panel',
      seller: 'vendor-panel',
      hr: 'hr',
      support: 'hr',
      employee: 'employee',
      data_entry: 'employee',
      finance: 'employee',
      cto: 'admin',
      user: 'user',
      buyer: 'user',
    };

    return roleMap[role] || 'user';
  }

  /**
   * Register new user - uses role-specific endpoint based on userType
   *
   * Backend:
   *  - POST /api/auth/buyer/register
   *  - POST /api/auth/vendor/register
   */
  async register(registerData: RegisterRequestDto & { userType?: string }): Promise<ApiResponse> {
    try {
      const userType = (registerData.userType || 'buyer').toLowerCase();
      let endpoint = '/api/auth/buyer/register';

      if (userType === 'vendor') {
        endpoint = '/api/auth/vendor/register';
      } else if (userType === 'admin') {
        endpoint = '/api/auth/admin/register';
      } else {
        // buyer / user
        endpoint = '/api/auth/buyer/register';
      }

      console.log('🔄 Registering user with endpoint:', endpoint, 'userType:', userType);
      console.log('📤 Register payload:', registerData);

      // Pass data directly to backend without transformation
      // Backend expects: name, email, phone, password, confirmPassword, aadharNumber (buyer), panNumber (vendor), etc.
      const response = await api.post<ApiResponse>(endpoint, registerData);

      console.log('✅ Registration successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Registration error:', error);

      const errorData = error.response?.data;
      if (typeof errorData === 'object' && errorData?.error) {
        const message = errorData.error || 'Registration failed';
        console.error('Error type:', errorData.type, 'Message:', message);
        throw new Error(message);
      }

      const errorMessage =
        error.response?.data?.message ||
        (typeof error.response?.data === 'string' ? error.response.data : null) ||
        error.message ||
        'Registration failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * Send forgot password OTP
   * Backend: POST /api/auth/forgot-password
   */
  async forgotPassword(email: string): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/api/auth/forgot-password', { email } as ForgotPasswordRequestDto);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  }

  /**
   * Verify OTP for forgot password
   * NOTE: Backend sample combines verify + newPassword in /api/auth/verify-forgot-password-otp
   * This method just forwards whatever VerifyOtpRequestDto contains.
   */
  async verifyForgotPasswordOtp(otpData: VerifyOtpRequestDto): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/api/auth/verify-forgot-password-otp', otpData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    }
  }

  /**
   * Set new password after OTP verification
   * If your backend does not have /api/auth/set-password as a separate endpoint,
   * you can call /api/auth/verify-forgot-password-otp with email + otp + newPassword (see resetPassword below).
   */
  async setPassword(passwordData: SetPasswordDto): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/api/auth/set-password', passwordData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }

  /**
   * Verify OTP after login (for password-less login)
   * Backend: POST /api/auth/verify-otp
   */
  async verifyOtp(otpData: VerifyOtpRequestDto): Promise<JwtResponse> {
    try {
      const payload = {
        emailOrPhone: otpData.email || (otpData as any).emailOrPhone,
        otp: otpData.otp,
      };

      const response = await api.post<JwtResponse>('/api/auth/verify-otp', payload);

      if (response.data?.token) {
        this.storeAuthData(response.data);
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || error.message || 'OTP verification failed');
    }
  }

  /**
   * Verify email OTP
   * Backend: POST /api/auth/verify-email-otp
   */
  async verifyEmailOtp(otpData: VerifyOtpRequestDto): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/api/auth/verify-email-otp', otpData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Email verification failed');
    }
  }

  /**
   * Resend email OTP
   * Backend: POST /api/auth/resend-email-otp
   */
  async resendEmailOtp(email: string): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/api/auth/resend-email-otp', { email });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to resend OTP');
    }
  }

  /**
   * Get current user profile
   * Backend: GET /api/users/profile
   */
  async getCurrentUser(): Promise<any> {
    try {
      const response = await api.get<any>('/api/users/profile');
      return (response as any).data || response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user profile');
    }
  }

  /**
   * Logout user
   * Backend: POST /api/auth/logout (if implemented)
   */
  async logout(): Promise<void> {
    console.log('🚪 Logout initiated');

    try {
      await api.post('/api/auth/logout');
      console.log('✅ Backend logout successful');
    } catch (error) {
      console.warn('⚠️ Backend logout failed, continuing with local logout:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      console.log('🧹 Local storage cleared');
      console.log('🔄 Logout completed');
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Get current auth token
   */
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUserFromStorage(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Check email role
   * Backend: POST /api/auth/check-email-role
   */
  async checkEmailRole(email: string): Promise<{ exists: string; role: string; email?: string }> {
    try {
      const response = await api.post<{ exists: string; role: string; email?: string }>('/api/auth/check-email-role', { email });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.response?.data || 'Failed to check email role');
    }
  }

  /**
   * Reset password (single call)
   * Uses backend endpoint:
   *  POST /api/auth/verify-forgot-password-otp
   *  Body: { email, otp, newPassword }
   */
  async resetPassword(resetData: {
    email: string;
    newPassword: string;
    otp: string;
  }): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/api/auth/verify-forgot-password-otp', {
        email: resetData.email,
        otp: resetData.otp,
        newPassword: resetData.newPassword,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
