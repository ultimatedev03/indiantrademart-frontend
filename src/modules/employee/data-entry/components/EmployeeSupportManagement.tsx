'use client';

import React, { useState, useEffect } from 'react';
import { TicketManagement } from '@/modules/employee/support';

/**
 * Employee Support Management Component
 * 
 * Handles customer support ticket management for employee dashboard
 * Features:
 * - View all support tickets
 * - Filter by status and priority
 * - Respond to customer queries
 * - Update ticket status
 * - Assign tickets to team members
 */
export default function EmployeeSupportManagement() {
  const [stats, setStats] = useState({
    open: 0,
    inProgress: 0,
    resolved: 0,
    avgResponse: '-'
  });

  useEffect(() => {
    // Stats will be calculated from real data fetched in TicketManagement
    // For now, we show loading placeholders
  }, []);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Support Ticket Management</h2>
            <p className="text-gray-600 mt-1">
              Manage customer support tickets and resolve queries
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="px-4 py-2 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-700">Employee Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Open Tickets</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">-</p>
            </div>
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
              <span className="text-blue-700 text-lg">📥</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">In Progress</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">-</p>
            </div>
            <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
              <span className="text-yellow-700 text-lg">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Resolved Today</p>
              <p className="text-2xl font-bold text-green-900 mt-1">-</p>
            </div>
            <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
              <span className="text-green-700 text-lg">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Avg Response</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">-</p>
            </div>
            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
              <span className="text-purple-700 text-lg">⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Ticket Management Component */}
      <TicketManagement />
    </div>
  );
}
