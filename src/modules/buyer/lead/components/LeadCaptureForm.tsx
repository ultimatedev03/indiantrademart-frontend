// Module: buyer/lead - popup form for lead-only buyers (no full registration)
'use client';

import React, { useState } from 'react';
import { leadService } from '../services/leadService';

export type LeadCaptureFormProps = {
  productId?: number;
  vendorId?: number;
  initialServiceName?: string;
  onSuccess?: () => void;
  onClose?: () => void;
  triggerType?: 'click' | 'auto';
};

export default function LeadCaptureForm({
  productId,
  vendorId,
  initialServiceName = '',
  onSuccess,
  onClose,
  triggerType = 'click',
}: LeadCaptureFormProps) {

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    quantity: '',
    unit: '',               // 🔥 NEW FIELD
    serviceName: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone is required');
      return false;
    }
    if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
      setError('Please enter a valid phone number');
      return false;
    }
    if (!formData.quantity.toString().trim()) {
      setError('Quantity is required');
      return false;
    }
    if (isNaN(Number(formData.quantity))) {
      setError('Quantity must be a valid number');
      return false;
    }
      // ✅ NEW MANDATORY UNIT CHECK
    if (!formData.unit.trim()) {
      setError('Unit is required');
      return false;
    }
    if (!formData.serviceName.trim()) {
      setError('Service name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await leadService.createLead({
        email: formData.email,
        phone: formData.phone,
        quantity: Number(formData.quantity),
        unit: formData.unit,                // optional: added if backend accepts it
        serviceName: formData.serviceName,
        productId,
        vendorId,
        sourcePage: typeof window !== 'undefined' ? window.location.pathname : '',
        triggerType,
      });

      setSuccess(true);
      setFormData({
        email: '',
        phone: '',
        quantity: '',
        unit: '',
        serviceName: initialServiceName,
      });

      setTimeout(() => {
        onSuccess?.();
        onClose?.();
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Failed to submit lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 text-center">
        <div className="text-green-600 text-4xl mb-4">✓</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Thank you for your interest!
        </h3>
        <p className="text-gray-600">
          We'll get back to you shortly at the email provided.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">

      {/* email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      {/* phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+91 98765 43210"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      {/* service/product */}
      <div>
        <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-1">
          Service/Product Name <span className="text-red-500">*</span>
        </label>
        <input
          id="serviceName"
          type="text"
          name="serviceName"
          value={formData.serviceName}
          onChange={handleChange}
          placeholder="Service or product name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      {/* quantity */}
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
          Quantity <span className="text-red-500">*</span>
        </label>
        <input
          id="quantity"
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="0"
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      {/* NEW UNIT FIELD */}
      <div>
        <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
          Unit <span className="text-red-500">*</span>
        </label>
        <input
          id="unit"
          type="text"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          placeholder="kg, pieces, liters, etc."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      {/* error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Submitting...' : 'Get Quote'}
        </button>

        
      </div>

    </form>
  );
}
