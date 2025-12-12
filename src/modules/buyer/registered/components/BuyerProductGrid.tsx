'use client';

import { useState, useEffect } from 'react';
import { EmptyState } from '@/shared/components/EmptyState';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: { name: string };
}

export default function BuyerProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?limit=8');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.content || data || []);
        setError(null);
      } else {
        setProducts([]);
        setError('Failed to load products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
      setError('Unable to load products');
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (product: Product) => {
    if (product.imageUrl) {
      if (product.imageUrl.startsWith('http')) return product.imageUrl;
      return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${product.imageUrl}`;
    }
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48L3N2Zz4=';
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-md border shadow-sm">
        <h3 className="font-semibold mb-4">Featured Products</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border p-3 rounded-md animate-pulse">
              <div className="bg-gray-300 h-24 mb-2 rounded" />
              <div className="bg-gray-200 h-4 mb-2 rounded" />
              <div className="bg-gray-200 h-3 w-16 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="bg-white p-6 rounded-md border shadow-sm">
        <h3 className="font-semibold mb-4">Featured Products</h3>
        <EmptyState
          icon="🛍️"
          title="No products available"
          description="Browse our catalog or check back later for new products."
          actionText="Browse All Products"
          actionLink="/products"
          variant="compact"
        />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-md border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Featured Products</h3>
        <a href="/products" className="text-sm text-blue-600 hover:underline">View all →</a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-3 rounded-md hover:shadow-md transition-shadow">
            <div className="bg-gray-200 h-24 mb-2 rounded overflow-hidden relative">
              <img
                src={getProductImage(product)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-semibold truncate">{product.name}</p>
            <p className="text-xs text-gray-500 mb-2">₹{product.price?.toFixed(2) || '0'}</p>
            {product.category && <p className="text-xs text-gray-400 mb-2">{product.category.name}</p>}
            <button className="mt-2 text-xs bg-black text-white px-2 py-1 rounded-md w-full hover:bg-gray-800">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

