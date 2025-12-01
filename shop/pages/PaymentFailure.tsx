import React from 'react';
import { XCircle, Home, ShoppingBag } from 'lucide-react';
import Header from '../../components/layout/header';

export default function PaymentFailure({ className = '' }: { className?: string }) {
  return (
    <div className={`min-h-screen bg-primary text-support ${className}`}>
      <Header />
      <section className="gallery-carousel" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div className="container">
          <div className="bg-primarySupport shadow-sm p-8 sm:p-12 lg:p-16 text-center rounded-none border-2 border-secondary">
            <h2 className="text-h2-sm xl:text-h2 font-heading text-black text-center mt-4 mb-4 leading-tight">PAYMENT FAILED</h2>
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-base xl:text-lg text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
              Unfortunately we couldn't process your transaction. Please try again or choose a different payment method.
            </p>
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
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

