'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Truck } from 'lucide-react';
import { ShippingForm } from '../ui/ShippingForm';
import { CartItemWithShipping } from '../types/shipping';
import { formatPrice } from '../../utils/helpers';
import Header from '@/components/layout/header';
import HeaderSecondary from '@/components/layout/header-secondary';

// Mock cart data for demonstration
const mockCartItems: CartItemWithShipping[] = [
  {
    id: '1',
    productId: 1,
    name: 'Pokemon Booster Pack',
    price: 299.99,
    quantity: 2,
    image: '/images/pokeproduct.png',
    stockStatus: 'instock',
    weight_kg: 0.1,
    length_cm: 15,
    width_cm: 10,
    height_cm: 2
  },
  {
    id: '2',
    productId: 2,
    name: 'Magic: The Gathering Booster',
    price: 199.99,
    quantity: 1,
    image: '/images/mtgproduct.png',
    stockStatus: 'instock',
    weight_kg: 0.1,
    length_cm: 15,
    width_cm: 10,
    height_cm: 2
  }
];

export default function ShippingPage() {
  const [selectedShipping, setSelectedShipping] = useState<{
    cost: number;
    option: any;
  } | null>(null);

  const handleShippingSelected = (cost: number, option: any) => {
    setSelectedShipping({ cost, option });
  };

  const cartTotal = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const finalTotal = cartTotal + (selectedShipping?.cost || 0);

  return (
    <div className="w-full min-h-screen bg-brand-cream">
      {/* Show HeaderSecondary on mobile, Header on desktop */}
      <div className="md:hidden">
        <HeaderSecondary />
      </div>
      <div className="hidden md:block">
        <Header />
      </div>
      
      <section className="container mx-auto px-4 py-12">
        <div>
          <h2 className="text-brand-gold text-3xl font-bold mb-6">
            <Package className="w-8 h-8 inline-block mr-3" />
            SHIPPING CALCULATOR
          </h2>
          
          <div className="flex items-center justify-between mb-8">
            <Link href="/cart" className="flex items-center gap-2 text-brand-grey-green hover:text-brand-green transition-colors">
              <ArrowLeft className="w-5 h-5" /> Back to Cart
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-1">
              <ShippingForm
                cartItems={mockCartItems}
                onShippingSelected={handleShippingSelected}
              />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-sm p-6 sticky top-4 rounded-lg border-2 border-brand-green/20">
                <h3 className="text-xl font-bold mb-6 text-brand-grey-green">
                  <Truck className="w-6 h-6 inline-block mr-2" />
                  ORDER SUMMARY
                </h3>
                
                <div className="space-y-4 mb-6">
                  {mockCartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img 
                        src={item.image || '/placeholder-product.jpg'} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-brand-grey-green">
                          {item.name}
                        </h3>
                        <p className="text-sm text-brand-grey-green/70">
                          Qty: {item.quantity}
                        </p>
                        {item.weight_kg && (
                          <p className="text-xs text-brand-grey-green/60">
                            Weight: {item.weight_kg * item.quantity}kg
                          </p>
                        )}
                      </div>
                      <p className="font-medium text-brand-grey-green">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-brand-green/20 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-brand-grey-green/80">Subtotal</span>
                    <span className="font-medium text-brand-grey-green">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-brand-grey-green/80">Shipping</span>
                    <span className="font-medium text-brand-grey-green">
                      {selectedShipping ? formatPrice(selectedShipping.cost) : 'TBD'}
                    </span>
                  </div>
                  
                  {selectedShipping && (
                    <div className="text-sm text-brand-grey-green/70">
                      <p>{selectedShipping.option.name}</p>
                      {selectedShipping.option.deliveryTime && (
                        <p className="text-xs">Delivery: {selectedShipping.option.deliveryTime}</p>
                      )}
                    </div>
                  )}
                  
                  <div className="border-t border-brand-green/20 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-brand-gold">
                        Total
                      </span>
                      <span className="text-lg font-semibold text-brand-gold">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedShipping && (
                  <div className="mt-6">
                    <Link 
                      href="/checkout" 
                      className="bg-brand-green text-white px-6 py-3 rounded-lg hover:bg-brand-green/90 transition-colors w-full text-center block"
                    >
                      Proceed to Checkout
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer - handled by layout */}
    </div>
  );
}

