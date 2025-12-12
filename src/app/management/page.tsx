'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { EmptyState } from '@/shared/components/EmptyState';
import {
  AdminStatsPanel,
  UserManagement,
  VendorManagement,
  ProductManagement,
  TicketList,
  TopSellingProductList,
} from '@/modules/management/admin';
import { EmployeeSupportManagement } from '@/modules/employee/data-entry';
import { CreateHRForm, CreateCTOForm } from '@/modules/management/admin';

// CTO Dashboard Component
const CTODashboard = () => (
  <div className="space-y-6">
    <EmptyState
      icon="⚙️"
      title="System Monitoring Dashboard"
      description="Real-time system health, performance metrics, and infrastructure monitoring will be available here. Connect to your monitoring service APIs."
    />
  </div>
);

// HR Dashboard Component
const HRDashboard = () => (
  <div className="space-y-6">
    <EmptyState
      icon="👥"
      title="HR Management Dashboard"
      description="Employee management, attendance tracking, and HR operations will appear here. Connect to your HR backend APIs."
    />
  </div>
);

const ManagementLanding = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div className="max-w-5xl w-full space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Management Portal</h1>
        <p className="mt-2 text-gray-600">
          Choose your role to log in to the management area.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Admin */}
        <Link href="/auth/admin/login" className="block">
          <div className="h-full bg-white p-6 rounded-lg border shadow-sm hover:shadow-md hover:border-red-300 transition">
            <div className="text-3xl mb-3">🔐</div>
            <h2 className="text-lg font-semibold text-gray-900">Admin</h2>
            <p className="mt-1 text-sm text-gray-600">
              System configuration, users, vendors, and high-level controls.
            </p>
          </div>
        </Link>
        {/* CTO */}
        <Link href="/auth/cto/login" className="block">
          <div className="h-full bg-white p-6 rounded-lg border shadow-sm hover:shadow-md hover:border-blue-300 transition">
            <div className="text-3xl mb-3">⚙️</div>
            <h2 className="text-lg font-semibold text-gray-900">CTO</h2>
            <p className="mt-1 text-sm text-gray-600">
              Technical dashboards, system health, and infrastructure.
            </p>
          </div>
        </Link>
        {/* HR */}
        <Link href="/auth/hr/login" className="block">
          <div className="h-full bg-white p-6 rounded-lg border shadow-sm hover:shadow-md hover:border-green-300 transition">
            <div className="text-3xl mb-3">👥</div>
            <h2 className="text-lg font-semibold text-gray-900">HR</h2>
            <p className="mt-1 text-sm text-gray-600">
              Employee records, approvals, and HR operations.
            </p>
          </div>
        </Link>
      </div>
    </div>
  </div>
);

export default function ManagementDashboard() {
  const [activeTab, setActiveTab] = useState('admin');
  const [showCreateHR, setShowCreateHR] = useState(false);
  const [showCreateCTO, setShowCreateCTO] = useState(false);
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const normalizedRole = user?.role?.toLowerCase() || '';

  // Set default tab based on role when logged in
  useEffect(() => {
    if (normalizedRole === 'cto') {
      setActiveTab('cto');
    } else if (normalizedRole === 'hr' || normalizedRole === 'support') {
      setActiveTab('hr');
    } else {
      setActiveTab('admin');
    }
  }, [normalizedRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900" />
      </div>
    );
  }

  // If not logged in, show management landing page with login options
  if (!isAuthenticated) {
    return <ManagementLanding />;
  }

  // When authenticated, just route to the correct role-specific dashboard
  if (normalizedRole === 'admin') {
    if (typeof window !== 'undefined') window.location.href = '/dashboard/admin';
    return null;
  }
  if (normalizedRole === 'cto') {
    if (typeof window !== 'undefined') window.location.href = '/dashboard/cto';
    return null;
  }
  if (normalizedRole === 'hr' || normalizedRole === 'support') {
    if (typeof window !== 'undefined') window.location.href = '/dashboard/hr';
    return null;
  }

  // Non-management roles: show access denied
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">
          This area is for management users only (Admin, CTO, HR).
        </p>
        <Link href="/auth/user/login" className="text-blue-600 hover:text-blue-700 underline">
          Go to User Login
        </Link>
      </div>
    </div>
  );

  const tabs = [
    { id: 'admin', label: 'Admin', icon: '👨‍💼', color: 'red' },
    { id: 'cto', label: 'CTO', icon: '⚙️', color: 'blue' },
    { id: 'hr', label: 'HR', icon: '👥', color: 'green' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'admin':
        return (
          <div className="space-y-8">
            <AdminStatsPanel />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowCreateHR(true)}
                    className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <span className="font-medium text-green-700">👥 Create HR User</span>
                  </button>
                  <button
                    onClick={() => setShowCreateCTO(true)}
                    className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <span className="font-medium text-blue-700">⚙️ Create CTO User</span>
                  </button>
                  <button className="w-full p-3 text-left bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                    <span className="font-medium text-red-700">👤 Manage Users</span>
                  </button>
                  <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                    <span className="font-medium text-purple-700">🏢 Manage Vendors</span>
                  </button>
                  <button className="w-full p-3 text-left bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                    <span className="font-medium text-yellow-700">📦 Manage Products</span>
                  </button>
                </div>
              </div>
              <TopSellingProductList />
            </div>
            <div className="grid grid-cols-1 gap-6">
              <UserManagement />
            </div>
          </div>
        );
      case 'cto':
        return <CTODashboard />;
      case 'hr':
        return <HRDashboard />;
      default:
        return (
          <div className="space-y-8">
            <AdminStatsPanel />
            <TopSellingProductList />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Management Dashboard</h1>
                <p className="text-sm text-gray-500">Unified platform for all management operations</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-4 py-2 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-purple-700">Management</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? `text-${tab.color}-600 border-${tab.color}-600 bg-${tab.color}-50`
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {renderTabContent()}
      </div>

      {/* HR Creation Modal */}
      {showCreateHR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <CreateHRForm
              onSuccess={() => {
                setShowCreateHR(false);
              }}
              onClose={() => setShowCreateHR(false)}
            />
          </div>
        </div>
      )}

      {/* CTO Creation Modal */}
      {showCreateCTO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <CreateCTOForm
              onSuccess={() => {
                setShowCreateCTO(false);
              }}
              onClose={() => setShowCreateCTO(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
