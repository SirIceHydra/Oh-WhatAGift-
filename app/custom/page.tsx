'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowLeft, ShoppingCart, Upload, X } from 'lucide-react';
import { WooCommerceDataProvider } from '@/shop/adapters/catalog/woocommerce';
import { useCart } from '@/shop/core/cart/CartContext';
import { formatPrice, isProductInStock, getStockStatusText } from '@/utils/helpers';
import { Loading } from '@/components/ui/Loading';
import AddItemPopup from '@/components/ui/AddItemPopup';
import type { Product } from '@/shop/core/ports';
import { VariationSelector } from '@/shop/ui/VariationSelector';
import HeaderSecondary from '@/components/layout/header-secondary';
import { Button } from '@/components/ui/button';

export default function CustomPage() {
  const { addToCart, getCartItemQuantity } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<any | null>(null);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [overlayText, setOverlayText] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('#000000');
  const [textSize, setTextSize] = useState<number>(24);
  const [overlayInstructions, setOverlayInstructions] = useState<string>('');
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 85 }); // percentage positions
  const [textPosition, setTextPosition] = useState({ x: 50, y: 90 }); // percentage positions
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Fetch the custom category product
  useEffect(() => {
    const fetchCustomProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First, get all categories to find the "custom" category
        const categories = await WooCommerceDataProvider.getCategories();
        console.log('All categories:', categories);
        
        // Try multiple ways to find the custom category - exact match first, then partial
        let customCategory = categories.find(
          cat => {
            const slug = cat.slug?.toLowerCase().trim();
            const name = cat.name?.toLowerCase().trim();
            return slug === 'custom' || name === 'custom';
          }
        );
        
        // If exact match not found, try partial match
        if (!customCategory) {
          customCategory = categories.find(
            cat => {
              const slug = cat.slug?.toLowerCase().trim();
              const name = cat.name?.toLowerCase().trim();
              return slug?.includes('custom') || name?.includes('custom');
            }
          );
        }
        
        console.log('Found custom category:', customCategory);
        
        let productsResponse;
        
        if (customCategory) {
          console.log('Fetching products for category ID:', customCategory.id);
          
          // Fetch products from the custom category
          productsResponse = await WooCommerceDataProvider.getProducts({
            categoryId: customCategory.id,
            perPage: 10,
            page: 1
          });
          
          console.log('Products response from category:', productsResponse);
        } else {
          console.warn('Custom category not found. Available categories:', categories.map(c => ({ id: c.id, name: c.name, slug: c.slug })));
          console.log('Trying fallback: searching for products with "custom" in name...');
          
          // Fallback: search for products with "custom" in the name
          productsResponse = await WooCommerceDataProvider.getProducts({
            search: 'custom',
            perPage: 10,
            page: 1
          });
          
          console.log('Products response from search:', productsResponse);
        }
        
        if (!productsResponse.data || productsResponse.data.length === 0) {
          console.error('No products found. Response:', productsResponse);
          setError('No custom products found');
          setLoading(false);
          return;
        }
        
        // Find the "Customizable Towel" product or get the first one
        let targetProduct = productsResponse.data.find(
          p => p.name.toLowerCase().includes('customizable') || p.name.toLowerCase().includes('custom')
        );
        
        if (!targetProduct) {
          targetProduct = productsResponse.data[0];
        }
        
        console.log('Target product found:', targetProduct);
        
        // Get the full product details with variations
        const productId = targetProduct.id;
        console.log('Loading product details for ID:', productId);
        const productData = await WooCommerceDataProvider.getProduct(productId);
        console.log('Product data loaded:', productData);
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching custom product:', err);
        setError(`Failed to load custom product: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomProduct();
  }, []);

  // Auto-select default variation if provided by backend
  useEffect(() => {
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

  // Drag handlers useEffect - must be before any conditional returns
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingImage && overlayImage) {
        const container = document.querySelector('[data-image-container]') as HTMLElement;
        if (container) {
          const rect = container.getBoundingClientRect();
          const x = ((e.clientX - dragStart.x - rect.left) / rect.width) * 100;
          const y = ((e.clientY - dragStart.y - rect.top) / rect.height) * 100;
          setImagePosition({
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y))
          });
        }
      }
      if (isDraggingText && overlayText) {
        const container = document.querySelector('[data-image-container]') as HTMLElement;
        if (container) {
          const rect = container.getBoundingClientRect();
          const x = ((e.clientX - dragStart.x - rect.left) / rect.width) * 100;
          const y = ((e.clientY - dragStart.y - rect.top) / rect.height) * 100;
          setTextPosition({
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y))
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingImage(false);
      setIsDraggingText(false);
    };

    if (isDraggingImage || isDraggingText) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingImage, isDraggingText, dragStart, overlayImage, overlayText]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-brand-cream">
        <HeaderSecondary />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center py-32">
            <Loading size="lg" text="Loading custom product..." />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full min-h-screen bg-brand-cream">
        <HeaderSecondary />
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-h2 font-heading text-brand-grey-green mb-4">Product Not Found</h1>
          <div className="text-center">
            <p className="text-body text-brand-grey-green mb-6">{error || 'The custom product could not be loaded.'}</p>
            <Button
              onClick={() => { if (typeof window !== 'undefined') { window.location.href = '/shop'; } }}
              variant="outline"
              size="lg"
            >
              <ArrowLeft size={18} />
              <span>Back to Shop</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const cartQuantity = getCartItemQuantity(product.id);
  const remainingStock = product.stockQuantity !== undefined ? product.stockQuantity - cartQuantity : undefined;
  
  const isVariable = ((product as any).variations && Array.isArray((product as any).variations) && (product as any).variations.length > 0) || product.type === 'variable';
  
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

  // Build a transparent PNG of overlays to send with the order (no base image to avoid CORS)
  const generateOverlayPng = async (): Promise<string | null> => {
    // If neither overlay is present, skip
    if (!overlayImage && !overlayText) return null;
    const size = 1000; // export canvas size (square)
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Draw overlay image if present
    if (overlayImage) {
      const img = new Image();
      // Important: avoid tainting canvas - we only draw user's uploaded image (same-origin as data URL)
      img.crossOrigin = 'anonymous';
      const awaitLoad = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // don't block if load fails
      });
      img.src = overlayImage;
      await awaitLoad;

      // Position in px (center-based), width/height as 35% of canvas
      const cx = (imagePosition.x / 100) * size;
      const cy = (imagePosition.y / 100) * size;
      const w = size * 0.35;
      const h = w;
      const x = cx - w / 2;
      const y = cy - h / 2;
      try {
        ctx.drawImage(img, x, y, w, h);
      } catch {}
    }

    // Draw text overlay if present
    if (overlayText) {
      const cx = (textPosition.x / 100) * size;
      const cy = (textPosition.y / 100) * size;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Scale font approximately to canvas
      const scaledFont = Math.max(10, Math.min(120, textSize * (size / 500)));
      ctx.font = `bold ${scaledFont}px sans-serif`;
      ctx.fillStyle = textColor || '#000';
      // Add shadow similar to preview
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText(overlayText, cx, cy, size * 0.9);
      ctx.restore();
    }

    try {
      return canvas.toDataURL('image/png');
    } catch {
      return null;
    }
  };

  const handleAdd = async () => {
    setAdding(true);
    try {
      // Build customization payload (overlay-only PNG + config) before adding to cart
      const overlayPng = await generateOverlayPng();
      const customization = (overlayPng || overlayText || overlayImage)
        ? {
            overlayPngDataUrl: overlayPng || undefined,
            config: {
              imagePosition,
              textPosition,
              text: overlayText || undefined,
              textColor,
              textSize,
              instructions: overlayInstructions || undefined,
            },
          }
        : undefined;

      if (isVariable) {
        if (!selectedVariation) { setAdding(false); return; }
        await addToCart(
          product, 
          1, 
          selectedVariation.id, 
          selectedVariation.displayName || selectedVariation.name,
          undefined,
          selectedVariation.attributes,
          customization
        );
      } else {
        await addToCart(product, 1, undefined, undefined, undefined, undefined, customization);
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

  const handleOverlayUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setOverlayImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveOverlay = () => {
    setOverlayImage(null);
  };

  // Image overlay drag handlers
  const handleImageMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(true);
    const container = document.querySelector('[data-image-container]') as HTMLElement;
    if (container) {
      const rect = container.getBoundingClientRect();
      const currentX = (rect.width * imagePosition.x / 100);
      const currentY = (rect.height * imagePosition.y / 100);
      setDragStart({
        x: e.clientX - rect.left - currentX,
        y: e.clientY - rect.top - currentY
      });
    }
  };

  const handleTextMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingText(true);
    const container = document.querySelector('[data-image-container]') as HTMLElement;
    if (container) {
      const rect = container.getBoundingClientRect();
      const currentX = (rect.width * textPosition.x / 100);
      const currentY = (rect.height * textPosition.y / 100);
      setDragStart({
        x: e.clientX - rect.left - currentX,
        y: e.clientY - rect.top - currentY
      });
    }
  };


  return (
    <div className="w-full min-h-screen bg-brand-cream">
      <HeaderSecondary />
      
      {/* Product Details Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Back button */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => { if (typeof window !== 'undefined') { window.history.back(); } }}
            className="flex items-center gap-2 text-brand-grey-green hover:text-brand-green transition-colors"
            style={{ fontSize: '16px' }}
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left Side - Images */}
          <div className="w-full flex justify-start">
            <div className="space-y-6 w-full max-w-[75%]">
              {/* Main Image */}
              <div
                data-image-container
                className="relative w-full aspect-square bg-white overflow-hidden rounded-2xl ring-1 ring-gray-300 shadow-sm"
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

                {/* Overlay Image */}
                {overlayImage && (
                  <div 
                    className="absolute cursor-move pointer-events-auto"
                    style={{ 
                      left: `${imagePosition.x}%`,
                      top: `${imagePosition.y}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '35%',
                      height: '35%',
                      zIndex: 10
                    }}
                    onMouseDown={handleImageMouseDown}
                  >
                    <img
                      src={overlayImage}
                      alt="Custom overlay"
                      className="w-full h-full object-contain select-none"
                      draggable={false}
                    />
                  </div>
                )}

                {/* Text Overlay */}
                {overlayText && (
                  <div 
                    className="absolute cursor-move pointer-events-auto text-center select-none"
                    style={{ 
                      left: `${textPosition.x}%`,
                      top: `${textPosition.y}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '80%',
                      color: textColor,
                      fontSize: `${textSize}px`,
                      fontWeight: 'bold',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                      zIndex: 10
                    }}
                    onMouseDown={handleTextMouseDown}
                  >
                    {overlayText}
                  </div>
                )}

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

              {/* Thumbnail Images */}
              {hasMultipleImages && (
                <div className="flex flex-wrap gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => selectImage(index)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 overflow-hidden border-2 rounded-lg transition-all duration-200 bg-white ${
                        index === currentImageIndex
                          ? 'border-brand-green shadow-lg'
                          : 'border-gray-300 hover:border-brand-green/50'
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
          <div className="w-full flex flex-col">
            <div className="flex-1 space-y-6">
              {/* Product Name */}
              <h3 className="text-h3-sm xl:text-h3 font-heading text-brand-gold">
                {product.name}
              </h3>

              {/* Price */}
              <div>
                {priceOnSale ? (
                  <div className="flex items-center gap-3">
                    <h4 className="text-2xl sm:text-3xl font-bold text-brand-grey-green">
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
                  <h4 className="text-2xl sm:text-3xl font-bold text-brand-grey-green">
                    {formatPrice(priceValue)}
                  </h4>
                )}
              </div>

              {/* Overview (Short Description) */}
              {product.shortDescription && !isVariable && (!(product as any).attributes || !Array.isArray((product as any).attributes) || (product as any).attributes.length === 0) && (
                <div>
                  <h4 className="about-subtitle text-brand-gold mb-2" style={{ fontSize: 'var(--fs-6)' }}>
                    Overview
                  </h4>
                  <p className="about-text text-brand-grey-green" style={{ fontSize: 'var(--fs-8)', lineHeight: '1.6' }}>
                    {product.shortDescription}
                </p>
              </div>
              )}

              {/* Variations */}
              {isVariable ? (
                <div className="p-4 border border-transparent bg-transparent">
                  <div className="variation-selector">
                    <label className="variation-label block mb-3 font-semibold text-brand-green">
                      Select Towel Type
                      {selectedVariation && (
                        <span className="text-brand-gold font-normal ml-2">
                          (Selected: {(() => {
                            const attrs = selectedVariation.attributes || {};
                            const attrValue = Object.values(attrs)[0];
                            return attrValue ? String(attrValue) : 'None';
                          })()})
                        </span>
                      )}
                    </label>
                    <select
                      value={selectedVariation?.id || ''}
                      onChange={(e) => {
                        const variationId = Number(e.target.value);
                        const variation = ((product as any).variations || []).find((v: any) => v.id === variationId);
                        if (variation) {
                          setSelectedVariation(variation);
                        }
                      }}
                      className="w-full max-w-md px-4 py-3 rounded-lg border-2 border-brand-green/30 bg-brand-light-green text-brand-grey-green font-medium text-base cursor-pointer focus:outline-none focus:border-brand-green transition-colors"
                      style={{
                        background: '#d0d9c5',
                        color: '#2d2d39',
                      }}
                    >
                      <option value="">Select an option</option>
                      {((product as any).variations || []).map((v: any) => {
                        const attrs = v.attributes || {};
                        const attrValue = Object.values(attrs)[0];
                        const optionLabel = attrValue ? String(attrValue) : 'Option';
                        const price = formatPrice(Number(v.price || 0));
                        return (
                          <option key={v.id} value={v.id}>
                            {optionLabel} - {price}
                          </option>
                        );
                      })}
                    </select>
                    {selectedVariation && (
                      <div className="mt-3 text-sm text-brand-grey-green">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Price:</span>
                          {selectedVariation.onSale && selectedVariation.regularPrice ? (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-brand-gold">{formatPrice(Number(selectedVariation.price))}</span>
                              <span className="line-through opacity-70">{formatPrice(Number(selectedVariation.regularPrice))}</span>
                            </div>
                          ) : (
                            <span className="font-bold text-brand-gold">{formatPrice(Number(selectedVariation.price))}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Image Overlay Upload Section */}
              <div className="space-y-3 p-4 bg-white rounded-lg border-2 border-brand-green/20">
                <label className="block text-sm font-semibold text-brand-grey-green mb-2">
                  Add Image       
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 bg-brand-light-green text-brand-grey-green rounded-lg cursor-pointer hover:bg-brand-green/20 transition-colors border border-brand-green/30">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleOverlayUpload}
                      className="hidden"
                    />
                  </label>
                  {overlayImage && (
                    <button
                      onClick={handleRemoveOverlay}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                      title="Remove overlay"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-sm font-medium">Remove</span>
                    </button>
                  )}
                </div>
                {overlayImage && (
                  <p className="text-xs text-brand-grey-green/70">
                    Your custom image will be overlaid on the product. Upload a transparent PNG for best results.
                  </p>
                )}
              </div>

              {/* Text Overlay Section */}
              <div className="space-y-3 p-4 bg-white rounded-lg border-2 border-brand-green/20">
                <label className="block text-sm font-semibold text-brand-grey-green mb-2">
                  Add Custom Text
                </label>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={overlayText}
                      onChange={(e) => setOverlayText(e.target.value)}
                      placeholder="Enter text to display on towel"
                      className="w-full px-4 py-2 border-2 border-brand-green/30 rounded-lg bg-brand-light-green text-brand-grey-green placeholder:text-brand-grey-green/50 focus:outline-none focus:border-brand-green"
                    />
                  </div>
                  {overlayText && (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label className="block text-xs text-brand-grey-green mb-1">Text Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              className="w-12 h-10 rounded border-2 border-brand-green/30 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              className="flex-1 px-3 py-2 border-2 border-brand-green/30 rounded-lg bg-brand-light-green text-brand-grey-green text-sm focus:outline-none focus:border-brand-green"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-brand-grey-green mb-1">Text Size</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="12"
                              max="48"
                              value={textSize}
                              onChange={(e) => setTextSize(Number(e.target.value))}
                              className="flex-1"
                            />
                            <span className="text-sm text-brand-grey-green w-12 text-center">{textSize}px</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setOverlayText('')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-200 text-sm"
                      >
                        <X className="w-4 h-4" />
                        <span>Clear Text</span>
                      </button>
                    </>
                  )}

                  {/* Additional Instructions */}
                  <div className="pt-2 space-y-2">
                    <label className="block text-sm font-semibold text-brand-grey-green">
                      Further Instructions
                    </label>
                    <textarea
                      value={overlayInstructions}
                      onChange={(e) => setOverlayInstructions(e.target.value)}
                      placeholder="Add any extra notes for the embroidery team"
                      rows={3}
                      className="w-full px-4 py-2 border-2 border-brand-green/30 rounded-lg bg-brand-light-green text-brand-grey-green placeholder:text-brand-grey-green/50 focus:outline-none focus:border-brand-green resize-y"
                    />
                    <p className="text-[11px] text-brand-grey-green/70">
                      These instructions will be sent with your order together with your overlay image. We'll contact you if we need any further information.
                    </p>
                    <p className="text-[11px] text-brand-grey-green/80">
                      Don&apos;t like what you see?{' '}
                      <Link href="/contact" className="text-brand-green underline font-semibold">
                        Contact us
                      </Link>{' '}
                      and let&apos;s embroider your vision.
                    </p>
                  </div>
                </div>
            </div>
          </div>

            {/* Add to Cart Button */}
            <div className="mt-auto pt-6">
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

        {/* Overview under image when product has variations */}
        {(isVariable || ((product as any).attributes && Array.isArray((product as any).attributes) && (product as any).attributes.length > 0)) && product.shortDescription && (
          <div className="w-full mt-8">
            <div className="md:w-1/2">
              <h4 className="about-subtitle text-brand-gold mb-2" style={{ fontSize: 'var(--fs-6)' }}>
                Overview
              </h4>
              <p className="about-text text-brand-grey-green" style={{ fontSize: 'var(--fs-8)', lineHeight: '1.6' }}>
                {product.shortDescription}
              </p>
            </div>
          </div>
        )}

        {/* Description Section */}
        {hasLongDescription && (
          <div className="w-full mt-8">
            <div>
              <h4 className="about-subtitle text-brand-gold mb-4" style={{ fontSize: 'var(--fs-6)' }}>
                Description
              </h4>
              <style>{`
                [data-product-desc] h1,
                [data-product-desc] h2,
                [data-product-desc] h3,
                [data-product-desc] h4,
                [data-product-desc] h5,
                [data-product-desc] h6 { color: var(--brand-grey-green) !important; }
                [data-product-desc] p,
                [data-product-desc] li,
                [data-product-desc] span { color: var(--brand-grey-green) !important; }
                [data-product-desc] a { color: var(--brand-green) !important; text-decoration: underline; }
              `}</style>
              <div
                data-product-desc
                className="about-text text-brand-grey-green"
                style={{ fontSize: 'var(--fs-8)', lineHeight: '1.6' }}
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Slide-in confirmation popup */}
      <AddItemPopup isOpen={popupOpen} onClose={() => setPopupOpen(false)} message={product.name} />
    </div>
  );
}
