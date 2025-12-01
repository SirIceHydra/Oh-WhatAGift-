import React, { useEffect, useState } from 'react';
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';
import { useCart } from '../core/cart/CartContext';
import Header from '../../components/layout/header';

export default function PaymentSuccess({ className = '' }: { className?: string }) {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();
  
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let id: string | null = null;

    // First, try to read from the main query string (?order_id=...)
    try {
      const url = new URL(window.location.href);
      id = url.searchParams.get('order_id');
    } catch {
      // ignore URL parsing errors
    }

    // If not found, also support order_id inside the hash for URLs like:
    // /shop#/payment-success?order_id=123
    if (!id && window.location.hash) {
      const hash = window.location.hash;
      const hashQueryIndex = hash.indexOf('?');
      if (hashQueryIndex !== -1) {
        const hashQueryString = hash.substring(hashQueryIndex + 1);
        const hashParams = new URLSearchParams(hashQueryString);
        id = hashParams.get('order_id');
      }
    }

    setOrderId(id);
    setLoading(false);

    // ✅ Clear cart when user returns from successful PayFast payment
    // This is necessary because form.submit() navigates away before clearCart() 
    // can execute in Checkout.tsx
    clearCart();
  }, [clearCart]);
  
  if (loading) {
    return (
      <div className={`min-h-screen bg-primary text-tertiary flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tertiary mx-auto"></div>
          <p className="mt-4 text-tertiary/90">Processing payment...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen bg-primary text-support ${className}`}>
      <Header />
      <section className="gallery-carousel" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div className="container">
          <div className="bg-primarySupport shadow-sm p-8 sm:p-12 lg:p-16 text-center rounded-none border-2 border-secondary">
            <h2 className="text-h2-sm xl:text-h2 font-heading text-black text-center mt-8 mb-0 leading-tight">PAYMENT SUCCESSFUL</h2>
            <div className="bg-support rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-2 -mt-2">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <p className="text-base xl:text-lg text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
              Thank you! Your payment has been processed successfully and your order is being prepared.
            </p>
            {orderId && (
              <div className="bg-primary rounded-none p-6 sm:p-8 mb-12 shadow-sm border-2 border-support">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Package className="w-6 h-6 text-support" />
                  <h3 className="text-h5-sm xl:text-h5 font-heading text-black uppercase">Order Details</h3>
                </div>
                <p className="text-base text-black mb-2">
                  <strong>Order ID:</strong> #{orderId}
                </p>
                <p className="text-sm text-secondary">
                  You will receive an email confirmation shortly with tracking information.
                </p>
              </div>
            )}
            <div className="flex flex-row gap-5 justify-center flex-wrap mt-8 mb-8">
              <button 
                onClick={() => { window.location.href = '/home'; }}
                className="rounded-none py-4 px-8 text-lg font-semibold inline-flex items-center justify-center gap-2 transition-all duration-200 border-2 bg-secondary text-tertiary border-secondary hover:bg-tertiary hover:text-secondary hover:scale-105"
              >
                <Home className="w-6 h-6" />
                Back to Home
              </button>
              <button 
                onClick={() => { window.location.href = '/shop'; }}
                className="rounded-none py-4 px-8 text-lg font-semibold inline-flex items-center justify-center gap-2 transition-all duration-200 border-2 bg-tertiary text-secondary border-tertiary hover:bg-support hover:text-tertiary hover:scale-105"
              >
                <ShoppingBag className="w-6 h-6" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

