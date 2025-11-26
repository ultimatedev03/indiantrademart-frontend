'use client';

import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store, AppDispatch } from '@/store';
import { initializeAuth } from '@/features/auth/authSlice';
import { initAuthCleanup } from '@/utils/auth-cleanup';
import { AuthProvider } from '@/contexts/AuthContext';
import { setupAxiosInterceptors } from '@/lib/axios-interceptors';

interface ClientProvidersProps {
  children: React.ReactNode;
}

// AuthInitializer component to dispatch auth initialization
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Set up axios interceptors for 401 handling
    setupAxiosInterceptors();
    
    // First clean up any expired/invalid tokens
    initAuthCleanup();
    
    // Then initialize authentication state on app load
    dispatch(initializeAuth());
  }, [dispatch]);

  return <>{children}</>;
};

const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AuthInitializer>
          {children}
        </AuthInitializer>
      </AuthProvider>
    </Provider>
  );
};

export default ClientProviders;
