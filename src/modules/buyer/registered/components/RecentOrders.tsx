'use client';

import { useState, useEffect } from 'react';
import { EmptyState } from '@/shared/components/EmptyState';

interface Order {
  id: number;
  orderNumber: string;
  productName: string;
  status: string;
  createdAt: string;
  totalAmount: number;
}

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders?limit=5');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.content || data || []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('delivered')) return 'text-green-600';
    if (statusLower.includes('shipped')) return 'text-blue-600';
    if (statusLower.includes('processing')) return 'text-yellow-600';
    if (statusLower.includes('cancelled')) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-md border shadow-sm">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || orders.length === 0) {
    return (
      <div className="bg-white p-6 rounded-md border shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Recent Orders</h3>
          <button className="text-sm text-blue-600 hover:underline">View All</button>
        </div>
        <EmptyState
          icon="📦"
          title="No orders yet"
          description="Your recent orders will appear here. Start shopping to see them!"
          variant="compact"
        />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-md border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Recent Orders</h3>
        <button className="text-sm text-blue-600 hover:underline">View All Orders →</button>
      </div>
      <ul className="space-y-3">
        {orders.slice(0, 5).map((item) => (
          <li key={item.id} className="flex justify-between border-b pb-2 last:border-b-0">
            <div>
              <p className="font-medium text-sm">{item.productName}</p>
              <p className="text-xs text-gray-500">Order #{item.orderNumber}</p>
            </div>
            <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
