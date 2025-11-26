/**
 * Axios Interceptor Setup for Redux Integration
 * Handles 401 responses by dispatching forceLogout action
 * and redirecting to login
 */

import axios from 'axios';
import { store } from '@/store';
import { forceLogout } from '@/store/slices/authSlice';

let interceptorSetup = false;

export const setupAxiosInterceptors = () => {
  if (interceptorSetup) return;
  interceptorSetup = true;

  const instance = axios;

  // Response interceptor for 401 errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;

      // Handle 401 Unauthorized
      if (status === 401) {
        console.warn('🔐 Received 401 - User session expired or invalid token');
        
        // Dispatch Redux logout action
        store.dispatch(forceLogout());

        // Redirect to login
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          const loginPath = '/auth/login';
          
          // Avoid redirect if already on login page
          if (!currentPath.includes('/auth/login')) {
            window.location.href = loginPath;
          }
        }
      }

      return Promise.reject(error);
    }
  );

  console.log('✅ Axios interceptors setup complete');
};

export default setupAxiosInterceptors;
