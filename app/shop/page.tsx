'use client';

import React, { useEffect, useState } from 'react';
import Shop from '@/shop/pages/Shop';
import DetailsPage from '@/shop/pages/DetailsPage';
import PaymentSuccess from '@/shop/pages/PaymentSuccess';
import PaymentFailure from '@/shop/pages/PaymentFailure';

export default function ShopPage() {
  const [hash, setHash] = useState<string>(
    typeof window !== 'undefined' ? window.location.hash : ''
  );

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const currentHash = hash || '';

  // Match product details: #/product/:id
  const matchProduct = /^#\/product\/(\d+)/.exec(currentHash);
  const productId = matchProduct ? matchProduct[1] : null;

  // Match payment routes: #/payment-success and #/payment-failure
  const isPaymentSuccess = currentHash.startsWith('#/payment-success');
  const isPaymentFailure = currentHash.startsWith('#/payment-failure');

  if (isPaymentSuccess) {
    return <PaymentSuccess />;
  }

  if (isPaymentFailure) {
    return <PaymentFailure />;
  }

  if (productId) {
    return <DetailsPage id={productId} />;
  }

  return <Shop />;
}

