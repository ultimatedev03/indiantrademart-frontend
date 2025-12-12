'use client';

import React from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Lead, LeadStatus } from '@/modules/shared/types/lead';

interface LeadListTableProps {
  leads: Lead[];
  isLoading: boolean;
  onRowClick: (lead: Lead) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: LeadStatus | '';
  onStatusFilterChange: (status: LeadStatus | '') => void;
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  'NEW': 'bg-blue-100 text-blue-800',
  'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
  'CONTACTED': 'bg-purple-100 text-purple-800',
  'CONVERTED': 'bg-green-100 text-green-800',
  'DROPPED': 'bg-red-100 text-red-800',
};

const LEAD_STATUS_OPTIONS: LeadStatus[] = ['NEW', 'IN_PROGRESS', 'CONTACTED', 'CONVERTED', 'DROPPED'];

export default function LeadListTable({
  leads,
  isLoading,
  onRowClick,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: LeadListTableProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by email, phone, or service..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as LeadStatus | '')}
            className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-10"
          >
            <option value="">All Statuses</option>
            {LEAD_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
        </div>
      </div>

      {/* Table */}
      {leads.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600 mb-2">No leads found</p>
          <p className="text-sm text-gray-500">
            Leads will appear here once they're submitted through the popup form
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Service</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => (
                  <tr
                    key={lead.id}
                    onClick={() => onRowClick(lead)}
                    className={`border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors ${
                      index === leads.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{lead.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{lead.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{lead.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="truncate max-w-xs block">{lead.serviceName}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(lead.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
