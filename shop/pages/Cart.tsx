// Inline export removed (legacy file deleted). Bring current implementation by re-importing from app export if needed.
'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingCart as CartIcon, Trash2, CreditCard, Package, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCart } from '../core/cart/CartContext';
import { useCheckout } from '../core/hooks/useCheckout';
import { formatPrice } from '../../utils/helpers';
import { Loading } from '../../components/ui/Loading';
import { useRouter } from 'next/navigation';
import { ProductCard } from '../ui/ProductCard';
import { WooCommerceDataProvider } from '../adapters/catalog/woocommerce';
import type { Product } from '../core/ports';
import Header from '../../components/layout/header';
import { Button } from '@/components/ui/button';

interface CartProps { className?: string }

export default function Cart({ className = '' }: CartProps) {
  const { cart, updateCartItem, removeFromCart, clearCart, error: cartError, clearError } = useCart();
  const { loading: checkoutLoading, error: checkoutError } = useCheckout();
  const router = useRouter();
  const [updatingItem, setUpdatingItem] = useState<number | null>(null);
  const [crossSellProducts, setCrossSellProducts] = useState<Product[]>([]);
  const [loadingCrossSells, setLoadingCrossSells] = useState(false);

  // Calculate shipping cost based on order total
  const FREE_SHIPPING_THRESHOLD = 1000; // R1000 threshold
  const getShippingCost = () => {
    if (cart.total >= FREE_SHIPPING_THRESHOLD) {
      return { cost: 0, text: 'Free', color: 'text-green-500' };
    } else {
      return { cost: 0, text: 'TBD', color: 'text-yellow-500' }; // Will be calculated at checkout
    }
  };

  const shipping = getShippingCost();


  // Fetch cross-sell products for items in cart
  useEffect(() => {
    const fetchCrossSells = async () => {
      if (cart.items.length === 0) {
        setCrossSellProducts([]);
        return;
      }

      setLoadingCrossSells(true);
      try {
        const allCrossSells: Product[] = [];
        
        // Fetch cross-sells for each product in cart
        for (const item of cart.items) {
          if (WooCommerceDataProvider.getLinkedProducts) {
            try {
              const response = await WooCommerceDataProvider.getLinkedProducts(item.productId);
              if (response && response.crossSells) {
                allCrossSells.push(...response.crossSells);
              }
            } catch (err) {
              console.error('Error fetching cross-sells for product:', item.productId, err);
            }
          }
        }

        // Remove duplicates and limit to 4 products
        const uniqueCrossSells = allCrossSells.filter((product, index, self) => 
          index === self.findIndex(p => p.id === product.id) &&
          !cart.items.some(cartItem => cartItem.productId === product.id)
        ).slice(0, 4);

        setCrossSellProducts(uniqueCrossSells);
      } catch (err) {
        console.error('Error fetching cross-sell products:', err);
      } finally {
        setLoadingCrossSells(false);
      }
    };

    fetchCrossSells();
  }, [cart.items]);

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) { removeFromCart(productId); return; }
    setUpdatingItem(productId);
    try { updateCartItem(productId, newQuantity); } finally { setUpdatingItem(null); }
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) return;
    router.push('/checkout');
  };

  if (cart.items.length === 0) {
    return (
      <div className={`min-h-screen bg-white text-secondary ${className}`}>
        <Header />
        <section className="gallery-carousel" style={{ paddingTop: '60px', paddingBottom: '30px' }}>
          <div className="container px-4 sm:px-6">
            <h2 className="text-center text-h2-sm xl:text-h2 font-heading text-secondary mb-6 sm:mb-8">
              YOUR CART
            </h2>
            <div className="bg-white border-2 border-secondary" style={{ padding: '40px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CartIcon className="w-10 h-10 sm:w-12 sm:h-12 text-secondary" />
              </div>
              <h3
                className="text-h3-sm xl:text-h3 font-heading text-secondary mb-3 sm:mb-4"
              >
                YOUR CART IS EMPTY
              </h3>
              <p className="text-sm sm:text-base text-secondary/70 mb-6 sm:mb-8 px-4">Start adding some amazing products to your cart!</p>
              <div className="flex justify-center items-center">
                <Button
                  onClick={() => { window.location.href = '/shop'; }}
                  variant="outline"
                  size="lg"
                  className="gap-3"
                >
                  <CartIcon className="w-5 h-5 sm:w-6 sm:h-6" /> 
                  <span>Start Shopping</span>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white text-secondary ${className}`}>
      <Header />
      <section className="gallery-carousel" style={{ paddingTop: '20px', paddingBottom: '0px' }}>
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
            <h2 className="text-center sm:text-left text-h2-sm xl:text-h2 font-heading text-black flex-1">
              YOUR CART
            </h2>
            <button 
              onClick={() => { window.location.href = '/shop'; }}
              className="flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> <span>Back</span>
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 overflow-hidden">
            <div className="lg:col-span-2 overflow-hidden">
              <div className="bg-primary shadow-lg border border-black/20 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-black/20">
                  <h2 className="text-h5-sm xl:text-h5 font-heading text-black">
                    CART ITEMS ({cart.itemCount})
                  </h2>
                </div>
                <div className="divide-y divide-black/20">
                  {cart.items.map(item => (
                    <div key={item.id} className="p-4 sm:p-6 hover:bg-black/10 transition-colors">
                      {/* Mobile Layout - Stacked */}
                      <div className="flex flex-col sm:hidden gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <img
                              src={item.image || '/placeholder-product.jpg'}
                              alt={item.name}
                              className="w-20 h-20 object-cover shadow-sm"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="text-base font-heading font-semibold break-words text-black flex-1">
                                {item.name}
                              </h3>
                              <button onClick={() => removeFromCart(item.productId)} className="text-black/70 hover:text-red-500 transition-colors p-1 flex-shrink-0" title="Remove item">
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                            {item.variationName && (
                              <p className="text-xs mb-1 text-black/80">
                                <span className="font-medium">Variation:</span> {item.variationName}
                              </p>
                            )}
                            {item.bundleSelections && item.bundleSelections.length > 0 && (
                              <div className="text-xs mb-2 text-black/80">
                                <span className="font-medium">Bundle includes:</span>
                                {item.bundleSelections.map((selection, index) => (
                                  <div key={index} className="ml-2">
                                    • {selection.variationName === 'Default option' 
                                        ? selection.productName 
                                        : `${selection.productName} - ${selection.variationName}`}
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2">
                                <button onClick={() => handleQuantityChange(item.productId, item.quantity - 1)} disabled={updatingItem === item.productId} className="w-8 h-8 flex items-center justify-center border-2 border-black/40 hover:border-black hover:bg-black/10 disabled:opacity-50 transition-all">
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-12 text-center font-semibold text-base text-black">
                                  {updatingItem === item.productId ? <Loading size="sm" /> : item.quantity}
                                </span>
                                <button onClick={() => handleQuantityChange(item.productId, item.quantity + 1)} disabled={updatingItem === item.productId} className="w-8 h-8 flex items-center justify-center border-2 border-black/40 hover:border-black hover:bg-black/10 disabled:opacity-50 transition-all">
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-lg font-bold text-black">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Desktop Layout - Horizontal */}
                      <div className="hidden sm:flex flex-row items-center gap-4 sm:gap-6">
                        <div className="flex-shrink-0 flex justify-center sm:justify-start">
                          <img
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name}
                            className="w-16 h-16 object-cover shadow-sm"
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <h3 className="text-base sm:text-lg font-heading font-semibold mb-2 break-words text-black">
                            {item.name}
                          </h3>
                          {item.variationName && (
                            <p className="text-sm mb-1 text-black">
                              <span className="font-medium">Variation:</span> {item.variationName}
                            </p>
                          )}
                          {item.bundleSelections && item.bundleSelections.length > 0 && (
                            <div className="text-sm mb-1 text-black">
                              <span className="font-medium">Bundle includes:</span>
                              {item.bundleSelections.map((selection, index) => (
                                <div key={index} className="ml-2 text-xs">
                                  • {selection.variationName === 'Default option' 
                                      ? selection.productName 
                                      : `${selection.productName} - ${selection.variationName}`}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-center sm:justify-end gap-3">
                          <button onClick={() => handleQuantityChange(item.productId, item.quantity - 1)} disabled={updatingItem === item.productId} className="w-10 h-10 flex items-center justify-center border-2 border-black/40 hover:border-black hover:bg-black/10 disabled:opacity-50 transition-all">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-16 text-center font-semibold text-lg text-black">
                            {updatingItem === item.productId ? <Loading size="sm" /> : item.quantity}
                          </span>
                          <button onClick={() => handleQuantityChange(item.productId, item.quantity + 1)} disabled={updatingItem === item.productId} className="w-10 h-10 flex items-center justify-center border-2 border-black/40 hover:border-black hover:bg-black/10 disabled:opacity-50 transition-all">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-center sm:text-right">
                          <p className="text-xl font-bold text-black">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                        <div className="flex justify-center sm:justify-end">
                          <button onClick={() => removeFromCart(item.productId)} className="text-black/70 hover:text-red-500 transition-colors p-2" title="Remove item">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Frequently Bought Together Section */}
              {crossSellProducts.length > 0 && (
                <div className="bg-primary shadow-lg border border-black/20 mt-4 sm:mt-6">
                  <div className="p-4 sm:p-6 border-b border-black/20">
                    <h2 className="text-h4-sm sm:text-h3-sm xl:text-h3 font-heading text-black">
                      Frequently Bought Together
                    </h2>
                  </div>
                  <div className="p-4 sm:p-6">
                    {loadingCrossSells ? (
                      <div className="flex justify-center py-6 sm:py-8">
                        <Loading size="md" text="Loading recommendations..." />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {crossSellProducts.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onViewDetails={(p) => router.push(`/shop/product/${p.id}`)}
                            className="transform transition-transform hover:scale-105"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-4">
                <div className="bg-primary border border-black/20 overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-black/20">
                    <h2 className="text-h5-sm xl:text-h5 font-heading text-black">
                      ORDER SUMMARY
                    </h2>
                  </div>
                  <div className="px-4 sm:px-6 py-4 sm:py-6">
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="flex justify-between items-center text-sm sm:text-base">
                      <span className="text-black">Subtotal</span>
                      <span className="font-semibold text-black">{formatPrice(cart.total)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm sm:text-base">
                      <span className="text-black">Shipping</span>
                      <span className={`font-semibold ${shipping.color}`}>
                        {shipping.text}
                      </span>
                    </div>
                    {cart.total < FREE_SHIPPING_THRESHOLD && (
                      <div className="text-xs sm:text-sm text-black bg-black/5 p-2 rounded">
                        Add {formatPrice(FREE_SHIPPING_THRESHOLD - cart.total)} more for free shipping
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm sm:text-base">
                      <span className="text-black">Tax</span>
                      <span className="font-semibold text-black">Included</span>
                    </div>
                    <div className="border-t border-black/20 pt-3 sm:pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg sm:text-xl font-bold text-black">Total</span>
                        <span className="text-lg sm:text-xl font-bold text-black">{formatPrice(cart.total)}</span>
                      </div>
                    </div>
                  </div>
                  {cartError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
                      <div className="flex items-center justify-between">
                        <p className="text-red-600 text-sm">{cartError}</p>
                        <button onClick={clearError} className="text-red-600 hover:text-red-800 text-sm">×</button>
                      </div>
                    </div>
                  )}
                  {checkoutError && (<div className="mb-6 p-4 bg-red-50 border border-red-200"><p className="text-red-600 text-sm">{checkoutError}</p></div>)}
                  </div>
                </div>
                <div className="space-y-4 mt-6">
                  <Button
                    onClick={handleCheckout}
                    disabled={checkoutLoading || cart.items.length === 0}
                    variant="outline"
                    size="lg"
                    className="w-full gap-2"
                  >
                    {checkoutLoading ? (
                      <Loading size="sm" text="Processing..." />
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Proceed to Checkout
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={clearCart}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    Clear Cart
                  </Button>
                  <Button
                    onClick={() => { window.location.href = '/shop'; }}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </div>
                <div className="text-center mt-6 sm:mt-8">
                  <p className="text-xs sm:text-sm text-black mb-2">Secure Checkout</p>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-black">
                    <div className="flex items-center gap-1 text-xs">
                      <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" /> 
                      <span>PayFast</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Package className="w-3 h-3 sm:w-4 sm:h-4" /> 
                      <span className="text-center">{cart.total >= FREE_SHIPPING_THRESHOLD ? 'Free Shipping' : 'Shipping Calculated at Checkout'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

