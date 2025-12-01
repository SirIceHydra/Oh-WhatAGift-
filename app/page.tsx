'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Welcome() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsTransitioning(true);
    
    // Wait for animation to complete, then navigate
    setTimeout(() => {
      router.push('/home');
    }, 1000); // Match animation duration
  };

  return (
    <div className="w-full m-0 p-0 overflow-hidden bg-brand-cream">
      {/* Flowers decoration at the top - overlapping the top of the page */}
      <div
        className={`transition-all duration-1000 ease-out ${
          isTransitioning
            ? 'scale-150 translate-y-[-200px] opacity-0'
            : 'scale-100 translate-y-0 opacity-100'
        }`}
      >
        <Image
          src="/decorative/flowers-long.svg"
          alt="Decorative flowers"
          width={1920}
          height={400}
          className="w-full h-auto object-cover block -mt-[80px]"
          priority
        />
      </div>
      
      {/* Welcome content - center aligned */}
      <div className="container mx-auto px-4 text-center flex flex-col items-center gap-8 pt-32 pb-12 relative z-10">
        <h1
          className={`text-brand-gold tracking-[0.481em] transition-all duration-1000 ease-out ${
            isTransitioning
              ? 'scale-[2] -translate-x-[300px] -translate-y-[100px] opacity-0'
              : 'scale-100 translate-x-0 translate-y-0 opacity-100'
          }`}
        >
          WELCOME TO
        </h1>
        
        <div
          className={`transition-all duration-1000 ease-out ${
            isTransitioning
              ? 'scale-150 -translate-y-[150px] opacity-0'
              : 'scale-100 translate-y-0 opacity-100'
          }`}
        >
          <Image
            src="/logos/logo-text.svg"
            alt="Towel Co Logo"
            width={720}
            height={132}
            className="h-auto"
            priority
          />
        </div>
        
        <h1
          className={`transition-all duration-1000 ease-out ${
            isTransitioning
              ? 'scale-150 translate-y-[100px] opacity-0'
              : 'scale-100 translate-y-0 opacity-100'
          }`}
        >
          LUXURY EMBROIDERED GIFTING
        </h1>
        
        <h2
          className={`transition-all duration-1000 ease-out ${
            isTransitioning
              ? 'scale-150 translate-x-[300px] translate-y-[100px] opacity-0'
              : 'scale-100 translate-x-0 translate-y-0 opacity-100'
          }`}
        >
          TREASURES FOR PEOPLE YOU REALLY LOVE
        </h2>
        
        <div
          className={`transition-all duration-1000 ease-out ${
            isTransitioning
              ? 'scale-[2] opacity-0'
              : 'scale-100 opacity-100'
          }`}
        >
          <Button size="lg" className="mt-4" onClick={handleClick}>
            TAKE ME<br />HOME
          </Button>
        </div>
      </div>
    </div>
  );
}
