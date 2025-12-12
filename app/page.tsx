'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

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

  const handleShopClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push('/shop');
  };

  return (
    <div className="w-full m-0 p-0 overflow-hidden bg-brand-cream">
      {/* Flowers decoration at the top - overlapping the top of the page */}
      <div
        className={`transition-all duration-1000 ease-out ${
          isTransitioning
            ? 'scale-150 translate-y-[-200px] md:translate-y-[-200px] opacity-0'
            : 'scale-[1.5] translate-y-0 opacity-100'
        }`}
      >
        <Image
          src="/decorative/flowers-long.svg"
          alt="Decorative flowers"
          width={1920}
          height={400}
          className="w-full h-auto object-cover block -mt-[40px] md:-mt-[80px]"
          priority
        />
      </div>
      
      {/* Welcome content - center aligned */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center flex flex-col items-center gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12 relative z-10">
        <h1
          className={`text-brand-gold text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.481em] transition-all duration-1000 ease-out ${
            isTransitioning
              ? 'scale-[2] -translate-x-[150px] sm:-translate-x-[200px] md:-translate-x-[300px] -translate-y-[50px] sm:-translate-y-[75px] md:-translate-y-[100px] opacity-0'
              : 'scale-100 translate-x-0 translate-y-0 opacity-100'
          }`}
        >
          WELCOME TO
        </h1>
        
        <div
          className={`transition-all duration-1000 ease-out w-full max-w-[280px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[720px] ${
            isTransitioning
              ? 'scale-150 -translate-y-[75px] sm:-translate-y-[100px] md:-translate-y-[150px] opacity-0'
              : 'scale-100 translate-y-0 opacity-100'
          }`}
        >
          <div className="w-full text-center font-hatton text-[38px] leading-tight text-[#c4265b]">
            OH! WHAT A GIFT!
          </div>
        </div>
        
        <h1
          className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold px-2 sm:px-4 transition-all duration-1000 ease-out ${
            isTransitioning
              ? 'scale-150 translate-y-[50px] sm:translate-y-[75px] md:translate-y-[100px] opacity-0'
              : 'scale-100 translate-y-0 opacity-100'
          }`}
        >
          LUXURY EMBROIDERED GIFTING
        </h1>
        
        <h2
          className={`text-base sm:text-lg md:text-xl lg:text-2xl px-2 sm:px-4 transition-all duration-1000 ease-out ${
            isTransitioning
              ? 'scale-150 translate-x-[150px] sm:translate-x-[200px] md:translate-x-[300px] translate-y-[50px] sm:translate-y-[75px] md:translate-y-[100px] opacity-0'
              : 'scale-100 translate-x-0 translate-y-0 opacity-100'
          }`}
        >
          TREASURES FOR PEOPLE YOU REALLY LOVE
        </h2>
        
        <div
          className={`transition-all duration-1000 ease-out mt-2 sm:mt-4 ${
            isTransitioning
              ? 'scale-[2] opacity-0'
              : 'scale-100 opacity-100'
          }`}
        >
          <Button size="lg" className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 whitespace-normal leading-relaxed" onClick={handleClick}>
            TAKE ME<br />HOME
          </Button>
        </div>
        
        <div
          className={`transition-all duration-1000 ease-out mt-4 sm:mt-6 ${
            isTransitioning
              ? 'scale-[2] opacity-0'
              : 'scale-100 opacity-100'
          }`}
        >
          <button
            onClick={handleShopClick}
            className="flex items-center gap-2 text-brand-gold hover:text-brand-gold/80 text-sm sm:text-base md:text-lg font-medium transition-all duration-200 hover:scale-105"
            style={{
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            }}
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            SHOP NOW
          </button>
        </div>
      </div>
    </div>
  );
}
