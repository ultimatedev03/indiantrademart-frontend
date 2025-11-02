'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function ManagementLandingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: any) => state.auth || {});
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    // If logged in as management role, redirect to appropriate dashboard
    if (isAuthenticated && user?.role) {
      const managementRoles = ['ADMIN', 'CTO', 'HR', 'MANAGEMENT'];
      if (managementRoles.includes(user.role.toUpperCase())) {
        // Route based on specific role
        if (user.role === 'ADMIN') {
          router.push('/dashboard/admin');
        } else if (user.role === 'CTO') {
          router.push('/dashboard/cto');
        } else if (user.role === 'HR') {
          router.push('/dashboard/hr');
        } else {
          router.push('/dashboard/admin');
        }
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pt-20">

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Management & Operations Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Unified platform for Admins, CTOs, and HR to manage platform operations, system performance, and team.
          </p>
          <p className="text-gray-600">
            Control your marketplace, monitor systems, and lead your organization.
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Admin Card */}
          <div onClick={() => setSelectedRole('ADMIN')} className="cursor-pointer group">
            <div className={`p-6 border-2 rounded-xl transition-all ${
              selectedRole === 'ADMIN' 
                ? 'border-red-600 bg-red-50 shadow-lg' 
                : 'border-red-200 bg-red-50/50 hover:border-red-400 hover:shadow-md'
            }`}>
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg flex items-center justify-center mb-4 font-bold text-lg">
                A
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Admin Portal</h3>
              <p className="text-gray-600 mb-4">Platform administration and vendor management</p>
              <ul className="text-sm text-gray-700 space-y-2 mb-4">
                <li className="flex items-center gap-2">
                  <span className="text-red-600">✓</span> User management
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-600">✓</span> Vendor verification
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-600">✓</span> Commission settings
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-600">✓</span> Dispute resolution
                </li>
              </ul>
              <Link href="/auth/admin/login" className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm transition-colors">
                Admin Login
              </Link>
            </div>
          </div>

          {/* CTO Card */}
          <div onClick={() => setSelectedRole('CTO')} className="cursor-pointer group">
            <div className={`p-6 border-2 rounded-xl transition-all ${
              selectedRole === 'CTO' 
                ? 'border-blue-600 bg-blue-50 shadow-lg' 
                : 'border-blue-200 bg-blue-50/50 hover:border-blue-400 hover:shadow-md'
            }`}>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg flex items-center justify-center mb-4 font-bold text-lg">
                C
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">CTO Portal</h3>
              <p className="text-gray-600 mb-4">Technical operations and system monitoring</p>
              <ul className="text-sm text-gray-700 space-y-2 mb-4">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> System health
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> API monitoring
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Performance metrics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Error tracking
                </li>
              </ul>
              <Link href="/auth/cto/login" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors">
                CTO Login
              </Link>
            </div>
          </div>

          {/* HR Card */}
          <div onClick={() => setSelectedRole('HR')} className="cursor-pointer group">
            <div className={`p-6 border-2 rounded-xl transition-all ${
              selectedRole === 'HR' 
                ? 'border-green-600 bg-green-50 shadow-lg' 
                : 'border-green-200 bg-green-50/50 hover:border-green-400 hover:shadow-md'
            }`}>
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg flex items-center justify-center mb-4 font-bold text-lg">
                H
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">HR Portal</h3>
              <p className="text-gray-600 mb-4">Human resources and team management</p>
              <ul className="text-sm text-gray-700 space-y-2 mb-4">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Employee records
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Attendance tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Payroll management
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Leave management
                </li>
              </ul>
              <Link href="/auth/hr/login" className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-colors">
                HR Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Platform Capabilities</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-red-50 rounded-xl">
              <div className="w-12 h-12 bg-red-600 text-white rounded-lg flex items-center justify-center mb-4 font-bold">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">Admin Control</h3>
              <p className="text-gray-600">Full platform administration, vendor verification, payment management, and user oversight</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4 font-bold">⚙️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Technical Oversight</h3>
              <p className="text-gray-600">System monitoring, API health checks, performance optimization, and infrastructure management</p>
            </div>
            <div className="p-6 bg-green-50 rounded-xl">
              <div className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center mb-4 font-bold">👥</div>
              <h3 className="font-semibold text-gray-900 mb-2">Team Management</h3>
              <p className="text-gray-600">Employee management, payroll, attendance, performance reviews, and HR operations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Management Dashboard Preview */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Dashboard Features</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-4">Real-Time Analytics</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Platform metrics & KPIs</li>
              <li>✓ User growth tracking</li>
              <li>✓ Transaction monitoring</li>
              <li>✓ Revenue analytics</li>
            </ul>
          </div>
          <div className="p-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-4">System Health</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Server status</li>
              <li>✓ Database performance</li>
              <li>✓ API response times</li>
              <li>✓ Error rate monitoring</li>
            </ul>
          </div>
          <div className="p-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-4">Vendor Management</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Approve/reject vendors</li>
              <li>✓ KYC verification</li>
              <li>✓ Commission tracking</li>
              <li>✓ Dispute resolution</li>
            </ul>
          </div>
          <div className="p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-4">Team Operations</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Employee directory</li>
              <li>✓ Payroll management</li>
              <li>✓ Leave tracking</li>
              <li>✓ Performance reviews</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Access Your Dashboard?</h2>
          <p className="text-lg text-white/90 mb-8">Select your role above and sign in to your management portal</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="px-8 py-3 border border-white text-white rounded-lg hover:bg-white/10 font-semibold">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
