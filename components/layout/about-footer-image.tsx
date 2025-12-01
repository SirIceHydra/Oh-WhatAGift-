'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function AboutFooterImage() {
  const pathname = usePathname();
  
  if (pathname !== '/about') {
    return null;
  }
  
  return (
    <div className="w-full">
      <Image
        src="/decorative/flowers.png"
        alt="Decorative flowers"
        width={1920}
        height={400}
        className="w-full h-auto object-cover"
      />
    </div>
  );
}

