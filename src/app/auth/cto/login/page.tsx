'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login, verifyOtp, clearError } from '@/features/auth/authSlice';
import { RootState, AppDispatch } from '@/store';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import AuthRedirect from '@/modules/core/components/AuthRedirect';

export default function CTOLoginPage() {
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
    console.log('CTO login attempt for:', formData.emailOrPhone);
    
    const result = await dispatch(login({
      ...formData,
      userType: 'cto',
    }));
    
    if (login.fulfilled.match(result)) {
      console.log('CTO login successful');
      if (result.payload.user && result.payload.token) {
        if (result.payload.user.role === 'cto') {
          // CTO users land on their own CTO dashboard
          router.push('/dashboard/cto');
        } else {
          alert('This account is not registered as a CTO. Access denied.');
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
      console.log('CTO OTP verification successful');
      if (result.payload.user && result.payload.user.role === 'cto') {
        router.push('/dashboard/cto');
      } else {
        alert('This account is not registered as a CTO. Access denied.');
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
              CTO OTP Verification
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
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center font-mono text-lg"
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            
            <div>
              <Button
                type="submit"
                disabled={loading || otpCode.length < 4}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Verifying...' : 'Verify CTO OTP'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthRedirect />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">CTO</span>
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              CTO Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Chief Technical Officer Portal
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
                  placeholder="CTO Email or Phone"
                  required
                  autoComplete="username"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                />
              </div>
              <div>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="CTO Password"
                  required
                  autoComplete="current-password"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Signing in...' : 'Sign in as CTO'}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                <a href="/auth/user/login" className="font-medium text-blue-600 hover:text-blue-500">
                  User Login
                </a>
                {' | '}
                <a href="/auth/admin/login" className="font-medium text-purple-600 hover:text-purple-500">
                  Admin Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
