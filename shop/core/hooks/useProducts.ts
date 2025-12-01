import { useCallback, useMemo, useRef, useState } from 'react';
import type { Product } from '../ports';
import { WooCommerceDataProvider } from '../../adapters/catalog/woocommerce';

export interface UseProductsOptions {
  page?: number;
  perPage?: number;
  category?: number;
  brand?: string;
  search?: string;
  orderBy?: 'date' | 'price' | 'name' | 'popularity';
  order?: 'asc' | 'desc';
  onSale?: boolean;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export function useProducts(initial: UseProductsOptions = {}) {
  const provider = useMemo(() => WooCommerceDataProvider, []);
  const defaultOptionsRef = useRef<UseProductsOptions>(initial);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = useCallback(async (opts: UseProductsOptions = {}) => {
    
    setLoading(true);
    setError(null);
    
    // Don't clear products immediately to prevent glitching
    // Only clear if this is a completely new search
    const isNewSearch = opts.search !== undefined && opts.search !== '';
    if (!isNewSearch) {
      // Keep current products visible during filtering to prevent glitch
    }
    
    try {
      const defaults = defaultOptionsRef.current;
      
      // Build query object, only including defined values
      const query: any = {};
      if (opts.page !== undefined || defaults.page !== undefined) {
        query.page = opts.page ?? defaults.page ?? 1;
      }
      if (opts.perPage !== undefined || defaults.perPage !== undefined) {
        query.perPage = opts.perPage ?? defaults.perPage ?? 12;
      }
      if (opts.category !== undefined || defaults.category !== undefined) {
        query.categoryId = opts.category ?? defaults.category;
        
      }
      if (opts.search !== undefined || defaults.search !== undefined) {
        query.search = opts.search ?? defaults.search;
      }
      if (opts.orderBy !== undefined || defaults.orderBy !== undefined) {
        query.orderBy = opts.orderBy ?? defaults.orderBy ?? 'date';
      }
      if (opts.order !== undefined || defaults.order !== undefined) {
        query.order = opts.order ?? defaults.order ?? 'desc';
      }
      if (opts.featured !== undefined || defaults.featured !== undefined) {
        query.featured = opts.featured ?? defaults.featured;
      }
      if (opts.brand !== undefined || defaults.brand !== undefined) {
        query.brand = opts.brand ?? defaults.brand;
      }
      if (opts.onSale !== undefined || defaults.onSale !== undefined) {
        query.onSale = opts.onSale ?? defaults.onSale;
      }
      // Price range is applied in UI layer for dynamic slider bounds; do not include here
      
      const resp = await provider.getProducts(query);
      
      // Backend handles all filtering now - no client-side filtering needed
      // This prevents double-filtering issues and ensures consistent results
      const filteredProducts = resp.data;
      
      // Update products atomically to prevent glitching
      setProducts(filteredProducts);
      
      // Prefer server-provided totals when available
      const serverTotal = (resp as any).total;
      const serverTotalPages = (resp as any).totalPages;
      const serverCurrentPage = (resp as any).currentPage;
      
      // Debug logging removed
      
      setTotal(typeof serverTotal === 'number' ? serverTotal : filteredProducts.length);
      setTotalPages(typeof serverTotalPages === 'number' ? serverTotalPages : Math.ceil(filteredProducts.length / (opts.perPage ?? defaults.perPage ?? 12)));
      setCurrentPage(typeof serverCurrentPage === 'number' ? serverCurrentPage : (opts.page ?? defaults.page ?? 1));
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [provider]);

  return {
    products,
    loading,
    error,
    total,
    totalPages,
    currentPage,
    fetchProducts,
  };
}


