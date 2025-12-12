// Module: employee/data-entry - Category & product CRUD, data entry dashboards
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import EmployeeDashboardTabs from './EmployeeDashboardTabs';

export default function EmployeeDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace('/auth/employee/login');
      return;
    }

    // Allow multiple employee roles
    const role = user?.role?.toString().toLowerCase() || '';
    const allowedRoles = ['data_entry', 'data-entry', 'support', 'finance', 'employee'];
    
    if (allowedRoles.includes(role) || role.includes('entry') || role.includes('support') || role.includes('finance')) {
      setCanRender(true);
    } else {
      console.warn('Unauthorized role:', role);
      router.replace('/unauthorized');
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading || !canRender) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployeeDashboardTabs />
    </div>
  );
}
