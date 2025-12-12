'use client';

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { ProductCard as ShopProductCard } from '@/shop/ui/ProductCard';
import type { Product } from '@/shop/core/ports';

interface CuratedCarouselProps {
  products: Product[];
}

export default function CuratedCarousel({ products }: CuratedCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();

  // Auto-swipe functionality
  React.useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Auto-swipe every 5 seconds

    return () => clearInterval(interval);
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      opts={{
        loop: true,
        align: 'start',
        duration: 15,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {products.map((p) => (
          <CarouselItem key={p.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3">
            <div className="flex justify-center">
              <ShopProductCard product={p} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

