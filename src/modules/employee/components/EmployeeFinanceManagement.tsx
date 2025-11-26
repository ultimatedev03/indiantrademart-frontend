'use client';

import React, { useState, useEffect } from 'react';
import { financePaymentAPI } from '@/shared/services/financePaymentApi';

interface PackageSale {
  id: number;
  packageName: string;
  customerName: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

interface Lead {
  id: number;
  leadName: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED';
  source: string;
  createdAt: string;
}

/**
 * Employee Finance Management Component
 * 
 * Handles financial operations for employee dashboard
 * Features:
 * - Package sales management
 * - Lead generation and tracking
 * - Payment tracking
 * - Commission reports
 */
export default function EmployeeFinanceManagement() {
  const [activeView, setActiveView] = useState<'packages' | 'leads' | 'payments'>('packages');
  const [packageSales, setPackageSales] = useState<PackageSale[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalLeads: 0,
    convertedLeads: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadData();
  }, [activeView]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load data based on active view
      if (activeView === 'payments') {
        await loadPayments();
      }
      // For packages and leads, you'd call respective APIs
    } catch (error) {
      console.error('Error loading finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPayments = async () => {
    try {
      const response = await financePaymentAPI.payments.getUserPayments(0, 20);
      console.log('Payments loaded:', response);
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Finance & Sales Management</h2>
            <p className="text-gray-600 mt-1">
              Manage package sales, leads, and track payments
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="px-4 py-2 bg-emerald-50 rounded-lg">
              <span className="text-sm font-medium text-emerald-700">Employee Finance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">Total Sales</p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">{stats.totalSales}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center">
              <span className="text-emerald-700 text-lg">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Active Leads</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalLeads}</p>
            </div>
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
              <span className="text-blue-700 text-lg">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Converted</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.convertedLeads}</p>
            </div>
            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
              <span className="text-purple-700 text-lg">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Revenue</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
              <span className="text-orange-700 text-lg">💵</span>
            </div>
          </div>
        </div>
      </div>

      {/* View Selector */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('packages')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'packages'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📦 Package Sales
          </button>
          <button
            onClick={() => setActiveView('leads')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'leads'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🎯 Lead Management
          </button>
          <button
            onClick={() => setActiveView('payments')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'payments'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            💳 Payment Tracking
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white p-6 rounded-lg shadow">
        {activeView === 'packages' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Package Sales</h3>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                + New Sale
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-lg font-medium">No package sales yet</p>
                <p className="text-sm">Start selling packages to users and vendors</p>
              </div>
            </div>
          </div>
        )}

        {activeView === 'leads' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Lead Management</h3>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                + New Lead
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">🎯</div>
                <p className="text-lg font-medium">No leads yet</p>
                <p className="text-sm">Add leads to track potential customers</p>
              </div>
            </div>
          </div>
        )}

        {activeView === 'payments' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Payment Tracking</h3>
              <div className="flex space-x-2">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Completed</option>
                  <option>Failed</option>
                </select>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      <div className="text-5xl mb-3">💳</div>
                      <p className="text-lg font-medium">No payments found</p>
                      <p className="text-sm">Payment records will appear here</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-left">
            <div className="text-2xl mb-2">📊</div>
            <p className="font-medium text-gray-900">Generate Report</p>
            <p className="text-sm text-gray-600">Create financial report</p>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
            <div className="text-2xl mb-2">📧</div>
            <p className="font-medium text-gray-900">Send Invoice</p>
            <p className="text-sm text-gray-600">Email invoice to customer</p>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left">
            <div className="text-2xl mb-2">📈</div>
            <p className="font-medium text-gray-900">View Analytics</p>
            <p className="text-sm text-gray-600">See sales analytics</p>
          </button>
        </div>
      </div>
    </div>
  );
}
