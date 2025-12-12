'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth-service';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'BUYER' | 'VENDOR' | 'ADMIN'>('BUYER');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;

      if (userType === 'VENDOR') {
        result = await authService.vendorLogin(email, password);
      } else if (userType === 'ADMIN') {
        result = await authService.adminLogin(email, password);
      } else {
        result = await authService.login(email, password);
      }

      toast.success(`Welcome ${result.user.firstName}!`);

      // Redirect based on role
      if (authService.isVendor()) {
        router.push('/vendor/dashboard');
      } else if (authService.isAdmin()) {
        router.push('/admin/dashboard');
      } else {
        router.push('/buyer/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to ITech
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            B2B Marketplace Platform
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {/* User Type Selection */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Login as:</label>
            <div className="flex gap-4">
              {['BUYER', 'VENDOR', 'ADMIN'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value={type}
                    checked={userType === type}
                    onChange={(e) => setUserType(e.target.value as any)}
                    className="rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          {/* Links */}
          <div className="flex items-center justify-between">
            <a href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot password?
            </a>
            <a href="/auth/register" className="text-sm text-blue-600 hover:text-blue-500">
              Create account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
