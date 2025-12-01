import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, CreditCard, Package, Shield, Truck } from 'lucide-react';
import { useCart } from '../core/cart/CartContext';
import { useCheckout } from '../core/hooks/useCheckout';
import { useShipping } from '../../shipping/hooks/useShipping';
import { formatPrice } from '../../utils/helpers';
import { CartItemWithShipping } from '../../shipping/types/shipping';

type CheckoutForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  province: string; // South African province code (e.g., GP, WC)
};

interface CheckoutProps { className?: string }

export default function Checkout({ className = '' }: CheckoutProps) {
  const { cart } = useCart();
  const { loading: checkoutLoading, error: checkoutError, createOrder, processPayment } = useCheckout();
  const formRef = useRef<HTMLFormElement>(null);
  const { 
    shippingRates, 
    fetchShippingRates, 
    selectShippingOption, 
  } = useShipping();
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', postalCode: '', country: 'South Africa', province: '',
  });
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingOption, setShippingOption] = useState<any>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'shipping' | 'collect' | 'pudo'>('shipping');

  // ✅ Add validation state for complete order button
  const [isFormValid, setIsFormValid] = useState(false);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // South African provinces
  const provinces = [
    { code: '', name: 'Select a province' },
    { code: 'EC', name: 'Eastern Cape' },
    { code: 'FS', name: 'Free State' },
    { code: 'GP', name: 'Gauteng' },
    { code: 'KZN', name: 'KwaZulu-Natal' },
    { code: 'LP', name: 'Limpopo' },
    { code: 'MP', name: 'Mpumalanga' },
    { code: 'NW', name: 'North West' },
    { code: 'NC', name: 'Northern Cape' },
    { code: 'WC', name: 'Western Cape' },
  ];

  // Convert cart items to shipping format
  const convertCartToShippingItems = useCallback((): CartItemWithShipping[] => {
    return cart.items.map(item => ({
      ...item,
      weight_kg: 0.1, // Default weight for TCG products
      length_cm: 15,
      width_cm: 10,
      height_cm: 2
    }));
  }, [cart.items]);

  // Calculate shipping when address is complete
  const calculateShipping = useCallback(async () => {
    if (deliveryMethod === 'collect') {
      setShippingCost(0);
      setShippingOption({ id: 'collect', name: 'Collect from Store', price: 0, description: 'Collect your order from our store' });
      return;
    }
    if (deliveryMethod === 'pudo') {
      // Check free shipping threshold for PUDO
      const cartTotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const freeShippingThreshold = parseFloat(process.env.REACT_APP_FREE_SHIPPING_THRESHOLD || '1499');
      
      if (cartTotal >= freeShippingThreshold) {
        setShippingCost(0);
        setShippingOption({ 
          id: 'pudo_free', 
          name: 'Send with Pudo Locker (Free)', 
          price: 0, 
          description: `Free PUDO delivery on orders over R${freeShippingThreshold}` 
        });
      } else {
        setShippingCost(80);
        setShippingOption({ 
          id: 'pudo', 
          name: 'Send with Pudo Locker', 
          price: 80, 
          description: 'Pick up your order from a Pudo locker' 
        });
      }
      return;
    }
    if (!formData.address || !formData.city || !formData.postalCode || !formData.province) return;

    const shippingAddress = {
      street_address: formData.address,
      local_area: formData.city,
      city: formData.city,
      zone: formData.province,
      country: formData.country === 'South Africa' ? 'ZA' : formData.country,
      code: formData.postalCode,
      company: ''
    };

    const shippingItems = convertCartToShippingItems();
    await fetchShippingRates(shippingAddress, shippingItems);
  }, [deliveryMethod, formData.address, formData.city, formData.postalCode, formData.province, formData.country, fetchShippingRates, convertCartToShippingItems, cart.items]);

  // Update shipping cost when rates change
  useEffect(() => {
    if (shippingRates.selectedOption) {
      setShippingCost(shippingRates.selectedOption.price);
      setShippingOption(shippingRates.selectedOption);
    }
  }, [shippingRates.selectedOption]);

  // Calculate shipping when address changes or delivery method changes
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateShipping();
    }, 1000); // Debounce

    return () => clearTimeout(timer);
  }, [formData.address, formData.city, formData.postalCode, formData.province, deliveryMethod, calculateShipping]);

  // ✅ Validate form and shipping selection for complete order button
  useEffect(() => {
    const validateForm = () => {
      // Check required contact fields
      const hasRequiredFields = formData.firstName.trim() && 
                               formData.lastName.trim() && 
                               formData.email.trim() && 
                               formData.phone.trim();

      if (!hasRequiredFields) {
        setIsFormValid(false);
        return;
      }

      // Check delivery method specific requirements
      if (deliveryMethod === 'shipping') {
        // For shipping: need address fields AND shipping option selected
        const hasAddressFields = formData.address.trim() && 
                                formData.city.trim() && 
                                formData.postalCode.trim() && 
                                formData.province.trim();
        
        const hasShippingSelected = shippingOption && shippingOption.id;
        
        setIsFormValid(hasAddressFields && hasShippingSelected);
      } else if (deliveryMethod === 'collect') {
        // For collect: only need contact fields (already validated above)
        setIsFormValid(true);
      } else if (deliveryMethod === 'pudo') {
        // For pudo: need contact fields AND shipping option selected (if not free)
        const hasShippingSelected = shippingOption && shippingOption.id;
        setIsFormValid(hasShippingSelected);
      } else {
        setIsFormValid(false);
      }
    };

    validateForm();
  }, [formData, deliveryMethod, shippingOption]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.items.length === 0) { alert('Your cart is empty'); return; }
    
    // Validate required fields based on delivery method
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert('Please fill in all required contact information');
      return;
    }
    
    // Only require address fields if shipping is selected
    if (deliveryMethod === 'shipping') {
      if (!formData.province || formData.province === '') { 
        alert('Please select a province'); 
        return; 
      }
      if (!formData.address || !formData.city || !formData.postalCode) {
        alert('Please fill in all address fields for shipping');
        return;
      }
    }
    try {
      const shippingAmount = Number(shippingCost || 0);
      const orderResult = await createOrder(cart.items, {
        ...formData,
        shippingCost: shippingAmount,
        shippingMethodId: shippingOption?.id || (deliveryMethod === 'collect' ? 'collect' : deliveryMethod === 'pudo' ? 'pudo' : 'flat_rate'),
        shippingMethodTitle: shippingOption?.name || (deliveryMethod === 'collect' ? 'Collect from Store' : deliveryMethod === 'pudo' ? 'Send with Pudo Locker' : 'Shipping'),
        deliveryMethod: deliveryMethod, // ✅ Pass delivery method to order creation
      }, deliveryMethod);
      if (!orderResult.success || !orderResult.orderId) throw new Error(orderResult.error || 'Failed to create order');
      // ✅ Process payment and redirect to PayFast
      await processPayment(orderResult.orderId, `ORDER-${orderResult.orderId}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        total: cart.total + shippingAmount,
      }, cart.items);
    } catch (err) {
      console.error('Checkout error:', err);
      alert(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className={`min-h-screen bg-white text-secondary ${className}`}>
        <div className="h-20" />
        <section className="gallery-carousel" style={{ paddingTop: '120px', paddingBottom: '30px' }}>
          <div className="container">
            <h2 className="h2 section-title" style={{ color: 'var(--white)' }}>CHECKOUT</h2>
            <div className="bg-primarySupport shadow-sm p-8 text-center">
              <Package className="w-16 h-16" color="#14fefb" style={{ margin: '0 auto 16px' }} />
              <h3 className="h3" style={{ color: 'var(--white)', marginBottom: 8 }}>YOUR CART IS EMPTY</h3>
              <p style={{ color: 'var(--platinum)', marginBottom: 16 }}>Please add some products to your cart before checkout.</p>
              <button 
                onClick={() => { window.location.href = '/shop'; }}
                className="btn btn-primary"
                style={{ display: 'inline-flex' }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-primary text-support ${className}`}>
      <div className="h-20" />
      <section className="gallery-carousel" style={{ paddingTop: '40px', paddingBottom: '30px' }}>
        <div className="container">
          <h2 className="text-h2-sm xl:text-h2 font-heading text-black text-center">CHECKOUT</h2>
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => { window.location.href = '/cart'; }}
              className="flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Cart
            </button>
          </div>

          {/* MAIN LAYOUT: shipping left (2/3), summary right (1/3) */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            {/* SHIPPING INFORMATION - LEFT */}
            <div className="w-full lg:w-2/3">
              <div className="bg-primary border border-black/20 w-full">
                <div className="p-4 sm:p-6 border-b border-black/20">
                  <h3 className="text-h6-sm xl:text-h6 font-heading text-black">SHIPPING INFORMATION</h3>
                </div>
                <div className="px-6 py-8">
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-1" style={{ color: 'black' }}>First Name *</label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-3 py-2 border border-black/30 bg-white text-black focus:outline-none focus:ring-2 focus:ring-black" />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-1" style={{ color: 'black' }}>Last Name *</label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-3 py-2 border border-black/30 bg-white text-black focus:outline-none focus:ring-2 focus:ring-black" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: 'black' }}>Email *</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-black/30 bg-white text-black focus:outline-none focus:ring-2 focus:ring-black" />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-1" style={{ color: 'black' }}>Phone *</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border border-black/30 bg-white text-black focus:outline-none focus:ring-2 focus:ring-black" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium mb-1" style={{ color: 'black' }}>
                        Address {deliveryMethod === 'shipping' ? '*' : ''}
                      </label>
                      <input 
                        type="text" 
                        id="address" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleInputChange} 
                        required={false}
                        disabled={deliveryMethod === 'collect'}
                        className={`w-full px-3 py-2 border border-black/30 bg-white text-black focus:outline-none focus:ring-2 focus:ring-black ${deliveryMethod === 'collect' ? 'opacity-50 cursor-not-allowed' : ''}`} 
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium mb-1" style={{ color: 'black' }}>
                        City {deliveryMethod === 'shipping' ? '*' : ''}
                      </label>
                      <input 
                        type="text" 
                        id="city" 
                        name="city" 
                        value={formData.city} 
                        onChange={handleInputChange} 
                        required={false}
                        disabled={deliveryMethod === 'collect'}
                        className={`w-full px-3 py-2 border border-black/30 bg-white text-black focus:outline-none focus:ring-2 focus:ring-black ${deliveryMethod === 'collect' ? 'opacity-50 cursor-not-allowed' : ''}`} 
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                      <div>
                        <label htmlFor="province" className="block text-sm font-medium mb-1" style={{ color: 'black' }}>
                          Province {deliveryMethod === 'shipping' ? '*' : ''}
                        </label>
                        <select
                          id="province"
                          name="province"
                          value={formData.province}
                          onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value }))}
                          required={false}
                          disabled={deliveryMethod === 'collect'}
                          className={`w-full px-3 py-2 border border-black/30 bg-white text-black focus:outline-none focus:ring-2 focus:ring-black ${deliveryMethod === 'collect' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {provinces.map(p => (
                            <option 
                              key={p.code} 
                              value={p.code}
                              disabled={p.code === ''}
                              style={{ color: p.code === '' ? '#999' : 'inherit' }}
                            >
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium mb-1" style={{ color: 'black' }}>
                          Postal Code {deliveryMethod === 'shipping' ? '*' : ''}
                        </label>
                        <input 
                          type="text" 
                          id="postalCode" 
                          name="postalCode" 
                          value={formData.postalCode} 
                          onChange={handleInputChange} 
                          required={false}
                          disabled={deliveryMethod === 'collect'}
                          className={`w-full px-3 py-2 border border-black/30 bg-white text-black focus:outline-none focus:ring-2 focus:ring-black ${deliveryMethod === 'collect' ? 'opacity-50 cursor-not-allowed' : ''}`} 
                        />
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium mb-1" style={{ color: 'black' }}>
                          Country {deliveryMethod === 'shipping' ? '*' : ''}
                        </label>
                        <input 
                          type="text" 
                          id="country" 
                          name="country" 
                          value={formData.country} 
                          onChange={handleInputChange} 
                          required={false}
                          disabled={deliveryMethod === 'collect'}
                          className={`w-full px-3 py-2 border border-black/30 bg-white text-black focus:outline-none focus:ring-2 focus:ring-black ${deliveryMethod === 'collect' ? 'opacity-50 cursor-not-allowed' : ''}`} 
                        />
                      </div>
                    </div>

                    {/* Delivery Method Selection */}
                    <div className="mt-6">
                      <h4 className="text-h5-sm xl:text-h5 font-heading text-black mb-6">
                        <Package className="w-5 h-5 inline-block mr-2" />
                        Delivery Method
                      </h4>
                      
                      <div className="space-y-5 lg:space-y-6">
                        <div
                          className={`rounded-none p-5 cursor-pointer transition-all duration-200 hover:bg-black/5 ${
                            deliveryMethod === 'shipping'
                              ? 'border-4 border-secondary bg-secondary/5 shadow-md'
                              : 'border-2 border-black/30 hover:border-black/50'
                          }`}
                          onClick={() => setDeliveryMethod('shipping')}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                              deliveryMethod === 'shipping' 
                                ? 'border-tertiary bg-tertiary' 
                                : 'border-tertiary/40'
                            }`}>
                              {deliveryMethod === 'shipping' && (
                                <div className="w-2 h-2 bg-primary rounded-full m-0.5"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center text-black">
                                <Truck className="w-5 h-5 mr-2" style={{ color: 'var(--tertiary)' }} />
                                <h5 className="font-semibold">
                                  Shipping to Address
                                </h5>
                              </div>
                              <p className="text-sm text-black/70">
                                We'll deliver your order to your address
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`rounded-none p-5 cursor-pointer transition-all duration-200 hover:bg-black/5 ${
                            deliveryMethod === 'collect'
                              ? 'border-4 border-secondary bg-secondary/5 shadow-md'
                              : 'border-2 border-black/30 hover:border-black/50'
                          }`}
                          onClick={() => setDeliveryMethod('collect')}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                              deliveryMethod === 'collect' 
                                ? 'border-tertiary bg-tertiary' 
                                : 'border-tertiary/40'
                            }`}>
                              {deliveryMethod === 'collect' && (
                                <div className="w-2 h-2 bg-primary rounded-full m-0.5"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center text-black">
                                <Package className="w-5 h-5 mr-2" style={{ color: 'var(--tertiary)' }} />
                                <h5 className="font-semibold">
                                  Collect from Store
                                </h5>
                              </div>
                              <p className="text-sm text-black/70">
                                Pick up your order from our store (Free)
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`rounded-none p-5 cursor-pointer transition-all duration-200 hover:bg-black/5 ${
                            deliveryMethod === 'pudo'
                              ? 'border-4 border-secondary bg-secondary/5 shadow-md'
                              : 'border-2 border-black/30 hover:border-black/50'
                          }`}
                          onClick={() => setDeliveryMethod('pudo')}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                              deliveryMethod === 'pudo' 
                                ? 'border-tertiary bg-tertiary' 
                                : 'border-tertiary/40'
                            }`}>
                              {deliveryMethod === 'pudo' && (
                                <div className="w-2 h-2 bg-primary rounded-full m-0.5"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center text-black">
                                <Package className="w-5 h-5 mr-2" style={{ color: 'var(--tertiary)' }} />
                                <h5 className="font-semibold">
                                  Send with Pudo Locker
                                </h5>
                              </div>
                              <p className="text-sm text-black/70">
                                Pick up your order from a Pudo locker {shippingOption?.price === 0 ? '(Free)' : '(R80)'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PUDO Notification */}
                    {deliveryMethod === 'pudo' && (
                      <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-blue-300">
                              PUDO Locker Information Required
                              {shippingOption?.price === 0 && (
                                <span className="ml-2 text-green-400 text-xs">(Free Delivery!)</span>
                              )}
                            </h4>
                            <p className="mt-1 text-sm text-blue-200">
                              Please send your preferred PUDO locker information to{' '}
                              <a 
                                href="mailto:oraclegaming.za@gmail.com" 
                                className="font-medium text-blue-300 hover:text-blue-200 underline"
                              >
                                oraclegaming.za@gmail.com
                              </a>
                              {' '}after placing your order.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Shipping Options - only show if shipping method is selected */}
                    {deliveryMethod === 'shipping' && shippingRates.options.length > 0 && (
                      <div className="space-y-4 lg:space-y-5">
                        <h4 className="text-h5-sm xl:text-h5 font-heading text-black">
                          <Truck className="w-5 h-5 inline-block mr-2" />
                          Shipping Options
                        </h4>
                        
                        {shippingRates.options.map((option) => (
                          <div
                            key={option.id}
                            className={`rounded-none p-5 cursor-pointer transition-all duration-200 hover:bg-black/5 ${
                              option.selected
                                ? 'border-4 border-secondary bg-secondary/5 shadow-md'
                                : 'border-2 border-black/30 hover:border-black/50'
                            }`}
                            onClick={() => selectShippingOption(option.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                  option.selected 
                                    ? 'border-tertiary bg-tertiary' 
                                    : 'border-tertiary/40'
                                }`}>
                                  {option.selected && (
                                    <div className="w-2 h-2 bg-primary rounded-full m-0.5"></div>
                                  )}
                                </div>
                                <div className="text-black">
                                  <h5 className="font-semibold">
                                    {option.name}
                                  </h5>
                                  <p className="text-sm text-black/70">
                                    {option.description}
                                  </p>
                                  {option.deliveryTime && (
                                    <p className="text-xs text-black/60">
                                      Delivery: {option.deliveryTime}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-black">
                                  {option.price === 0 ? 'Free' : formatPrice(option.price)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {shippingRates.error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-red-600 text-sm">{shippingRates.error}</p>
                      </div>
                    )}

                    {checkoutError && (<div className="p-3 bg-red-50 border border-red-200"><p className="text-red-600 text-sm">{checkoutError}</p></div>)}
                  </form>
                </div>
              </div>
            </div>

            {/* ORDER SUMMARY - RIGHT */}
            <div className="w-full lg:w-1/3">
              <div className="bg-primary border border-black/20 lg:sticky lg:top-4 lg:max-w-md lg:ml-auto w-full">
                <div className="p-4 sm:p-6 border-b border-black/20">
                  <h3 className="text-h6-sm xl:text-h6 font-heading text-black">ORDER SUMMARY</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {cart.items.map(item => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img
                          src={item.image || '/placeholder-product.jpg'}
                          alt={item.name}
                          className="w-8 h-8 object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-black">{item.name}</h3>
                          <p className="text-sm text-black/70">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-black">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-black/20 pt-4 space-y-3">
                    <div className="flex justify-between"><span className="text-black/70">Subtotal</span><span className="font-medium text-black">{formatPrice(cart.total)}</span></div>
                    <div className="flex justify-between">
                      <span className="text-black/70">Shipping</span>
                      <span className="font-medium text-black">
                        {shippingRates.loading ? 'Calculating...' : formatPrice(shippingCost)}
                      </span>
                    </div>
                    {shippingOption && (
                      <div className="text-sm text-black/70">
                        <p>{shippingOption.name}</p>
                        {shippingOption.deliveryTime && (
                          <p className="text-xs">Delivery: {shippingOption.deliveryTime}</p>
                        )}
                      </div>
                    )}
                    <div className="border-t border-black/20 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-black">Total</span>
                        <span className="text-lg font-semibold text-black">
                          {formatPrice(cart.total + shippingCost)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-black/5">
                    <div className="flex items-center gap-2 mb-2"><Shield className="w-5 h-5 text-green-600" /><span className="text-sm font-medium text-black">Secure Checkout</span></div>
                    <p className="text-xs text-black/70">Your payment information is encrypted and secure. We use PayFast for secure payment processing.</p>
                  </div>
                </div>
                <div className="mt-6 px-6 pb-6">
                  {shippingRates.error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-red-600 text-sm">{shippingRates.error}</p>
                    </div>
                  )}
                  {checkoutError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-red-600 text-sm">{checkoutError}</p>
                    </div>
                  )}
                  <button 
                    type="button"
                    onClick={() => formRef.current?.requestSubmit()}
                    disabled={checkoutLoading || !isFormValid} 
                    className={`w-full rounded-none py-3 sm:py-4 text-base sm:text-lg font-semibold inline-flex items-center justify-center gap-2 transition-colors border-2 ${
                      isFormValid 
                        ? 'bg-secondary text-tertiary border-secondary hover:bg-tertiary hover:text-secondary' 
                        : 'bg-gray-300 text-gray-600 border-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {checkoutLoading ? (
                      <>
                        <div className={`w-5 h-5 animate-spin border-2 border-t-transparent rounded-full ${
                          isFormValid ? 'border-tertiary' : 'border-gray-600'
                        }`} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Complete Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
