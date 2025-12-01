'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, ShoppingCart } from 'lucide-react';
import { WooCommerceDataProvider } from '../adapters/catalog/woocommerce';
import { useCart } from '../core/cart/CartContext';
import { formatPrice, isProductInStock, getStockStatusText } from '../../utils/helpers';
import { Loading } from '../../components/ui/Loading';
import AddItemPopup from '../../components/ui/AddItemPopup';
import type { Product } from '../core/ports';
import { VariationSelector } from '../ui/VariationSelector';
import { ProductCard } from '../ui/ProductCard';
import Header from '../../components/layout/header';
import { Button } from '@/components/ui/button';

interface DetailsPageProps { id: string }

export default function DetailsPage({ id }: DetailsPageProps) {
  const { addToCart, getCartItemQuantity } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<any | null>(null);
  const [upsellProducts, setUpsellProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Auto-select default variation if provided by backend
    if (product && (product as any).variations && Array.isArray((product as any).variations)) {
      const defaults = (product as any).defaultAttributes || (product as any).default_attributes;
      if (defaults && Object.keys(defaults).length > 0) {
        const match = (product as any).variations.find((v: any) => {
          const attrs = v.attributes || {};
          return Object.keys(defaults).every((k) => {
            const val = defaults[k];
            return attrs[k] === val || attrs[`attribute_${k}`] === val || attrs[`pa_${k}`] === val || attrs[`attribute_pa_${k}`] === val;
          });
        });
        if (match) setSelectedVariation(match);
      }
    }
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('No product ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const productData = await WooCommerceDataProvider.getProduct(Number(id));
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch linked products (upsells)
  useEffect(() => {
    const fetchLinkedProducts = async () => {
      if (!id) return;
      
      // Check if getLinkedProducts is available
      if (!WooCommerceDataProvider.getLinkedProducts) {
        return;
      }

      try {
        const response = await WooCommerceDataProvider.getLinkedProducts(Number(id));
        if (response && response.upsells) {
          setUpsellProducts(response.upsells);
        }
      } catch (err) {
        console.error('Error fetching linked products:', err);
        // Silently fail - upsells are optional
      }
    };

    fetchLinkedProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary text-secondary">
        <Header />
        <section className="gallery-carousel" style={{paddingTop: '120px', paddingBottom: '30px'}}>
          <div className="container">
            <div className="flex justify-center items-center py-32">
              <Loading size="lg" text="Loading product details..." />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-primary text-secondary">
        <Header />
        <section className="gallery-carousel" style={{paddingTop: '120px', paddingBottom: '30px'}}>
          <div className="container">
            <h1 className="h2 section-title" style={{marginBottom: '40px'}}>Product Not Found</h1>
            <div className="text-center">
              <p className="about-text" style={{marginBottom: '30px'}}>{error || 'The product you are looking for does not exist.'}</p>
              <button onClick={() => { if (typeof window !== 'undefined') { window.location.hash = ''; } }} className="btn btn-primary">
                <ArrowLeft size={18} />
                <span>Back to Shop</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // For made-to-order products, stock level should not block adding to cart
  // We still calculate remaining stock for display purposes, but don't use it to disable features
  const cartQuantity = getCartItemQuantity(product.id);
  const remainingStock = product.stockQuantity !== undefined ? product.stockQuantity - cartQuantity : undefined;
  
  const isVariable = ((product as any).variations && Array.isArray((product as any).variations) && (product as any).variations.length > 0) || product.type === 'variable';
  
  // For variable products, calculate remaining stock for selected variation (for display only)
  const selectedCartQuantity = selectedVariation ? getCartItemQuantity(selectedVariation.id) : 0;
  const selectedRemainingStock = selectedVariation && selectedVariation.stockQuantity !== undefined 
    ? selectedVariation.stockQuantity - selectedCartQuantity 
    : undefined;
  const hasMultipleImages = product.images && product.images.length > 1;
  const selectedVarImage = (selectedVariation as any)?.image as string | undefined;
  const mainImageSrc = selectedVarImage || product.images[currentImageIndex] || '/assets/placeholder-product.jpg';

  const priceOnSale = selectedVariation ? !!(selectedVariation.onSale && selectedVariation.salePrice) : !!(product.onSale && product.salePrice);
  const priceValue = selectedVariation ? Number(selectedVariation.price || 0) : Number(product.price || 0);
  const regularValue = selectedVariation ? Number(selectedVariation.regularPrice || priceValue) : Number(product.regularPrice || product.price || 0);
  const hasLongDescription = !!(product.description && String(product.description).trim().length > 0);

  const handleAdd = async () => {
    setAdding(true);
    try {
      // For variable products require a selected variation
      if (isVariable) {
        if (!selectedVariation) { setAdding(false); return; }
        // Pass variation data to addToCart
        await addToCart(
          product, 
          1, 
          selectedVariation.id, 
          selectedVariation.displayName || selectedVariation.name,
          undefined, // bundleSelections
          selectedVariation.attributes // variationAttributes
        );
      } else {
        await addToCart(product, 1);
      }
      setPopupOpen(true);
    } finally {
      setAdding(false);
    }
  };

  const nextImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      setImageLoading(true);
    }
  };

  const previousImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
      setImageLoading(true);
    }
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
    setImageLoading(true);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  return (
    <div className="min-h-screen bg-primary text-support">
      <Header />
      
      {/* Product Details Section */}
      <section className="bg-primary" style={{paddingTop: 0, paddingBottom: '80px'}}>
        <div className="w-full px-6 md:px-8" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Back button (moved into product section) */}
          <div className="flex items-center gap-2 mb-6" style={{ marginTop: '40px' }}>
            <button
              onClick={() => { if (typeof window !== 'undefined') { window.history.back(); } }}
              className="flex items-center gap-2 text-secondary hover:text-white transition-colors"
              style={{ fontSize: '16px' }}
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
          </div>
          <div style={{marginBottom: '40px', maxWidth: 'none'}}>
            {/* Grid for image and product info - overview excluded from grid alignment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 xl:gap-16" style={{maxWidth: 'none', alignItems: 'start'}}>
              {/* Left Side - Images (only image container, overview is separate) */}
              <div className="md:pr-6">
                <div className="space-y-6">
                  {/* Main Image */}
                  <div
                    className="relative w-full aspect-square bg-white overflow-hidden rounded-2xl ring-1 ring-gray-300 shadow-sm"
                    id="product-main-image"
                    style={{ borderRadius: 16 }}
                  >
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loading size="lg" />
                    </div>
                  )}
                  
                  <img 
                    src={mainImageSrc} 
                    alt={`${product.name} - ${currentImageIndex + 1}`}
                    className={`w-full h-full object-cover transition-opacity duration-300 rounded-2xl ${
                      imageLoading ? 'opacity-0' : 'opacity-100'
                    }`} 
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{ borderRadius: 'inherit', clipPath: 'inset(0 round 16px)' }}
                  />

                  {/* Navigation Arrows */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={previousImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 rounded"
                        title="Previous Image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 rounded"
                        title="Next Image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-3 py-1 rounded">
                        {currentImageIndex + 1} / {product.images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Feature Images (Smaller) */}
                {hasMultipleImages && (
                  <div className="flex flex-wrap gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => selectImage(index)}
                        className={`w-16 h-16 sm:w-20 sm:h-20 overflow-hidden border-2 rounded-lg transition-all duration-200 bg-primary ${
                          index === currentImageIndex
                            ? 'border-orange shadow-lg'
                            : 'border-gray-600 hover:border-gray-400'
                        }`}
                        style={{ borderRadius: 10 }}
                      >
                        <img
                          src={image}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                          style={{ borderRadius: 'inherit', clipPath: 'inset(0 round 10px)' }}
                        />
                      </button>
                    ))}
                  </div>
                )}
                </div>
              </div>

              {/* Right Side - Product Information */}
              <div className="flex flex-col md:pl-10" style={{ alignSelf: 'stretch', minHeight: 0 }}>
                <div className="flex-1 space-y-6" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  {/* 1. Name (h3) */}
                  <h3 className="text-h3-sm xl:text-h3 font-heading text-brand-gold mb-8">
                    {product.name}
                  </h3>

                  {/* 3. Price (h4) */}
                  <div className="mb-8">
                    {priceOnSale ? (
                      <div className="flex items-center gap-3">
                        <h4 className="text-2xl sm:text-3xl font-bold text-support">
                          {formatPrice(priceValue)}
                        </h4>
                        <span className="text-base sm:text-lg text-gray-400 line-through">
                          {formatPrice(regularValue)}
                        </span>
                        <span className="text-xs bg-red-500 text-white px-2 py-1 font-bold rounded">
                          SALE
                        </span>
                      </div>
                    ) : (
                      <h4 className="text-2xl sm:text-3xl font-bold text-support">
                        {formatPrice(priceValue)}
                      </h4>
                    )}
                  </div>

                  {/* Overview (Short Description) - only show here if no variations/attributes */}
                  {product.shortDescription && !isVariable && (!(product as any).attributes || !Array.isArray((product as any).attributes) || (product as any).attributes.length === 0) && (
                    <div className="mb-4">
                      <h4 className="about-subtitle text-brand-gold mb-2" style={{ fontSize: 'var(--fs-6)' }}>
                        Overview
                      </h4>
                      <p className="about-text text-secondary" style={{ fontSize: 'var(--fs-8)', lineHeight: '1.6' }}>
                        {product.shortDescription}
                      </p>
                    </div>
                  )}

                  {/* 5. Variations / Add to Cart */}
                  {isVariable ? (
                    <div className="mb-4 p-4 border border-transparent bg-transparent">
                      <VariationSelector 
                        variations={(product as any).variations || []}
                        attributes={(product as any).attributes}
                        variationAttributes={(product as any).variationAttributes}
                        onVariationSelect={(v) => setSelectedVariation(v)}
                        selectedVariation={selectedVariation || undefined}
                      />
                    </div>
                  ) : null}
                </div>

                {/* Buttons aligned to bottom of image */}
                <div className="mt-auto" style={{ marginTop: 'auto' }}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="button"
                      onClick={handleAdd}
                      disabled={isVariable ? (!selectedVariation || adding) : adding}
                      variant="outline"
                      size="lg"
                      className="flex-1 gap-3"
                    >
                      <ShoppingCart size={20} className="mr-2" />
                      <span>{adding ? 'Adding...' : (isVariable ? (selectedVariation ? 'Add Selected Option' : 'Select an option') : 'Add to Cart')}</span>
                    </Button>
                    
                    <Button
                      type="button"
                      onClick={() => { if (typeof window !== 'undefined') { window.location.href = '/cart'; } }}
                      variant="outline"
                      size="lg"
                      className="sm:w-1/2 gap-3"
                    >
                      <span>View Cart</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Overview under image when product has variations or attributes - outside grid to not affect alignment */}
            {(isVariable || ((product as any).attributes && Array.isArray((product as any).attributes) && (product as any).attributes.length > 0)) && product.shortDescription && (
              <div className="w-full px-6 md:px-8 md:pr-6" style={{ maxWidth: 1200, margin: '40px auto 0 auto' }}>
                <div className="md:w-1/2 md:pr-6">
                  <h4 className="about-subtitle text-brand-gold mb-2" style={{ fontSize: 'var(--fs-6)' }}>
                    Overview
                  </h4>
                  <p className="about-text text-secondary" style={{ fontSize: 'var(--fs-8)', lineHeight: '1.6' }}>
                    {product.shortDescription}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description Section (full width under product details) */}
          <div className="w-full px-6 md:px-8 mt-8" style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div>
            <h4 className="about-subtitle text-brand-gold" style={{ marginBottom: '15px', fontSize: 'var(--fs-6)' }}>
                Description
              </h4>
              <style>{`
                [data-product-desc] h1,
                [data-product-desc] h2,
                [data-product-desc] h3,
                [data-product-desc] h4,
                [data-product-desc] h5,
                [data-product-desc] h6 { color: var(--support) !important; }
                [data-product-desc] p,
                [data-product-desc] li,
                [data-product-desc] span { color: var(--secondary) !important; }
                [data-product-desc] a { color: var(--orange) !important; text-decoration: underline; }
              `}</style>
              {hasLongDescription ? (
                <div
                  data-product-desc
                  className="about-text text-secondary"
                  style={{ fontSize: 'var(--fs-8)', lineHeight: '1.6' }}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p className="about-text text-secondary" style={{ fontSize: 'var(--fs-8)', lineHeight: '1.6' }}>
                  No additional description available.
                </p>
              )}
            </div>
          </div>

          {/* Back to Shop link removed by request */}
        </div>
      </section>

      {/* You May Also Like Section - Upsell Products */}
      {upsellProducts.length > 0 && (
        <section className="section gears bg-primary" style={{ padding: '40px 0 80px 0' }}>
          <div className="container">
            <h2 className="h2 section-title text-support" style={{ marginBottom: '40px', textAlign: 'center' }}>
              You May Also Like
            </h2>
            <ul className="gears-list" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '30px',
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {upsellProducts.map((upsellProduct) => (
                <li key={upsellProduct.id}>
                  <ProductCard 
                    product={upsellProduct} 
                    onViewDetails={(p) => { if (typeof window !== 'undefined') { window.location.hash = `/product/${p.id}`; } }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Slide-in confirmation popup */}
      <AddItemPopup isOpen={popupOpen} onClose={() => setPopupOpen(false)} message={product.name} />
    </div>
  );
}