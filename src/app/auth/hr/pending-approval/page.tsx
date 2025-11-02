'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function PendingApprovalPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/auth/hr/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-lg shadow-xl p-8">
        <div>
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">⏳</span>
            </div>
          </div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Pending Approval
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your HR account is awaiting admin approval
          </p>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">What's next?</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="mr-3 text-yellow-600">1.</span>
              <span>Your registration has been submitted successfully.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-yellow-600">2.</span>
              <span>The admin will review your application.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-yellow-600">3.</span>
              <span>You will receive an email notification once approved.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-yellow-600">4.</span>
              <span>After approval, you can access the HR portal.</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong className="text-gray-900">Approval Timeframe:</strong> Usually within 24-48 hours
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Go to Login
          </button>
          <button
            onClick={() => router.push('/auth/hr/register')}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Back to Registration
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Questions? Contact admin at support@company.com</p>
        </div>
      </div>
    </div>
  );
}
