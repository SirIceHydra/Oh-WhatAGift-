'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart } from 'lucide-react';
import { useCart } from '@/shop/core/cart/CartContext';

export default function Header() {
  const { cart } = useCart();
  const itemCount = cart?.itemCount ?? 0;

  return (
    <header className="bg-brand-cream">
      <div className="container mx-auto px-4 py-4">
        {/* Top section with logo and search/cart */}
        <div className="flex items-end justify-between w-full pb-4 border-b">
          {/* Logo on the left */}
          <Link href="/home">
            <Image
              src="/logos/logo-main.svg"
              alt="Logo"
              width={432}
              height={144}
              className="h-auto"
            />
          </Link>
          
          {/* Search bar and cart icons on the right */}
          <div className="flex items-center gap-4 pb-2">
            {/* Search bar */}
            <div className="flex items-center border border-brand-green rounded-full px-3 py-1">
              <Search size={20} className="text-brand-green" />
              <input
                type="text"
                placeholder="Search"
                className="px-2 py-1 bg-transparent border-none outline-none text-brand-green placeholder:text-brand-green/60"
              />
            </div>
            
            {/* Cart icon with item count badge */}
            <Link href="/cart" className="relative inline-flex items-center text-brand-green">
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-brand-green text-brand-cream text-[11px] leading-[18px] text-center font-semibold px-1"
                  aria-label={`${itemCount} item${itemCount === 1 ? '' : 's'} in cart`}
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
        
        {/* Navigation links */}
        <nav className="flex items-center justify-between w-full pt-4">
          <ul className="flex justify-between w-full gap-6">
            <li>
              <Link href="/home" className="text-brand-green uppercase">
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" className="text-brand-green uppercase">
                Shop exclusive ranges
              </Link>
            </li>
            <li>
              <Link href="/personalise" className="text-brand-green uppercase">
                Personalise a gift
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-brand-green uppercase">
                About us
              </Link>
            </li>
            <li>
              <Link href="/journal" className="text-brand-green uppercase">
                Our journal
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-brand-green uppercase">
                Contact us
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
