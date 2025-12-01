'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessRedirect() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const target = query
      ? `/shop#/payment-success?${query}`
      : '/shop#/payment-success';

    if (typeof window !== 'undefined') {
      window.location.href = target;
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary text-tertiary">
      <p>Redirecting to payment confirmation...</p>
    </div>
  );
}
