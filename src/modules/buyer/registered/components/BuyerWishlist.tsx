'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/Button';
import { EmptyState } from '@/shared/components/EmptyState';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
}

export default function BuyerWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        setWishlist(data.content || data || []);
      } else {
        setWishlist([]);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter(item => item.id !== id));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold">My Wishlist</h2>
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold">My Wishlist</h2>
        <div className="mt-6 space-y-4">
          {wishlist.length === 0 ? (
            <EmptyState
              icon="❤️"
              title="Your wishlist is empty"
              description="Add products to your wishlist to keep track of items you love."
              actionText="Continue Shopping"
              actionLink="/products"
            />
          ) : (
            wishlist.map(item => (
              <div key={item.id} className="flex justify-between items-center border rounded-lg p-4">
                <div>
                  <h3 className="font-medium text-lg">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
                <div>
                  <Button
                    onClick={() => removeFromWishlist(item.id)}
                    className="bg-red-600 text-white hover:bg-red-700 px-3 py-1 rounded-md text-sm"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

