'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowLeft, ShoppingCart } from 'lucide-react';
import { WooCommerceDataProvider } from '@/shop/adapters/catalog/woocommerce';
import { useCart } from '@/shop/core/cart/CartContext';
import { formatPrice, isProductInStock, getStockStatusText } from '@/utils/helpers';
import { Loading } from '@/components/ui/Loading';
import AddItemPopup from '@/components/ui/AddItemPopup';
import type { Product } from '@/shop/core/ports';
import { VariationSelector } from '@/shop/ui/VariationSelector';
import Header from '@/components/layout/header';
import HeaderSecondary from '@/components/layout/header-secondary';
import { Button } from '@/components/ui/button';
import Customiser, { type CustomiserHandle } from '@/shop/ui/Customiser';

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
  const customiserRef = useRef<CustomiserHandle>(null);

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

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-brand-cream">
        {/* Show HeaderSecondary on mobile, Header on desktop */}
        <div className="md:hidden">
          <HeaderSecondary />
        </div>
        <div className="hidden md:block">
          <Header />
        </div>
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
          <div className="flex justify-center items-center py-16 sm:py-32">
            <Loading size="lg" text="Loading custom product..." />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full min-h-screen bg-brand-cream">
        {/* Show HeaderSecondary on mobile, Header on desktop */}
        <div className="md:hidden">
          <HeaderSecondary />
        </div>
        <div className="hidden md:block">
          <Header />
        </div>
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
          <h1 className="text-xl sm:text-2xl md:text-h2 font-heading text-brand-grey-green mb-3 sm:mb-4">Product Not Found</h1>
          <div className="text-center">
            <p className="text-sm sm:text-base text-body text-brand-grey-green mb-4 sm:mb-6">{error || 'The custom product could not be loaded.'}</p>
            <Button
              onClick={() => { if (typeof window !== 'undefined') { window.location.href = '/shop'; } }}
              variant="outline"
              size="lg"
              className="text-sm sm:text-base"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
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
  
  // Extract image URL - handle both string arrays and object arrays
  const getImageUrl = (img: any): string => {
    if (typeof img === 'string') return img;
    if (img && typeof img === 'object' && img.src) return img.src;
    return '/assets/placeholder-product.jpg';
  };
  
  // Get variation image if available (could be string or object with src)
  const selectedVarImage = selectedVariation ? ((selectedVariation as any)?.image ? getImageUrl((selectedVariation as any).image) : null) : null;
  
  // Use variation image if selected, otherwise use main product image
  const mainImageSrc = selectedVarImage || (product.images && product.images[currentImageIndex] ? getImageUrl(product.images[currentImageIndex]) : null) || '/assets/placeholder-product.jpg';
  
  // For variable products, only show customiser after variant is selected
  const canShowCustomiser = !isVariable || selectedVariation;

  // Extract thread colours attribute for Customiser component
  const threadColoursAttr = (() => {
    if (!product) return undefined;
    const attributes = (product as any)?.attributes || [];
    const found = attributes.find((attr: any) => {
      if (!attr || !attr.name) return false;
      const nameLower = attr.name.toLowerCase();
      return nameLower.includes('thread') && (nameLower.includes('colour') || nameLower.includes('color'));
    });
    return found || undefined;
  })();

  const priceOnSale = selectedVariation ? !!(selectedVariation.onSale && selectedVariation.salePrice) : !!(product.onSale && product.salePrice);
  const priceValue = selectedVariation ? Number(selectedVariation.price || 0) : Number(product.price || 0);
  const regularValue = selectedVariation ? Number(selectedVariation.regularPrice || priceValue) : Number(product.regularPrice || product.price || 0);
  const hasLongDescription = !!(product.description && String(product.description).trim().length > 0);

  // Helper function to convert any image format to PNG
  const convertImageToPng = async (dataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          ctx.drawImage(img, 0, 0);
          const pngDataUrl = canvas.toDataURL('image/png');
          resolve(pngDataUrl);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => {
        reject(new Error('Failed to load image for conversion'));
      };
      img.src = dataUrl;
    });
  };

  const handleAdd = async () => {
    setAdding(true);
    try {
      // Export customization from Customiser if available
      let customMeta: { designUrl?: string; mode?: 'composite' | 'overlay'; uploadUrl?: string; text?: string | string[]; textColors?: string | string[] } | undefined = undefined;
      
      if (customiserRef.current) {
        const exportData = await customiserRef.current.exportComposite();
        console.log('Export data:', {
          hasDataUrl: !!exportData?.dataUrl,
          hasUploadedImage: !!exportData?.uploadedImageDataUrl,
          uploadedImageLength: exportData?.uploadedImageDataUrl?.length,
          textEntries: exportData?.textEntries,
          textColors: exportData?.textColors,
        });
        
        if (exportData && exportData.dataUrl) {
          try {
            // Import the upload helper dynamically to avoid circular deps
            const { uploadCustomDesign } = await import('@/services/woocommerce');
            
            console.log('Uploading customization to server...');
            // Upload the composite image
            const uploadResult = await uploadCustomDesign(exportData.dataUrl, product?.id || 0);
            
            if (uploadResult.url) {
              console.log('Customization uploaded successfully:', uploadResult.url);
              
              // Upload the user-uploaded image separately if it exists
              let uploadedImageUrl: string | undefined = undefined;
              if (exportData.uploadedImageDataUrl) {
                try {
                  console.log('Uploading user-uploaded image to server...', exportData.uploadedImageDataUrl.substring(0, 100) + '...');
                  
                  // Convert image to PNG if it's not already PNG/JPEG (e.g., SVG)
                  let imageDataUrl = exportData.uploadedImageDataUrl;
                  if (imageDataUrl.startsWith('data:image/svg+xml')) {
                    console.log('Converting SVG to PNG...');
                    imageDataUrl = await convertImageToPng(imageDataUrl);
                  }
                  
                  const uploadedImageResult = await uploadCustomDesign(imageDataUrl, product?.id || 0);
                  if (uploadedImageResult.url) {
                    uploadedImageUrl = uploadedImageResult.url;
                    console.log('User-uploaded image uploaded successfully:', uploadedImageUrl);
                  } else {
                    console.warn('User-uploaded image upload returned no URL');
                  }
                } catch (uploadedImageError) {
                  console.error('Error uploading user-uploaded image:', uploadedImageError);
                  // Continue without the uploaded image URL
                }
              } else {
                console.log('No uploaded image data URL found in export data');
              }
              
              customMeta = {
                designUrl: uploadResult.url,
                mode: exportData.mode,
                uploadUrl: uploadedImageUrl, // Use the uploaded URL instead of base64
                text: exportData.textEntries,
                textColors: exportData.textColors,
              };
              
              console.log('Custom meta being sent to cart:', {
                designUrl: customMeta.designUrl,
                mode: customMeta.mode,
                uploadUrl: customMeta.uploadUrl,
                hasText: !!customMeta.text,
                hasTextColors: !!customMeta.textColors,
              });
            } else {
              console.warn('Upload returned no URL');
            }
          } catch (uploadError) {
            console.error('Error uploading customization:', uploadError);
            // Still allow adding to cart without customization on error
          }
        }
      }
      
      if (isVariable) {
        if (!selectedVariation) { setAdding(false); return; }
        await addToCart(
          product, 
          1, 
          selectedVariation.id, 
          selectedVariation.displayName || selectedVariation.name,
          undefined,
          selectedVariation.attributes,
          customMeta
        );
      } else {
        await addToCart(product, 1, undefined, undefined, undefined, undefined, customMeta);
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
    <div className="w-full min-h-screen bg-brand-cream">
      {/* Show HeaderSecondary on mobile, Header on desktop */}
      <div className="md:hidden">
        <HeaderSecondary />
      </div>
      <div className="hidden md:block">
        <Header />
      </div>
      
      {/* Product Details Section */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
        {/* Back button */}
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <button
            onClick={() => { if (typeof window !== 'undefined') { window.history.back(); } }}
            className="flex items-center gap-2 text-brand-grey-green hover:text-brand-green transition-colors text-sm sm:text-base"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span>Back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-start">
          {/* Left Side - Images */}
          <div className="w-full flex justify-center md:justify-start">
            <div className="space-y-4 sm:space-y-6 w-full max-w-full md:max-w-[75%]">
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

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={previousImage}
                      className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 rounded"
                      title="Previous Image"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    
                    <button
                      onClick={nextImage}
                      className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 rounded"
                      title="Next Image"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 bg-black/70 text-white text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded">
                      {currentImageIndex + 1} / {product.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              {hasMultipleImages && (
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => selectImage(index)}
                      className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 overflow-hidden border-2 rounded-lg transition-all duration-200 bg-white ${
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
            <div className="flex-1 space-y-4 sm:space-y-6">
              {/* Product Name */}
              <h3 className="text-xl sm:text-2xl md:text-h3-sm xl:text-h3 font-heading text-brand-gold">
                {product.name}
              </h3>

              {/* Price */}
              <div>
                {priceOnSale ? (
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-grey-green">
                      {formatPrice(priceValue)}
                    </h4>
                    <span className="text-sm sm:text-base md:text-lg text-gray-400 line-through">
                      {formatPrice(regularValue)}
                    </span>
                    <span className="text-xs bg-red-500 text-white px-2 py-1 font-bold rounded">
                      SALE
                    </span>
                  </div>
                ) : (
                  <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-grey-green">
                    {formatPrice(priceValue)}
                  </h4>
                )}
              </div>

              {/* Overview (Short Description) */}
              {product.shortDescription && !isVariable && (!(product as any).attributes || !Array.isArray((product as any).attributes) || (product as any).attributes.length === 0) && (
                <div>
                  <h4 className="about-subtitle text-brand-gold mb-2 text-base sm:text-lg" style={{ fontSize: 'var(--fs-6)' }}>
                    Overview
                  </h4>
                  <p className="about-text text-brand-grey-green text-sm sm:text-base" style={{ fontSize: 'var(--fs-8)', lineHeight: '1.6' }}>
                    {product.shortDescription}
                </p>
              </div>
              )}

              {/* Variations */}
              {isVariable ? (
                <div className="p-3 sm:p-4 border border-transparent bg-transparent">
                  <div className="variation-selector">
                    <label className="variation-label block mb-2 sm:mb-3 font-semibold text-brand-green text-sm sm:text-base">
                      Select Towel Type
                      {selectedVariation && (
                        <span className="text-brand-gold font-normal ml-1 sm:ml-2 text-xs sm:text-sm">
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
                      className="w-full max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-brand-green/30 bg-brand-light-green text-brand-grey-green font-medium text-sm sm:text-base cursor-pointer focus:outline-none focus:border-brand-green transition-colors"
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

              {/* Add to Cart Button */}
              <div className="mt-auto pt-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  type="button"
                  onClick={handleAdd}
                  disabled={isVariable ? (!selectedVariation || adding) : adding}
                  variant="outline"
                  size="lg"
                  className="flex-1 gap-2 sm:gap-3 text-sm sm:text-base py-3 sm:py-4 min-h-[48px] sm:min-h-[56px]"
                >
                  {adding ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing Customisation...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
                      <span>{isVariable ? (selectedVariation ? 'Add Selected Option' : 'Select an option') : 'Add to Cart'}</span>
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  onClick={() => { if (typeof window !== 'undefined') { window.location.href = '/cart'; } }}
                  variant="outline"
                  size="lg"
                  className="sm:w-1/2 gap-3 text-sm sm:text-base py-3 sm:py-4 min-h-[48px] sm:min-h-[56px]"
                >
                  <span>View Cart</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customiser Section - Below Product Info */}
      {canShowCustomiser && (
        <div className="w-full mt-8 sm:mt-12">
          <h3 className="text-xl sm:text-2xl md:text-h3-sm xl:text-h3 font-heading text-brand-gold mb-4 sm:mb-6">
            Customise Your Product
          </h3>
          <div data-customiser-container className="w-full">
            <Customiser
              key={`${mainImageSrc}-${selectedVariation?.id || 'default'}`} // Force re-render when image or variant changes
              ref={customiserRef}
              backgroundImageUrl={mainImageSrc}
              matchElementSelector="[data-image-container]"
              threadColours={threadColoursAttr}
            />
          </div>
        </div>
      )}
      
      {isVariable && !selectedVariation && (
        <div className="w-full mt-8 sm:mt-12">
          <div className="bg-brand-light-green/50 border-2 border-brand-green/30 rounded-lg p-4 sm:p-6 text-center">
            <p className="text-brand-grey-green text-sm sm:text-base">
              Please select a product variant above to start customising.
            </p>
          </div>
        </div>
      )}

        {/* Overview under image when product has variations */}
        {(isVariable || ((product as any).attributes && Array.isArray((product as any).attributes) && (product as any).attributes.length > 0)) && product.shortDescription && (
          <div className="w-full mt-6 sm:mt-8">
            <div className="w-full md:w-1/2">
              <h4 className="about-subtitle text-brand-gold mb-2 text-base sm:text-lg" style={{ fontSize: 'var(--fs-6)' }}>
                Overview
              </h4>
              <p className="about-text text-brand-grey-green text-sm sm:text-base" style={{ fontSize: 'var(--fs-8)', lineHeight: '1.6' }}>
                {product.shortDescription}
              </p>
            </div>
          </div>
        )}

        {/* Description Section */}
        {hasLongDescription && (
          <div className="w-full mt-6 sm:mt-8">
            <div>
              <h4 className="about-subtitle text-brand-gold mb-3 sm:mb-4 text-base sm:text-lg" style={{ fontSize: 'var(--fs-6)' }}>
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
                className="about-text text-brand-grey-green text-sm sm:text-base"
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
