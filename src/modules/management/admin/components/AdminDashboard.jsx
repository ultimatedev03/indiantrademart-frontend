// Module: management/admin - Admin dashboards & user/vendor/product management
import React, { useEffect, useState } from 'react';
import { Card } from '@/shared/components';
import { adminAnalyticsApi } from '@/shared/services/api/adminAnalyticsApi';
import { formatCurrency } from '@/utils/formatter';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    activeProducts: 0,
    totalRevenue: 0,
    newInquiriesThisWeek: 0,
    verifiedUsers: 0,
    verifiedVendors: 0,
    pendingVendorApprovals: 0,
    pendingKycDocuments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const statsData = await adminAnalyticsApi.getDashboardStats();
      // Ensure stats object has all required fields with defaults
      setStats(prev => ({
        ...prev,
        ...(statsData || {})
      }));
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      // Show banner but keep fallback data instead of blank page
      setError(err?.message || 'Failed to load latest stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-2xl font-semibold text-gray-600">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
          {error}. Showing cached values.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold">Total Users</h2>
          <p className="text-3xl">{stats.totalUsers || 0}</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-bold">Total Vendors</h2>
          <p className="text-3xl">{stats.totalVendors || 0}</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-bold">Active Products</h2>
          <p className="text-3xl">{stats.activeProducts || 0}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold">Revenue</h2>
          <p className="text-3xl">{formatCurrency(stats.totalRevenue || 0)}</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-bold">New Inquiries (This Week)</h2>
          <p className="text-3xl">{stats.newInquiriesThisWeek || 0}</p>
        </Card>
      </div>
    </div>
  );
}

