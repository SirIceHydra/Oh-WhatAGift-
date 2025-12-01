'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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

  const handleSlideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!api) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const isLeftHalf = clickX < rect.width / 2;
    
    if (isLeftHalf) {
      api.scrollPrev();
    } else {
      api.scrollNext();
    }
  };

  return (
    <Carousel
      setApi={setApi}
      opts={{
        loop: false,
        duration: 30,
      }}
      className="w-full"
    >
      <CarouselContent 
        className="transition-transform duration-500 ease-in-out cursor-pointer"
        onClick={handleSlideClick}
      >
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
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}
