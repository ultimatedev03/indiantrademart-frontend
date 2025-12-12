/**
 * 🛡️ Auth Guard Component
 * 
 * Protects routes that require authentication
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

/**
 * Normalize a role string by removing ROLE_ prefix and converting to uppercase
 * 'buyer' -> 'BUYER'
 * 'ROLE_BUYER' -> 'BUYER'
 * 'ROLE_USER' -> 'USER'
 */
const normalizeRole = (role?: string | null): string => {
  if (!role) return '';
  return role
    .toString()
    .trim()
    .toUpperCase()
    .replace(/^ROLE_/, '');
};

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string;
  allowedRoles?: string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  requiredRole,
  allowedRoles,
  fallback,
  redirectTo = '/auth/user/login',
}) => {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);
  const [loadingTimeout, setLoadingTimeout] = React.useState(false);
  
  // Prevent infinite loading state - set max wait of 5 seconds
  React.useEffect(() => {
    if (!loading) {
      setLoadingTimeout(false);
      return;
    }
    
    const timer = setTimeout(() => {
      setLoadingTimeout(true);
      console.warn('⚠️ AuthGuard: Loading state exceeded 5 seconds, proceeding anyway');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  React.useEffect(() => {
    console.log('🛡️ AuthGuard useEffect triggered:', {
      loading,
      isAuthenticated,
      userRole: user?.role,
      requiredRole,
      allowedRoles,
      requireAuth
    });
    
    if (!loading || loadingTimeout) {
      if (requireAuth && !isAuthenticated) {
        console.log('🔒 AuthGuard: User not authenticated, redirecting to:', redirectTo);
        router.push(redirectTo);
        return;
      }
      
      if (isAuthenticated && user) {
        const rawUserRole = user.role || (Array.isArray(user.roles) ? user.roles[0] : null);
        const normalizedUserRole = normalizeRole(rawUserRole);
        
        console.log('🔐 AuthGuard role check', {
          rawUserRole,
          normalizedUserRole,
          requiredRole,
          allowedRoles,
        });
        
        let isRoleValid = false;
        
        if (requiredRole) {
          const normalizedRequired = normalizeRole(requiredRole);
          isRoleValid = normalizedUserRole === normalizedRequired || normalizedUserRole === 'BUYER' && normalizedRequired === 'USER';
        } else if (allowedRoles && allowedRoles.length > 0) {
          const normalizedAllowed = allowedRoles.map(normalizeRole);
          isRoleValid = !!normalizedUserRole && normalizedAllowed.includes(normalizedUserRole);
        } else {
          isRoleValid = true; // No role requirement
        }
        
        if (!isRoleValid) {
          console.warn('🚫 AuthGuard: role not allowed for this page', {
            rawUserRole,
            normalizedUserRole,
            normalizedAllowed: allowedRoles?.map(normalizeRole),
          });
          router.push('/unauthorized');
          return;
        }
        
        console.log('✅ AuthGuard: Access granted');
      }
    }
  }, [isAuthenticated, user, loading, requireAuth, requiredRole, allowedRoles, router, redirectTo]);

  // Show loading state (but timeout after 5 seconds)
  if (loading && !loadingTimeout) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading...(max 5 seconds)</p>
        </div>
      </div>
    );
  }

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  // Check role authorization
  const isRoleAuthorized = () => {
    if (!user) {
      console.log('🚫 No user found');
      return false;
    }
    
    const rawUserRole = user.role || (Array.isArray(user.roles) ? user.roles[0] : null);
    const normalizedUserRole = normalizeRole(rawUserRole);
    
    console.log('🔐 Role Authorization Check:', {
      rawUserRole,
      normalizedUserRole,
      requiredRole,
      allowedRoles
    });
    
    let isMatch = false;
    
    if (requiredRole) {
      const normalizedRequired = normalizeRole(requiredRole);
      isMatch = normalizedUserRole === normalizedRequired || normalizedUserRole === 'BUYER' && normalizedRequired === 'USER';
      console.log('✅ Single role check result:', isMatch);
      return isMatch;
    }
    
    if (allowedRoles && allowedRoles.length > 0) {
      const normalizedAllowed = allowedRoles.map(normalizeRole);
      isMatch = !!normalizedUserRole && normalizedAllowed.includes(normalizedUserRole);
      console.log('✅ Multiple roles check result:', isMatch);
      return isMatch;
    }
    
    return true; // No role requirement
  };

  if (!isRoleAuthorized()) {
    console.log('🚫 AuthGuard: Role check failed. User role:', user?.role, 'Required:', requiredRole || allowedRoles);
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Your role: {user?.role}</p>
          <p className="text-sm text-gray-500">Required: {requiredRole || allowedRoles?.join(', ')}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
