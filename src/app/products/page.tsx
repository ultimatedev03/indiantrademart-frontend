'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Search, Filter, Grid, List, ShoppingCart, Star } from 'lucide-react';
import { EmptyState } from '@/shared/components/EmptyState';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  image?: string;
  description: string;
  category?: { name: string };
  categoryName?: string;
  rating?: number;
  vendorId?: number;
  vendor?: { name: string };
  vendorName?: string;
  stock: number;
  status?: string;
  images?: Array<{ imageUrl: string }>;
}

interface ProductsResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
}

export default function ProductsPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [products, setProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(0);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching products from API...');
      
      // Build query params
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('size', '12');
      
      // Add search term
      if (searchTerm.trim()) {
        params.append('search', searchTerm);
      }
      
      // Add category filter
      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const data: ProductsResponse = await response.json();
      console.log(`✅ Loaded ${data.content?.length || 0} products`);
      setProducts(data.content || []);
      
      // Extract unique categories
      if (page === 0) {
        const cats = new Set<string>();
        data.content?.forEach(p => {
          if (p.category?.name) cats.add(p.category.name);
          if (p.categoryName) cats.add(p.categoryName);
        });
        setAllCategories(['All', ...Array.from(cats)]);
      }
    } catch (err: any) {
      console.error('❌ Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = allCategories.length > 0 ? allCategories : ["All"];

  // Filter and sort products locally (API search already filters)
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Helper function to get product image URL
  const getProductImage = (product: Product): string => {
    if (product.imageUrl) {
      if (product.imageUrl.startsWith('http')) return product.imageUrl;
      return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${product.imageUrl}`;
    }
    if (product.images && product.images.length > 0) {
      const imageUrl = product.images[0].imageUrl;
      if (imageUrl.startsWith('http')) return imageUrl;
      return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${imageUrl}`;
    }
    if (product.image) {
      if (product.image.startsWith('http')) return product.image;
      return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${product.image}`;
    }
    // Placeholder image
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
  };

  const getCategoryName = (product: Product): string => {
    return product.category?.name || product.categoryName || 'Uncategorized';
  };

  const getVendorName = (product: Product): string => {
    return product.vendor?.name || product.vendorName || 'Unknown Vendor';
  };

  const addToCart = (product: Product) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    // Add to cart logic here
    alert(`Added ${product.name} to cart!`);
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          icon="⚠️"
          title="Error Loading Products"
          description={error}
          actionText="Try Again"
          onAction={() => fetchProducts()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            
            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Categories</h4>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={selectedCategory === category || (category === 'All' && selectedCategory === '')}
                      onChange={(e) => setSelectedCategory(e.target.value === 'All' ? '' : e.target.value)}
                      className="mr-2"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Search and View Controls */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {sortedProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description || 'No description available'}</p>
                  {product.rating && (
                    <div className="flex items-center mb-2">
                      <Star className="text-yellow-400 fill-current" size={16} />
                      <span className="text-sm text-gray-600 ml-1">{product.rating.toFixed(1)}</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mb-2">by {getVendorName(product)}</p>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm line-through text-gray-400">₹{product.originalPrice.toLocaleString()}</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-indigo-600">₹{product.price.toLocaleString()}</span>
                    <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`w-full py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${
                      product.stock > 0
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart size={16} />
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {sortedProducts.length === 0 && !loading && (
            <div className="mt-8">
              <EmptyState
                icon="🔍"
                title="No products found"
                description="Try adjusting your search or filter criteria to find what you're looking for."
                variant="compact"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
