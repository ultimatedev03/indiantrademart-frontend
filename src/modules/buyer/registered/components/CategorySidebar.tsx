'use client';

import { useState, useEffect } from 'react';
import { EmptyState } from '@/shared/components/EmptyState';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export default function CategorySidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.content || data || []);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-md border shadow-sm">
        <h3 className="font-semibold mb-4">Categories</h3>
        <ul className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <li key={i} className="h-4 bg-gray-200 rounded animate-pulse"></li>
          ))}
        </ul>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white p-6 rounded-md border shadow-sm">
        <h3 className="font-semibold mb-4">Categories</h3>
        <EmptyState
          icon="📋"
          title="No categories"
          description="Categories will appear here soon"
          variant="compact"
        />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-md border shadow-sm">
      <h3 className="font-semibold mb-4">Categories</h3>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat.id} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
