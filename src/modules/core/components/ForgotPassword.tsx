'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { forgotPassword, verifyForgotPasswordOtp, clearError } from '@/features/auth/authSlice';
import { RootState, AppDispatch } from '@/store';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { toast } from 'react-hot-toast';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export default function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [step, setStep] = useState<'EMAIL' | 'RESET'>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<{[key: string]: string}>({});
  
  const validatePassword = (): boolean => {
    const errors: {[key: string]: string} = {};

    if (!newPassword) {
      errors.newPassword = 'Password is required';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, number, and special character';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    console.log('📧 Sending OTP to:', email);
    const result = await dispatch(forgotPassword(email));
    
    if (forgotPassword.fulfilled.match(result)) {
      console.log('✅ OTP sent successfully');
      toast.success('OTP sent to your email!');
      setStep('RESET');
    } else {
      console.error('❌ Failed to send OTP:', error);
      toast.error(error || 'Failed to send OTP');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    if (!otp || otp.length < 4) {
      toast.error('Please enter a valid OTP');
      return;
    }

    console.log('🔐 Verifying OTP and resetting password...');
    const result = await dispatch(verifyForgotPasswordOtp({
      email,
      otp,
      newPassword
    }));

    if (verifyForgotPasswordOtp.fulfilled.match(result)) {
      console.log('✅ Password reset successfully');
      toast.success('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/auth/user/login');
      }, 1500);
    } else {
      console.error('❌ Password reset failed:', error);
      toast.error(error || 'Password reset failed');
    }
  };

  const handleBackToEmail = () => {
    setStep('EMAIL');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordErrors({});
    dispatch(clearError());
  };

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  if (step === 'RESET') {
    return (
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Step 2 of 2: Enter OTP and new password
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
          <div className="space-y-4">
            {/* Email display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                {email}
              </div>
            </div>

            {/* OTP input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">OTP</label>
              <Input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>

            {/* New password input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {passwordErrors.newPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>}
            </div>

            {/* Confirm password input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {passwordErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>}
            </div>
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </Button>

            <button
              type="button"
              onClick={handleBackToEmail}
              className="w-full text-center text-sm text-indigo-600 hover:text-indigo-500"
            >
              ← Back to email
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Step 1: EMAIL
  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Forgot Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Step 1 of 2: Enter your email to receive an OTP
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </div>

        {error && <div className="text-red-600 text-sm text-center">{error}</div>}

        <div className="space-y-3">
          <Button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Button>

          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full text-center text-sm text-gray-600 hover:text-gray-500"
          >
            ← Back to login
          </button>
        </div>
      </form>
    </div>
  );
}

