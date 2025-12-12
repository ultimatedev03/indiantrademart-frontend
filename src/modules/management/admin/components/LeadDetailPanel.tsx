'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Calendar, Tag, FileText } from 'lucide-react';
import { Lead, LeadStatus } from '@/modules/shared/types/lead';
import { leadApi } from '../services/leadApi';

interface LeadDetailPanelProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const LEAD_STATUS_OPTIONS: LeadStatus[] = ['NEW', 'IN_PROGRESS', 'CONTACTED', 'CONVERTED', 'DROPPED'];

const STATUS_COLORS: Record<LeadStatus, string> = {
  'NEW': 'bg-blue-100 text-blue-800',
  'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
  'CONTACTED': 'bg-purple-100 text-purple-800',
  'CONVERTED': 'bg-green-100 text-green-800',
  'DROPPED': 'bg-red-100 text-red-800',
};

export default function LeadDetailPanel({
  lead,
  isOpen,
  onClose,
  onUpdate,
}: LeadDetailPanelProps) {
  const [status, setStatus] = useState<LeadStatus>('NEW');
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lead) {
      setStatus(lead.status);
      setNotes(lead.notes || '');
    }
  }, [lead]);

  if (!isOpen || !lead) {
    return null;
  }

  const handleStatusChange = async (newStatus: LeadStatus) => {
    setIsUpdating(true);
    setError(null);
    try {
      await leadApi.updateLeadStatus(lead.id, newStatus);
      setStatus(newStatus);
      onUpdate();
    } catch (err) {
      setError('Failed to update status');
      console.error('Error updating status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    setIsUpdating(true);
    setError(null);
    try {
      await leadApi.updateLeadNotes(lead.id, notes);
      onUpdate();
    } catch (err) {
      setError('Failed to save notes');
      console.error('Error saving notes:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-lg z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Lead Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Lead ID & Dates */}
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              <strong>Lead ID:</strong> #{lead.id}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-2" />
              <span>Created: {formatDate(lead.createdAt)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-2" />
              <span>Updated: {formatDate(lead.updatedAt)}</span>
            </div>
          </div>

          <hr />

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Contact Info</h3>
            <div className="flex items-center space-x-3">
              <Mail size={18} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900 font-medium">{lead.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone size={18} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-gray-900 font-medium">{lead.phone}</p>
              </div>
            </div>
          </div>

          <hr />

          {/* Lead Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Lead Details</h3>
            <div>
              <p className="text-sm text-gray-600 mb-1">Service/Product</p>
              <p className="text-gray-900 font-medium">{lead.serviceName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Quantity</p>
              <p className="text-gray-900 font-medium">{lead.quantity}</p>
            </div>
            {lead.sourcePage && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Source Page</p>
                <p className="text-gray-900 text-sm break-all">{lead.sourcePage}</p>
              </div>
            )}
            {lead.triggerType && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Trigger Type</p>
                <p className="text-gray-900 font-medium capitalize">{lead.triggerType}</p>
              </div>
            )}
          </div>

          <hr />

          {/* Status */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Tag size={18} className="mr-2" />
              Status
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {LEAD_STATUS_OPTIONS.map((statusOption) => (
                <button
                  key={statusOption}
                  onClick={() => handleStatusChange(statusOption)}
                  disabled={isUpdating}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    status === statusOption
                      ? `${STATUS_COLORS[statusOption]} ring-2 ring-offset-2 ring-blue-500`
                      : STATUS_COLORS[statusOption]
                  } disabled:opacity-50 cursor-pointer`}
                >
                  {statusOption}
                </button>
              ))}
            </div>
          </div>

          <hr />

          {/* Notes */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <FileText size={18} className="mr-2" />
              Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this lead..."
              disabled={isUpdating}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
            <button
              onClick={handleSaveNotes}
              disabled={isUpdating}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-colors"
            >
              {isUpdating ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
