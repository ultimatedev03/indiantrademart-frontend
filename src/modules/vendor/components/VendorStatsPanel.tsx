'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { getVendorProducts, getVendorOrders } from '@/lib/api';
import { cacheManager, CACHE_KEYS, CACHE_TTL } from '@/shared/utils/cacheManager';

interface VendorStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: string;
  monthlyGrowth: string;
}

export default function VendorStatsPanel() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<VendorStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: '₹0',
    monthlyGrowth: '+0%'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Check cache first
        const cachedStats = cacheManager.get<VendorStats>(CACHE_KEYS.VENDOR_STATS);
        if (cachedStats) {
          console.log('📊 Using cached vendor stats');
          setStats(cachedStats);
          setError(null);
          setLoading(false);
          return;
        }
        
        // Load products and orders in parallel
        const [productsResponse, ordersResponse] = await Promise.all([
          getVendorProducts(Number(user.id), 0, 1000).catch(() => ({ data: { content: [] } })),
          getVendorOrders(Number(user.id), 0, 1000).catch(() => ({ data: { content: [] } }))
        ]);

        const products = productsResponse.data.content || productsResponse.data || [];
        const orders = ordersResponse.data.content || ordersResponse.data || [];
        
        // Calculate total revenue
        const totalRevenue = orders.reduce((sum: number, order: any) => {
          return sum + (order.totalAmount || order.amount || order.total || 0);
        }, 0);

        // Calculate monthly growth (simplified - comparing this month vs last month)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const thisMonthOrders = orders.filter((order: any) => {
          const orderDate = new Date(order.orderDate || order.createdAt || order.date);
          return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        });
        
        const lastMonthOrders = orders.filter((order: any) => {
          const orderDate = new Date(order.orderDate || order.createdAt || order.date);
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
        });

        const thisMonthRevenue = thisMonthOrders.reduce((sum: number, order: any) => 
          sum + (order.totalAmount || order.amount || order.total || 0), 0);
        const lastMonthRevenue = lastMonthOrders.reduce((sum: number, order: any) => 
          sum + (order.totalAmount || order.amount || order.total || 0), 0);
        
        const growthPercentage = lastMonthRevenue > 0 
          ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
          : '0';

        const newStats = {
          totalProducts: Array.isArray(products) ? products.length : 0,
          totalOrders: Array.isArray(orders) ? orders.length : 0,
          totalRevenue: `₹${totalRevenue.toLocaleString()}`,
          monthlyGrowth: `${parseFloat(growthPercentage) >= 0 ? '+' : ''}${growthPercentage}%`
        };
        
        setStats(newStats);
        
        // Cache the stats for 5 minutes
        cacheManager.set(CACHE_KEYS.VENDOR_STATS, newStats, CACHE_TTL.MEDIUM);
        
        setError(null);
      } catch (err: any) {
        console.error('Error loading vendor stats:', err);
        setError('Failed to load stats');
        // Keep default values (zeros) on error
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user?.id]);

  const statsArray = [
    { label: "Total Products", value: stats.totalProducts, icon: "📦" },
    { label: "Total Orders", value: stats.totalOrders, icon: "📑" },
    { label: "Total Revenue", value: stats.totalRevenue, icon: "💰" },
    { label: "Monthly Growth", value: stats.monthlyGrowth, icon: "📈" },
  ];

  // Check if vendor is new (no products and no orders)
  const isNewVendor = stats.totalProducts === 0 && stats.totalOrders === 0;

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-4 rounded-md border shadow-sm animate-pulse">
            <div className="w-8 h-6 bg-gray-200 rounded mb-1"></div>
            <div className="w-20 h-4 bg-gray-200 rounded mb-2"></div>
            <div className="w-16 h-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Show empty state for new vendors
  if (isNewVendor) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="text-6xl">🎉</div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Vendor Dashboard!</h3>
        <p className="text-gray-600 text-lg mb-6">You're all set to start selling. Your dashboard is currently empty because you haven't added any products yet.</p>
        <div className="space-y-3 mb-6">
          <p className="text-gray-700 flex items-center justify-center gap-2">
            <span className="text-2xl">📦</span>
            <span>Start by adding your first product</span>
          </p>
          <p className="text-gray-700 flex items-center justify-center gap-2">
            <span className="text-2xl">📍</span>
            <span>Select the locations where you serve</span>
          </p>
          <p className="text-gray-700 flex items-center justify-center gap-2">
            <span className="text-2xl">🎯</span>
            <span>Watch your stats grow as orders come in</span>
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">Quick Start Stats:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {statsArray.map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-xs text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          ➕ Add Your First Product
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {error && (
        <div className="col-span-full bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}
      {statsArray.map((item, i) => (
        <div key={i} className="bg-white p-4 rounded-md border shadow-sm">
          <div className="text-xl mb-1">{item.icon}</div>
          <div className="text-sm text-gray-600">{item.label}</div>
          <div className="font-bold">{item.value}</div>
        </div>
      ))}
    </div>
  )
}
