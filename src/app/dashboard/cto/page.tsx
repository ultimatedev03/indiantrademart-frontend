'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

// CTO dashboard with real system metrics from API
function CTODashboard() {
  const [metrics, setMetrics] = useState<{
    uptime: string | null;
    apiResponse: string | null;
    activeUsers: number | null;
    dbSize: string | null;
    services: any[];
    loading: boolean;
    error: string | null;
  }>({
    uptime: null,
    apiResponse: null,
    activeUsers: null,
    dbSize: null,
    services: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchSystemMetrics();
    const interval = setInterval(fetchSystemMetrics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchSystemMetrics = async () => {
    try {
      // Try to fetch from system health endpoint
      const response = await fetch('/api/admin/system/health', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMetrics(prev => ({
          ...prev,
          uptime: data.uptime || 'N/A',
          apiResponse: data.apiResponse || 'N/A',
          activeUsers: data.activeUsers || 0,
          dbSize: data.dbSize || 'N/A',
          services: data.services || [],
          loading: false,
          error: null
        }));
      } else {
        // If endpoint doesn't exist, show placeholder
        setMetrics(prev => ({
          ...prev,
          loading: false,
          error: 'System health endpoint not available'
        }));
      }
    } catch (err) {
      console.error('Error fetching system metrics:', err);
      setMetrics(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load system metrics'
      }));
    }
  };

  if (metrics.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">CTO Dashboard</h2>
          
          {metrics.error && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4">
              {metrics.error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-700">System Uptime</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{metrics.uptime || '-'}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-700">API Response</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{metrics.apiResponse || '-'}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <p className="text-sm font-medium text-purple-700">Active Users</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{metrics.activeUsers || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
              <p className="text-sm font-medium text-orange-700">DB Size</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{metrics.dbSize || '-'}</p>
            </div>
          </div>
        </div>

        {metrics.services && metrics.services.length > 0 && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">System Health</h3>
            <div className="space-y-3">
              {metrics.services.map((service, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${service.status === 'healthy' ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className="font-medium">{service.name || `Service ${idx + 1}`}</span>
                  </div>
                  <span className={`text-sm ${service.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                    {(service.status || 'unknown').charAt(0).toUpperCase() + (service.status || 'unknown').slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CtoDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace('/auth/cto/login');
      return;
    }

    const role = user?.role?.toString().toLowerCase() || '';
    if (role === 'cto') {
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

  return <CTODashboard />;
}
