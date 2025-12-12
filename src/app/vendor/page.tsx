'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function VendorLandingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: any) => state.auth || {});

  useEffect(() => {
    // If logged in as vendor, redirect to dashboard
    if (isAuthenticated && (user?.role === 'VENDOR' || user?.role === 'SELLER')) {
      router.push('/dashboard/vendor-panel');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-20">

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Grow Your Business with iTech
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Connect with thousands of buyers and expand your market reach. Manage products, track orders, and grow your sales on our platform.
            </p>
            <p className="text-gray-600 mb-8">
              Get verified, list your products, and start selling today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/vendor/register" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-center">
                Create Account
              </Link>
              <Link href="/auth/vendor/login" className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 font-medium text-center">
                Login
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              New to iTech? <Link href="/auth/vendor/register" className="text-green-600 hover:underline font-semibold">Create an account</Link> to get started
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold mb-1">Get Verified</h3>
                  <p className="text-white/80 text-sm">Complete KYC and get verified in 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold mb-1">List Products</h3>
                  <p className="text-white/80 text-sm">Add your products and manage inventory</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold mb-1">Get Orders</h3>
                  <p className="text-white/80 text-sm">Receive orders from buyers across the country</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">4</div>
                <div>
                  <h3 className="font-semibold mb-1">Grow Revenue</h3>
                  <p className="text-white/80 text-sm">Scale your business with our marketplace</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Join iTech?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-green-50 rounded-xl">
              <div className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center mb-4 font-bold">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-2">Wider Reach</h3>
              <p className="text-gray-600">Access thousands of qualified buyers across industries</p>
            </div>
            <div className="p-6 bg-emerald-50 rounded-xl">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-lg flex items-center justify-center mb-4 font-bold">💰</div>
              <h3 className="font-semibold text-gray-900 mb-2">Higher Sales</h3>
              <p className="text-gray-600">Increase revenue with access to B2B marketplace</p>
            </div>
            <div className="p-6 bg-teal-50 rounded-xl">
              <div className="w-12 h-12 bg-teal-600 text-white rounded-lg flex items-center justify-center mb-4 font-bold">🛡️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Trusted Platform</h3>
              <p className="text-gray-600">Secure payments and buyer protection</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Benefits */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 py-16 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Vendor Benefits</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">24hrs</div>
              <p className="text-white/90">Instant verification</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">0%</div>
              <p className="text-white/90">Setup fee</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">10K+</div>
              <p className="text-white/90">Active buyers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <p className="text-white/90">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white border-2 border-green-200 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Selling?</h2>
          <p className="text-lg text-gray-600 mb-8">Join thousands of vendors making more money on iTech</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/vendor/register" className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
              Create Free Account
            </Link>
            <Link href="/auth/vendor/login" className="px-8 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 font-semibold">
              Login
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
