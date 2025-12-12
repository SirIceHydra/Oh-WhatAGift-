'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import type { Product } from '../core/ports';
import { useCart } from '../core/cart/CartContext';
import { formatPrice, isProductInStock, getStockStatusText } from '../../utils/helpers';
import { Loading } from '../../components/ui/Loading';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  className?: string;
}

export function ProductCard({ product, onViewDetails, className = '' }: ProductCardProps) {
  const { addToCart, isInCart, getCartItemQuantity, error: cartError, clearError } = useCart();
  const [imageLoading, setImageLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isHoveringTitle, setIsHoveringTitle] = useState(false);
  const [shouldScrollTitle, setShouldScrollTitle] = useState(false);
  const [scrollDistance, setScrollDistance] = useState(0);
  const titleRef = React.useRef<HTMLDivElement | null>(null);
  const cartQuantity = getCartItemQuantity(product.id);
  // For Al Rafahia products are made-to-order, so stock level should not block adding to cart.
  // We still compute remainingStock & stock text for display elsewhere if needed,
  // but we do NOT use this to disable the add-to-cart button.
  const remainingStock = product.stockQuantity !== undefined ? product.stockQuantity - cartQuantity : undefined;
  const isInStock = isProductInStock(product.stockStatus, remainingStock);
  const isInCartState = isInCart(product.id);
  
  // Check if product is in the "custom" category
  const isCustomProduct = product.categories && product.categories.some(
    cat => cat.toLowerCase().trim() === 'custom'
  );
  
  // Determine the link destination - custom products go to /custom, others to product details
  const productLink = isCustomProduct ? '/custom' : `/shop#/product/${product.id}`;
  

  const handleAddToCart = async () => {
    setAddingToCart(true);
    setShowError(false);
    clearError(); // Clear any previous errors
    try { 
      await addToCart(product, 1); 
      // Don't show popup here - let the useEffect handle it based on actual cart changes
    } catch (err) {
      setShowError(true);
    } finally { 
      setAddingToCart(false); 
    }
  };

  // Monitor cart errors for this specific product
  useEffect(() => {
    if (cartError && cartError.includes(product.name)) {
      setShowError(true);
    } else if (!cartError) {
      setShowError(false); // Clear error if cartError is cleared
    }
  }, [cartError, product.name]);

  // Measure title overflow to enable slide-on-hover
  useEffect(() => {
    const measure = () => {
      const el = titleRef.current;
      if (!el) return;
      const text = el.firstElementChild as HTMLElement | null;
      if (!text) return;
      const diff = text.scrollWidth - el.clientWidth;
      const overflow = diff > 8;
      setShouldScrollTitle(overflow);
      setScrollDistance(Math.max(0, diff));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [product.name]);


  return (
    <div
      className={`productCard group/productCard overflow-hidden rounded-xl border border-gray-200 bg-transparent transition-all duration-500 hover:-translate-y-1 w-full h-full flex flex-col ${className}`}
    >
      {/* IMAGE */}
      <a
        href={productLink}
        onClick={onViewDetails ? (e) => { e.preventDefault(); onViewDetails(product); } : undefined}
        style={{ cursor: 'pointer', background: 'transparent', display: 'block' }}
        aria-label={isCustomProduct ? "Customize product" : "View details"}
        className="block w-full"
      >
        <div className="relative w-full aspect-[1/1.44] overflow-hidden rounded-2xl ring-1 ring-gray-200">
          {product.onSale && (
            <div className="absolute top-3 left-3 bg-black/80 text-white text-sm font-semibold px-3 py-1 rounded">
              Sale
            </div>
          )}
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loading size="sm" />
            </div>
          )}
          <img
            src={product.images[0] || '/assets/placeholder-product.jpg'}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/productCard:scale-105"
            style={{ clipPath: 'inset(0 round 16px)' }}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        </div>
      </a>

      {/* NAME + PRICE + LEARN MORE */}
      <div className="w-full px-3 py-3 flex-1 flex flex-col">
        <div className="h-10 w-full px-2 mb-2 flex items-center justify-center overflow-hidden">
          <span className="block w-full truncate text-sm font-semibold text-brand-light-gold" title={product.name}>
            {product.name}
          </span>
        </div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="text-left">
            {product.onSale && product.salePrice ? (
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] uppercase tracking-wide text-secondary">SALE</span>
                <span className="text-[16px] font-semibold text-secondary">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-[13.6px] text-secondary opacity-80 line-through">
                  {formatPrice(product.regularPrice || product.price)}
                </span>
              </div>
            ) : (
              <span className="text-left text-sm font-medium text-brand-grey-green">{formatPrice(product.price)}</span>
            )}
          </div>
          <a
            href={productLink}
            onClick={onViewDetails ? (e) => { e.preventDefault(); onViewDetails(product); } : undefined}
            className="flex items-center gap-2 text-brand-light-gold text-[10px]"
          >
            {isCustomProduct ? 'CUSTOMIZE' : 'LEARN MORE'}
            <ArrowRight size={10} />
          </a>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="px-3 pb-3 mt-auto">
        <button
          onClick={() => {
            // Custom products always go to custom page
            if (isCustomProduct) {
              if (typeof window !== 'undefined') {
                window.location.href = '/custom';
              }
              return;
            }
            
            const isVariable = product.type === 'variable' || (product as any).hasVariations;
            if (isVariable) {
              if (onViewDetails) {
                onViewDetails(product);
              } else if (typeof window !== 'undefined') {
                window.location.href = `/shop#/product/${product.id}`;
              }
            } else {
              handleAddToCart();
            }
          }}
          disabled={!isCustomProduct && !(product.type === 'variable' || (product as any).hasVariations) && addingToCart}
          className="w-full border border-brand-green text-brand-green py-2 text-sm transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#74966d'; // brand-green
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.borderColor = '#74966d';
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.10)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#74966d';
            e.currentTarget.style.borderColor = '#74966d';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {isCustomProduct
            ? 'CUSTOMIZE'
            : (product.type === 'variable' || (product as any).hasVariations
              ? 'VIEW OPTIONS'
              : (addingToCart ? 'Adding…' : (isInCartState ? `In Cart (${cartQuantity})` : 'ADD TO CART')))}
        </button>
      </div>

      {/* Error display for stock limits */}
      {showError && cartError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
          <div className="flex items-center justify-between">
            <p className="text-red-600 text-xs">{cartError}</p>
            <button
              onClick={() => { setShowError(false); clearError(); }}
              className="text-red-600 hover:text-red-800 text-xs ml-2"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function CompactProductCard({ product, onAddToCart, className = '' }: { product: Product; onAddToCart?: (p: Product) => void; className?: string; }) {
  const { addToCart, getCartItemQuantity, error: cartError, clearError } = useCart();
  const cartQuantity = getCartItemQuantity(product.id);
  const remainingStock = product.stockQuantity !== undefined ? product.stockQuantity - cartQuantity : undefined;
  const isInStock = isProductInStock(product.stockStatus, remainingStock);
  const [imageLoading, setImageLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  

  const handleAddToCart = async () => {
    setAddingToCart(true);
    setShowError(false);
    clearError(); // Clear any previous errors
    try {
      await addToCart(product, 1);
      if (onAddToCart) onAddToCart(product); // Call external handler if provided
      // Don't show popup here - let the useEffect handle it based on actual cart changes
    } catch (err) {
      setShowError(true);
    } finally {
      setAddingToCart(false);
    }
  };

  // Monitor cart errors for this specific product
  useEffect(() => {
    if (cartError && cartError.includes(product.name)) {
      setShowError(true);
    } else if (!cartError) {
      setShowError(false); // Clear error if cartError is cleared
    }
  }, [cartError, product.name]);


  return (
    <div className={`group bg-transparent shadow-md overflow-hidden sm:hover:shadow-xl sm:hover:-translate-y-1 transition-all duration-500 ease-out flex flex-col h-full ${className}`}>
      <div className="relative w-full h-48 bg-transparent overflow-hidden">
        {imageLoading && (<div className="absolute inset-0 flex items-center justify-center"><Loading size="sm" /></div>)}
        <img 
          src={product.images[0] || '/assets/placeholder-product.jpg'} 
          alt={product.name} 
          className={`w-full h-full object-contain transition-all duration-700 ease-out sm:group-hover:scale-110 ${imageLoading ? 'opacity-0' : 'opacity-100'}`} 
          onLoad={() => setImageLoading(false)} 
          onError={() => setImageLoading(false)} 
        />
        {product.onSale && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded transform -translate-x-2 opacity-0 sm:group-hover:translate-x-0 sm:group-hover:opacity-100 transition-all duration-300 ease-out">
            SALE
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1" style={{ alignItems: 'flex-start', textAlign: 'left' }}>
        {product.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2" style={{ justifyContent: 'flex-start' }}>
            {product.categories.slice(0,2).map((c,i) => (
              <span key={i} className="text-xs bg-black text-white px-2 py-1  font-medium sm:group-hover:bg-tertiary sm:group-hover:scale-105 transition-all duration-200">
                {c}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-medium text-tertiary text-sm mb-2 line-clamp-2 min-h-[2.5rem] transition-colors duration-200" style={{ textAlign: 'left', lineHeight: '1.4', width: '100%', margin: 0 }}>
          {product.name}
        </h3>
        <div className="text-xs text-tertiary mb-2 transition-colors duration-200">
          {getStockStatusText(product.stockStatus, product.stockQuantity)}
        </div>
        <div className="flex items-center gap-2 mb-3">
          {product.onSale && product.salePrice ? (
            <>
              <span className="text-lg font-bold text-tertiary sm:group-hover:scale-105 transition-transform duration-200">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-xs text-tertiary/70 line-through transition-opacity duration-200">
                {formatPrice(product.regularPrice)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-tertiary sm:group-hover:scale-105 transition-transform duration-200">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        <div className="flex-1"></div>
        {product.type === 'variable' || (product as any).hasVariations ? (
          <button 
            onClick={() => onAddToCart ? onAddToCart(product) : undefined}
            className="w-full py-3 px-4 font-semibold transition-all duration-300 bg-primary text-tertiary hover:bg-tertiary hover:text-primary hover:scale-105 hover:shadow-lg border-2 border-tertiary"
          >
            <div className="flex items-center justify-center">View Options</div>
          </button>
        ) : (
          <button 
            onClick={handleAddToCart} 
            disabled={addingToCart} 
            className={`w-full py-3 px-4  font-semibold transition-all duration-300 ${
              'bg-primary text-tertiary hover:bg-tertiary hover:text-primary hover:scale-105 hover:shadow-lg border-2 border-tertiary' 
            }`}
          >
            <div className="flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 mr-2 sm:group-hover:scale-110 transition-transform duration-200" />
              {addingToCart ? 'Adding...' : (isInStock ? 'Add to Cart' : 'Out of Stock')}
            </div>
          </button>
        )}
      </div>
      
      {/* Error display for stock limits */}
      {showError && cartError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
          <div className="flex items-center justify-between">
            <p className="text-red-600 text-xs">{cartError}</p>
            <button 
              onClick={() => { setShowError(false); clearError(); }} 
              className="text-red-600 hover:text-red-800 text-xs ml-2"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProductListItem({ product, onViewDetails, onAddToCart, className = '' }: { product: Product; onViewDetails?: (p: Product) => void; onAddToCart?: (p: Product) => void; className?: string; }) {
  const isInStock = isProductInStock(product.stockStatus, product.stockQuantity);
  const [imageLoading, setImageLoading] = useState(true);
  return (
    <div className={`group bg-transparent shadow-md p-6 sm:hover:shadow-xl sm:hover:-translate-y-1 transition-all duration-500 ease-out ${className}`} style={{ textAlign: 'left' }}>
      <div className="flex gap-6">
        <div className="relative w-32 h-32 bg-transparent  overflow-hidden flex-shrink-0">
          {imageLoading && (<div className="absolute inset-0 flex items-center justify-center"><Loading size="sm" /></div>)}
          <img 
            src={product.images[0] || '/assets/placeholder-product.jpg'} 
            alt={product.name} 
            className={`w-full h-full object-contain transition-all duration-700 ease-out sm:group-hover:scale-110 ${imageLoading ? 'opacity-0' : 'opacity-100'}`} 
            onLoad={() => setImageLoading(false)} 
            onError={() => setImageLoading(false)} 
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col" style={{ alignItems: 'flex-start', textAlign: 'left' }}>
          {product.categories?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2" style={{ justifyContent: 'flex-start' }}>
              {product.categories.slice(0,3).map((c,i) => (
                <span key={i} className="text-xs bg-black text-white px-2 py-1  font-medium sm:group-hover:bg-tertiary sm:group-hover:scale-105 transition-all duration-200">
                  {c}
                </span>
              ))}
            </div>
          )}
          <h3 className="font-semibold text-tertiary mb-2 line-clamp-2 transition-colors duration-200" style={{ textAlign: 'left', lineHeight: '1.4', width: '100%', margin: 0 }}>
            {product.name}
          </h3>
          <p className="text-sm text-tertiary mb-3 line-clamp-2 transition-colors duration-200">
            {product.shortDescription}
          </p>
          <div className="flex items-center gap-3 mb-3">
            {product.onSale && product.salePrice ? (
              <>
                <span className="text-xl font-bold text-tertiary sm:group-hover:scale-105 transition-transform duration-200">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-sm text-tertiary/70 line-through transition-opacity duration-200">
                  {formatPrice(product.regularPrice)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-tertiary sm:group-hover:scale-105 transition-transform duration-200">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <div className="text-sm text-tertiary mb-4 transition-colors duration-200">
            {getStockStatusText(product.stockStatus, product.stockQuantity)}
          </div>
          <div className="flex-1"></div>
          <div className="flex gap-3">
            <button 
              onClick={() => onViewDetails?.(product)} 
              className="text-sm text-tertiary font-medium px-4 py-2 border border-tertiary hover:bg-tertiary hover:text-primary hover:scale-105 transition-all duration-200"
            >
              View Details
            </button>
            <button 
              onClick={() => isInStock && onAddToCart?.(product)} 
              disabled={!isInStock} 
              className={`text-sm font-semibold px-6 py-2  transition-all duration-300 ${
                isInStock 
                  ? 'bg-primary text-tertiary hover:bg-tertiary hover:text-primary hover:scale-105 hover:shadow-lg border-2 border-tertiary' 
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              {isInStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


