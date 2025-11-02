import { useEffect, useState } from 'react';
import { authService } from '@/services';

interface User {
  id?: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      const profile = await authService.getProfile();
      setUser(profile);
      setIsAuthenticated(true);
    } catch (err: any) {
      setIsAuthenticated(false);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login({ emailOrPhone: email, password });
      const profile = await authService.getProfile();
      setUser(profile);
      setIsAuthenticated(true);
      return response;
    } catch (err: any) {
      setIsAuthenticated(false);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.registerUser({ email, phone: '', name: firstName + ' ' + lastName, password });
      const response = await authService.login({ emailOrPhone: email, password });
      const profile = await authService.getProfile();
      setUser(profile);
      setIsAuthenticated(true);
      return response;
    } catch (err: any) {
      setIsAuthenticated(false);
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err: any) {
      setError(err.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (firstName: string, lastName: string, phone?: string) => {
    try {
      setError(null);
      const updatedUser = await authService.updateProfile({ firstName, lastName, phone });
      setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setError(null);
      await authService.changePassword({ currentPassword: oldPassword, newPassword });
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
      throw err;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setError(null);
      await authService.forgotPassword({ email });
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
      throw err;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    checkAuth,
  };
}
