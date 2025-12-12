'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

const slides = [
  '/hardcode/slideshow/slide1.png',
  '/hardcode/slideshow/slide2.png',
  '/hardcode/slideshow/slide3.png',
  '/hardcode/slideshow/slide4.png',
];

export default function Slideshow() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  // Auto-swipe functionality
  React.useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 8000); // Auto-swipe every 8 seconds

    return () => clearInterval(interval);
  }, [api]);

  // Track current slide
  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Handle navigation button click
  const scrollTo = (index: number) => {
    if (!api) return;
    api.scrollTo(index);
  };

  return (
    <div className="w-full relative group">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          duration: 15,
          align: 'start',
          dragFree: false,
        }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="w-full relative flex justify-center items-center">
                <div className="scale-75 w-full">
                  <Image
                    src={slide}
                    alt={`Slide ${index + 1}`}
                    width={1920}
                    height={800}
                    className="w-full h-auto object-cover max-h-[800px] pointer-events-none"
                    priority={index === 0}
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Left Arrow */}
      <button
        onClick={() => api?.scrollPrev()}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-brand-green bg-brand-cream/80 text-brand-green hover:bg-brand-green hover:text-brand-cream transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      
      {/* Right Arrow */}
      <button
        onClick={() => api?.scrollNext()}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-brand-green bg-brand-cream/80 text-brand-green hover:bg-brand-green hover:text-brand-cream transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      
      {/* Navigation dots at the bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index
                ? 'bg-brand-green w-8'
                : 'bg-brand-green/50 hover:bg-brand-green/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
