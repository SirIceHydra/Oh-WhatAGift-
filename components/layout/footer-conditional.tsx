'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Footer from './footer';

export default function FooterConditional() {
  const pathname = usePathname();
  // Hide footer on landing page "/"
  if (pathname === '/') return null;
  return (
    <>
      <Footer />
    </>
  );
}

