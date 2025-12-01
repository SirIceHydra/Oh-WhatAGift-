// Product grid component for displaying multiple products
// Provider-agnostic UI migrated into shop framework
import React from 'react';
import type { Product } from '../core/ports';
import { ProductCard, CompactProductCard, ProductListItem } from './ProductCard';
import { ProductSkeleton } from '../../components/ui/Loading';
import { ErrorMessage } from '../../components/ui/ErrorBoundary';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onViewDetails?: (product: Product) => void;
  variant?: 'grid' | 'compact' | 'list';
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  className?: string;
}

export function ProductGrid({
  products,
  loading = false,
  error = null,
  onRetry,
  onViewDetails,
  variant = 'grid',
  columns = 4,
  className = '',
}: ProductGridProps) {
  const getGridClasses = () => {
    // Slightly larger default gap on mobile for clearer separation between cards
    const baseClasses = 'grid gap-4 sm:gap-6';
    switch (columns) {
      case 1: return `${baseClasses} grid-cols-1`;
      case 2: return `${baseClasses} grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
      case 3: return `${baseClasses} grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3`;
      case 4: return `${baseClasses} grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
      case 5: return `${baseClasses} grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`;
      case 6: return `${baseClasses} grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6`;
      case 7: return `${baseClasses} grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7`;
      case 8: return `${baseClasses} grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8`;
      default: return `${baseClasses} grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
    }
  };

  if (loading) {
    return (
      <div className={getGridClasses()}>
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center">
        <ErrorMessage error={error} onRetry={onRetry} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto text-brand-green">
          <div className="w-16 h-16 bg-brand-light-green rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-brand-green mb-2">No products found</h3>
          <p className="text-brand-grey-green">Try adjusting your search or filter criteria.</p>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <ProductListItem
            key={product.id}
            product={product}
            onViewDetails={onViewDetails}
            onAddToCart={() => onViewDetails?.(product)}
          />
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={getGridClasses()}>
        {products.map((product) => (
          <CompactProductCard key={product.id} product={product} onAddToCart={() => onViewDetails?.(product)} />
        ))}
      </div>
    );
  }

  return (
    <div className={`${getGridClasses()} ${className}`}>
              {products.map((product, index) => (
          <div 
            key={product.id} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ProductCard product={product} onViewDetails={onViewDetails} />
          </div>
        ))}
    </div>
  );
}


