'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import CategoriesManagement from './categories';
import LocationsManagement from './locations';
import VendorsManagement from './vendors';
import ProductsManagement from './products';
import { AlertCircle } from 'lucide-react';

const DataEntryDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has data-entry role
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'DATA_ENTRY' && userRole !== 'ADMIN') {
      setError('You do not have permission to access this page');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Data Entry Management</h1>
          <p className="text-gray-600">Manage categories, locations, vendors, and products</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-t-lg border-b">
              <TabsTrigger value="categories">
                <span>📂 Categories</span>
              </TabsTrigger>
              <TabsTrigger value="locations">
                <span>📍 Locations</span>
              </TabsTrigger>
              <TabsTrigger value="vendors">
                <span>🏪 Vendors</span>
              </TabsTrigger>
              <TabsTrigger value="products">
                <span>📦 Products</span>
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="categories" className="mt-0">
                <CategoriesManagement />
              </TabsContent>

              <TabsContent value="locations" className="mt-0">
                <LocationsManagement />
              </TabsContent>

              <TabsContent value="vendors" className="mt-0">
                <VendorsManagement />
              </TabsContent>

              <TabsContent value="products" className="mt-0">
                <ProductsManagement />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DataEntryDashboard;
