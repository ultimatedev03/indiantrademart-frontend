'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import type { RootState } from '@/store';

export default function EmployeeLandingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // If already logged in as data-entry employee, redirect to data entry dashboard
    const role = user?.role?.toString().toLowerCase();
    if (isAuthenticated && (role === 'data_entry' || role === 'data-entry')) {
      router.push('/dashboard/employee');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20">

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Employee Portals
          </h1>
          <p className="text-lg text-gray-600">
            Choose your role to access the correct dashboard.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Data Entry */}
          <Link href="/auth/employee/login" className="block">
            <div className="h-full bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md hover:border-indigo-300 transition">
              <div className="text-3xl mb-3">📋</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Data Entry</h2>
              <p className="text-sm text-gray-600 mb-3">
                Manage vendors, KYC, categories and locations for marketplace data.
              </p>
              <span className="inline-flex items-center text-sm font-medium text-indigo-600">
                Login as Data Entry
                <span className="ml-1">→</span>
              </span>
            </div>
          </Link>

          {/* Support */}
          <Link href="/auth/support/login" className="block">
            <div className="h-full bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md hover:border-emerald-300 transition">
              <div className="text-3xl mb-3">🎧</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Support</h2>
              <p className="text-sm text-gray-600 mb-3">
                Solve all queries of customers and vendors via support tickets.
              </p>
              <span className="inline-flex items-center text-sm font-medium text-emerald-600">
                Login as Support
                <span className="ml-1">→</span>
              </span>
            </div>
          </Link>

          {/* Finance */}
          <Link href="/auth/finance/login" className="block">
            <div className="h-full bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md hover:border-orange-300 transition">
              <div className="text-3xl mb-3">💰</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Finance</h2>
              <p className="text-sm text-gray-600 mb-3">
                See leads, sales, payments and invoices for vendors.
              </p>
              <span className="inline-flex items-center text-sm font-medium text-orange-600">
                Login as Finance
                <span className="ml-1">→</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Not sure which portal to use?</h2>
          <p className="text-lg text-white/90 mb-8">
            Data Entry handles listings, Support solves tickets, Finance manages payments and invoices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 font-semibold">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
