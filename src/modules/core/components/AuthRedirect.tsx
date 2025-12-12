'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function AuthRedirect() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Immediately redirect on user change - don't wait for other state updates
    if (!isAuthenticated || !user?.role) {
      return;
    }
    console.log('🔄 AuthRedirect: User authenticated with role:', user.role);
      
      // Map user roles to their respective dashboards
      const dashboardMap: { [key: string]: string } = {
        // Buyer / user
        USER: '/dashboard/buyer',
        user: '/dashboard/buyer',
        BUYER: '/dashboard/buyer',
        buyer: '/dashboard/buyer',
        // Vendor / seller
        VENDOR: '/dashboard/vendor-panel',
        vendor: '/dashboard/vendor-panel',
        SELLER: '/dashboard/vendor-panel',
        seller: '/dashboard/vendor-panel',
        // Admin / management routes
        ADMIN: '/dashboard/admin',
        admin: '/dashboard/admin',
        MANAGEMENT: '/management',
        management: '/management',
        // Support / HR -> HR / Support dashboards
        SUPPORT: '/dashboard/hr',
        support: '/dashboard/hr',
        HR: '/dashboard/hr',
        hr: '/dashboard/hr',
        // Finance
        FINANCE: '/dashboard/finance',
        finance: '/dashboard/finance',
        // CTO -> CTO dashboard
        CTO: '/dashboard/cto',
        cto: '/dashboard/cto',
        // Data entry employees -> Employee dashboard
        DATA_ENTRY: '/dashboard/employee',
        'data_entry': '/dashboard/employee',
        'DATA-ENTRY': '/dashboard/employee',
        'data-entry': '/dashboard/employee',
      };
      
      // Normalize the role (remove ROLE_ prefix if present)
      const userRole = user.role.replace('ROLE_', '');
      const dashboardPath = dashboardMap[userRole] ?? dashboardMap[userRole.toUpperCase()];
      
      console.log('🔄 AuthRedirect: Normalized role:', userRole, 'Dashboard path:', dashboardPath);
      
      if (dashboardPath) {
        console.log('✅ AuthRedirect: Redirecting to dashboard:', dashboardPath);
        router.replace(dashboardPath);
      } else {
        console.warn('⚠️ AuthRedirect: Role not recognized, redirecting to home. Role:', userRole);
        // Fallback to home if role not recognized
        router.replace('/');
      }
  }, [isAuthenticated, user?.role, router]);

  return null;
}

