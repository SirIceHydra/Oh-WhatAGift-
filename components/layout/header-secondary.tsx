'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, Menu, ShoppingCart, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

export default function HeaderSecondary() {
  return (
    <header className="w-full">
      {/* Top decorative image spanning the page */}
      <div className="w-full -mt-12">
        <Image
          src="/decorative/flowers.png"
          alt="Decorative flowers"
          width={1920}
          height={100}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
      
      {/* Navigation bar with brand-light-green background */}
      <div className="bg-brand-light-green w-full">
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between w-full">
            {/* Left side - Home icon and Burger menu */}
            <div className="flex items-center gap-4">
              <Link href="/home" className="text-brand-green hover:opacity-80 transition-opacity">
                <Home size={24} />
              </Link>
              <Sheet>
                <SheetTrigger asChild>
                  <button className="text-brand-green hover:opacity-80 transition-opacity">
                    <Menu size={24} />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-brand-light-green border-brand-green">
                  <SheetClose className="absolute right-4 top-4 text-brand-green hover:opacity-80 transition-opacity">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close</span>
                  </SheetClose>
                  <div className="flex flex-col gap-6 mt-8">
                    <SheetClose asChild>
                      <Link href="/home" className="text-brand-green uppercase text-lg hover:opacity-80 transition-opacity">
                        Home
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/shop" className="text-brand-green uppercase text-lg hover:opacity-80 transition-opacity">
                        Shop exclusive ranges
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/personalise" className="text-brand-green uppercase text-lg hover:opacity-80 transition-opacity">
                        Personalise a gift
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/about" className="text-brand-green uppercase text-lg hover:opacity-80 transition-opacity">
                        About us
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/journal" className="text-brand-green uppercase text-lg hover:opacity-80 transition-opacity">
                        Our journal
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/contact" className="text-brand-green uppercase text-lg hover:opacity-80 transition-opacity">
                        Contact us
                      </Link>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Center - Logo text */}
            <Link href="/home" className="flex-shrink-0">
              <Image
                src="/logos/logo-text.svg"
                alt="Oh! What a Gift!"
                width={200}
                height={40}
                className="h-[3.6rem] w-auto"
              />
            </Link>
            
            {/* Right side - Cart icon */}
            <Link href="/cart" className="text-brand-green hover:opacity-80 transition-opacity">
              <ShoppingCart size={24} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

