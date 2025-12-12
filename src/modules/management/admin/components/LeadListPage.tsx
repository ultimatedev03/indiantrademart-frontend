'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { Lead, LeadStatus } from '@/modules/shared/types/lead';
import { leadApi } from '../services/leadApi';
import LeadListTable from './LeadListTable';
import LeadDetailPanel from './LeadDetailPanel';

export default function LeadListPage() {
  // State for list
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  // State for detail panel
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Load leads when filters change
  useEffect(() => {
    loadLeads();
  }, [statusFilter, page, pageSize, searchQuery]);

  const loadLeads = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: This will start returning real data once backend is wired.
      const response = await leadApi.listLeads({
        status: statusFilter || undefined,
        search: searchQuery || undefined,
        page,
        pageSize,
      });

      setLeads(response.items);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load leads');
      console.error('Error loading leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsPanelOpen(true);
  };

  const handleClosePanelPanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => {
      setSelectedLead(null);
    }, 300);
  };

  const handleUpdateLead = () => {
    // Refresh the list after an update
    loadLeads();
  };

  const stats = [
    { label: 'Total Leads', value: total, color: 'bg-blue-100 text-blue-600' },
    {
      label: 'New Leads',
      value: leads.filter((l) => l.status === 'NEW').length,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'In Progress',
      value: leads.filter((l) => l.status === 'IN_PROGRESS').length,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: 'Converted',
      value: leads.filter((l) => l.status === 'CONVERTED').length,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <TrendingUp size={28} className="text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          </div>
          <p className="text-gray-600">
            Track and manage all leads captured from buyer interactions
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Lead List Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <LeadListTable
            leads={leads}
            isLoading={isLoading}
            onRowClick={handleSelectLead}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </div>

        {/* Pagination */}
        {total > pageSize && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {leads.length} of {total} leads
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page * pageSize >= total}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Lead Detail Panel */}
        <LeadDetailPanel
          lead={selectedLead}
          isOpen={isPanelOpen}
          onClose={handleClosePanelPanel}
          onUpdate={handleUpdateLead}
        />
      </div>
    </div>
  );
}
