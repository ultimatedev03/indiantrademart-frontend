'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import EmployeeFinanceManagement from '@/modules/employee/data-entry/components/EmployeeFinanceManagement';

export default function FinanceDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace('/auth/employee/login');
      return;
    }

    const role = user?.role?.toString().toLowerCase() || '';
    // For now, restrict to data_entry; you can introduce a dedicated finance role later
    if (role === 'finance') {
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

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EmployeeFinanceManagement />
      </div>
    </div>
  );
}
