'use client';

import { useAppDispatch, useProductsList, useProductsLoading, useProductsError } from '@/store/hooks';
import { fetchProducts } from '@/store/slices/productSlice';
import { useEffect } from 'react';

/**
 * Example Component: Product Listing
 * This component demonstrates how to use Redux slices with API services
 *
 * Usage:
 * import ProductList from '@/modules/buyer/components/ProductList.example';
 * <ProductList />
 */
export default function ProductListExample() {
  const dispatch = useAppDispatch();
  const products = useProductsList();
  const loading = useProductsLoading();
  const error = useProductsError();

  useEffect(() => {
    // Fetch products on component mount
    dispatch(fetchProducts({ page: 0, size: 20 }));
  }, [dispatch]);

  if (loading) {
    return <div className="p-4 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition">
            <img src={product.images?.[0] || ''} alt={product.name} className="w-full h-48 object-cover rounded mb-2" />
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">${product.price}</span>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
