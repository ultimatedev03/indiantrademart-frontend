'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login, verifyOtp, clearError } from '@/features/auth/authSlice';
import { RootState, AppDispatch } from '@/store';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';

export default function SupportLoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, otpSent, tempCredentials } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });
  
  const [otpCode, setOtpCode] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Support login attempt for:', formData.emailOrPhone);
    
    const result = await dispatch(login({
      ...formData,
      userType: 'support',
    }));
    
    if (login.fulfilled.match(result)) {
      console.log('Support login successful');
      if (result.payload.user && result.payload.token) {
        const role = result.payload.user.role;
        if (role === 'support') {
          // Employee Support users go to Support dashboard
          router.push('/dashboard/support');
        } else if (role === 'admin') {
          // In case an admin logs in from here
          router.push('/dashboard/admin');
        } else {
          alert('This account is not registered as Support. Access denied.');
          return;
        }
      }
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpCode || !tempCredentials) {
      return;
    }
    
    const result = await dispatch(verifyOtp({
      emailOrPhone: tempCredentials.emailOrPhone,
      otp: otpCode,
    }));
    
    if (verifyOtp.fulfilled.match(result)) {
      console.log('Support OTP verification successful');
      if (result.payload.user) {
        const role = result.payload.user.role;
        if (role === 'support') {
          router.push('/dashboard/support');
        } else if (role === 'admin') {
          router.push('/dashboard/admin');
        } else {
          alert('This account is not registered as Support. Access denied.');
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  if (otpSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Support OTP Verification
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter the OTP sent to your email/phone
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleOtpVerification}>
            <div>
              <Input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter 6-digit OTP"
                required
                maxLength={6}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm text-center font-mono text-lg"
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            
            <div>
              <Button
                type="submit"
                disabled={loading || otpCode.length < 4}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                {loading ? 'Verifying...' : 'Verify Support OTP'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎧</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Support Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Employee support portal for handling tickets and queries
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Input
                name="emailOrPhone"
                type="text"
                value={formData.emailOrPhone}
                onChange={handleChange}
                placeholder="Support Email or Phone"
                required
                autoComplete="username"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Support Password"
                required
                autoComplete="current-password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              {loading ? 'Signing in...' : 'Sign in as Support'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
