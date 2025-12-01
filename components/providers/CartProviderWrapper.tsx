'use client';

import { CartProvider } from '@/shop/core/cart/CartContext';

export function CartProviderWrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

