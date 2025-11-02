'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function EmployeeLandingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: any) => state.auth || {});

  useEffect(() => {
    // If already logged in as employee, redirect to dashboard
    if (isAuthenticated && user?.role === 'EMPLOYEE') {
      router.push('/dashboard/employee');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20">

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Employee Operations Portal
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Manage vendor onboarding, KYC verification, product categories, and locations from a single dashboard.
            </p>
            <p className="text-gray-600 mb-8">
              Access real-time analytics, approve vendors, and streamline operational workflows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/employee/login" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-center">
                Login to Dashboard
              </Link>
              <Link href="/" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-center">
                Learn More
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold mb-1">Vendor Onboarding</h3>
                  <p className="text-white/80 text-sm">Create, approve, and manage vendor registrations</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold mb-1">KYC Management</h3>
                  <p className="text-white/80 text-sm">Review and approve KYC documents</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold mb-1">Data Management</h3>
                  <p className="text-white/80 text-sm">Manage categories, locations, and site data</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">4</div>
                <div>
                  <h3 className="font-semibold mb-1">Analytics</h3>
                  <p className="text-white/80 text-sm">View operational metrics and insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-indigo-50 rounded-xl">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-lg flex items-center justify-center mb-4 font-bold">📋</div>
              <h3 className="font-semibold text-gray-900 mb-2">Pending Approvals</h3>
              <p className="text-gray-600">See and approve vendors waiting for verification</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center mb-4 font-bold">📄</div>
              <h3 className="font-semibold text-gray-900 mb-2">Document Review</h3>
              <p className="text-gray-600">Upload and verify KYC documents securely</p>
            </div>
            <div className="p-6 bg-pink-50 rounded-xl">
              <div className="w-12 h-12 bg-pink-600 text-white rounded-lg flex items-center justify-center mb-4 font-bold">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Quick Actions</h3>
              <p className="text-gray-600">One-click approvals and instant updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-white/90 mb-8">Login to your account to access the employee dashboard</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/employee/login" className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 font-semibold">
              Login Now
            </Link>
            <Link href="/" className="px-8 py-3 border border-white text-white rounded-lg hover:bg-white/10 font-semibold">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
