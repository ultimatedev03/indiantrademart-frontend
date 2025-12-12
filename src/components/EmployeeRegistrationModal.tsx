'use client';

import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function EmployeeRegistrationModal({ onClose, onSuccess }: Props) {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    role: 'dataentry' as 'dataentry' | 'support' | 'finance',
    password: '',
    confirmPassword: ''
  });
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [skipOtp, setSkipOtp] = useState(true); // Direct creation without OTP
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.displayName.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone is required');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const rolePath = formData.role === 'dataentry' ? 'data-entry' : formData.role;
      
      // If skipOtp is true, use direct registration endpoint; otherwise use OTP flow
      const endpoint = skipOtp ? `${API_BASE_URL}/auth/${rolePath}/register-direct` : `${API_BASE_URL}/auth/${rolePath}/register`;
      
      const response = await axios.post(endpoint, {
        name: formData.displayName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (skipOtp) {
        // Direct creation - show success and close
        setSuccess('Employee created successfully!');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        // OTP flow - move to OTP step
        if (response.data?.success || response.data?.message) {
          setStep('otp');
          setError('');
        }
      }
    } catch (err: any) {
      let errorMsg = 'Failed to create employee';
      
      // Handle different error response formats
      if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (typeof err.response?.data === 'string') {
        errorMsg = err.response.data;
      } else if (err.response?.status === 400) {
        // Handle 400 Bad Request with plain text response
        errorMsg = 'This email is already registered. Please use a different email or login with existing account.';
      } else if (err.response?.status === 404) {
        // If direct registration endpoint doesn't exist, fallback to OTP
        setSkipOtp(false);
        setStep('form');
        errorMsg = 'Fallback to OTP verification...';
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        emailOrPhone: formData.email,
        otp: otpCode
      });

      if (response.data) {
        setSuccess('Employee registered successfully!');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {step === 'form' ? 'Create New Employee' : 'Verify OTP'}
          </h3>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-700">×</button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">{success}</div>}

        {step === 'form' ? (
          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="flex items-center space-x-2 mb-3 p-2 bg-blue-50 rounded-md">
              <input
                type="checkbox"
                id="skipOtp"
                checked={skipOtp}
                onChange={(e) => setSkipOtp(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="skipOtp" className="text-sm font-medium text-gray-700">
                Create directly (no OTP verification needed)
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              >
                <option value="dataentry">Data Entry</option>
                <option value="support">Support</option>
                <option value="finance">Finance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Enter the OTP sent to {formData.email}
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="w-full py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify & Create'}
            </button>
            <button
              type="button"
              onClick={() => setStep('form')}
              className="w-full py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
            >
              Back to Form
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
