'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function BuyerLandingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: any) => state.auth || {});

  useEffect(() => {
    // If logged in as buyer/user, redirect to dashboard
    if (isAuthenticated && (user?.role === 'BUYER' || user?.role === 'USER')) {
      router.push('/dashboard/user');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
              B
            </div>
            <span className="font-semibold text-gray-900">iTech Buyer Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">Back to Home</Link>
            <Link href="/auth/user/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Your B2B Marketplace for Bulk Purchases
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Find verified suppliers, compare prices, and source products directly from manufacturers and wholesalers.
            </p>
            <p className="text-gray-600 mb-8">
              Get competitive quotes, track orders, and manage your supply chain efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/user/signup" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-center">
                Create Account
              </Link>
              <Link href="/auth/user/login" className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium text-center">
                Sign In
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              New here? <Link href="/auth/user/signup" className="text-blue-600 hover:underline font-semibold">Create a free account</Link> to start shopping
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-8 text-white">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold mb-1">Find Suppliers</h3>
                  <p className="text-white/80 text-sm">Browse verified suppliers and manufacturers</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold mb-1">Request Quotes</h3>
                  <p className="text-white/80 text-sm">Send RFQs and get instant quotes from suppliers</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold mb-1">Compare & Save</h3>
                  <p className="text-white/80 text-sm">Compare prices and get the best deals</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">4</div>
                <div>
                  <h3 className="font-semibold mb-1">Manage Orders</h3>
                  <p className="text-white/80 text-sm">Track orders and manage payments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose iTech?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4 font-bold">✓</div>
              <h3 className="font-semibold text-gray-900 mb-2">Verified Suppliers</h3>
              <p className="text-gray-600">All suppliers verified and quality assured</p>
            </div>
            <div className="p-6 bg-cyan-50 rounded-xl">
              <div className="w-12 h-12 bg-cyan-600 text-white rounded-lg flex items-center justify-center mb-4 font-bold">💳</div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-600">Safe transactions with buyer protection</p>
            </div>
            <div className="p-6 bg-sky-50 rounded-xl">
              <div className="w-12 h-12 bg-sky-600 text-white rounded-lg flex items-center justify-center mb-4 font-bold">📞</div>
              <h3 className="font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-gray-600">24/7 customer support and assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Benefits */}
      <section className="bg-gradient-to-r from-blue-500 to-cyan-600 py-16 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Buyer Benefits</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">50K+</div>
              <p className="text-white/90">Products listed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">5K+</div>
              <p className="text-white/90">Suppliers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">100K+</div>
              <p className="text-white/90">Active buyers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <p className="text-white/90">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Sign Up</h3>
            <p className="text-gray-600 text-sm">Create your free buyer account</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-cyan-600">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Search</h3>
            <p className="text-gray-600 text-sm">Find suppliers and products</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-sky-600">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quote</h3>
            <p className="text-gray-600 text-sm">Request quotes from suppliers</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-blue-600">4</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Order</h3>
            <p className="text-gray-600 text-sm">Place orders and track shipments</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Sourcing Today</h2>
          <p className="text-lg text-gray-600 mb-8">Join thousands of buyers finding suppliers on iTech</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/user/signup" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
              Create Free Account
            </Link>
            <Link href="/auth/user/login" className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2025 iTech Marketplace. Buyer Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
