import { useEffect, useState } from 'react';
import { productService } from '@/services';

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  [key: string]: any;
}

interface UseProductsOptions {
  page?: number;
  size?: number;
  category?: string;
  autoFetch?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { page = 0, size = 20, category, autoFetch = true } = options;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAllProducts(page, size, category ? { category } : undefined);
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [page, size, category, autoFetch]);

  return { products, loading, error, refetch: fetchProducts };
}

export function useProductById(id: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading, error };
}

export function useSearchProducts() {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string, page = 0, size = 20) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.searchProducts(query);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
}

