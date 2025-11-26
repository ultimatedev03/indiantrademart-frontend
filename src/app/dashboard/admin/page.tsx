'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import ManagementDashboard from '@/app/management/page';

/**
 * Admin Dashboard route: /dashboard/admin
 *
 * - If not authenticated, redirect to /auth/admin/login
 * - If authenticated as ADMIN, render the (admin-focused) management dashboard UI
 *   Note: CTO and HR have their own dashboards at /dashboard/cto and /dashboard/hr
 * - Otherwise redirect to home
 */
export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace('/auth/admin/login');
      return;
    }

    const role = user?.role?.toString().toLowerCase() || '';
    if (role === 'admin' || role === 'role_admin' || role === 'management') {
      setCanRender(true);
    } else {
      router.replace('/');
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading || !canRender) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900" />
      </div>
    );
  }

  // Reuse the same management dashboard UI for admins
  return <ManagementDashboard />;
}
