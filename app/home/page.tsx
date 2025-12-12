import Header from '@/components/layout/header';
import HeaderSecondary from '@/components/layout/header-secondary';
import Slideshow from '@/components/ui/slideshow';
import CuratedCarousel from '@/components/ui/curated-carousel';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getProducts } from '@/services/woocommerce';
import type { Product } from '@/shop/core/ports';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export default async function Home() {
  // Fetch featured products for curated section
  let featured: Product[] = [];
  try {
    const resp = await getProducts({ featured: true, per_page: 6, orderby: 'date', order: 'desc' });
    featured = (resp?.data || []).slice(0, 6);
  } catch {
    // graceful fallback to empty list
    featured = [];
  }

  return (
    <div className="w-full min-h-screen bg-brand-cream">
      {/* Show HeaderSecondary on mobile, Header on desktop */}
      <div className="md:hidden">
        <HeaderSecondary />
      </div>
      <div className="hidden md:block">
        <Header />
      </div>
      <Slideshow />
      
      {/* Curated Treasures Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-brand-green mb-8 text-center">
          CURATED TREASURES JUST FOR YOU
        </h2>
        
        {/* Product Cards - Auto-swipe Carousel */}
        {featured.length > 0 ? (
          <CuratedCarousel products={featured} />
        ) : (
          <p className="text-brand-grey-green text-center">No featured products available.</p>
        )}
        
        {/* Shop All Button */}
        <div className="flex justify-center mt-8">
          <Link href="/shop">
            <Button className="text-brand-green border-brand-green">
              SHOP ALL
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Luxury Gifting Experience Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-brand-green mb-8 text-center">
          OFFER THEM A LUXURY GIFTING EXPERIENCE LIKE NO OTHER
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Image */}
          <div className="w-full aspect-square">
            <Image
              src="/assets/5f64c4ec3e8d607bfead46e64f4905f2.png"
              alt="Luxury gifting"
              width={600}
              height={600}
              className="w-full h-full object-cover rounded-[20px]"
            />
          </div>
          
          {/* Right Side - Content */}
          <div className="flex flex-col gap-4 text-center text-brand-gold">
            <h3 className="text-[1.68rem]">PERSONALISED GIFTING OPTIONS</h3>
            
            <h5 className="text-brand-green max-w-xs mx-auto">
              Together, we'll create a beautiful bespoke piece made only for
              them, whether it's for a friend, family member, or colleague, our
              artisans bring your vision to life with precision and heart.
            </h5>
            
            <div className="flex justify-center">
              <Link href="/personalise">
                <Button className="text-brand-green">PERSONALISED GIFTING</Button>
              </Link>
            </div>
          </div>
        </div>  
      </div>
      
      {/* Curated Ranges Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Content */}
          <div className="flex flex-col gap-4 text-center text-brand-gold">
            <h3 className="text-[1.68rem]">CURATED RANGES</h3>
            
            <h5 className="text-brand-green max-w-xs mx-auto">
              Our vibrant artist-led designs are perfect for adding that special touch
              to your gift. 
            </h5>
            <h5 className="text-brand-green max-w-xs mx-auto">
            Each piece can be customised with a short name or message
            as well.
            </h5>
            
            <div className="flex justify-center">
              <Link href="/shop">
                <Button className="text-brand-green">EXPLORE EXCLUSIVE RANGES</Button>
              </Link>
            </div>
          </div>
          
          {/* Right Side - Image */}
          <div className="w-full aspect-square md:order-2">
            <Image
              src="/assets/b3eff3cd52f1bca165b07cca1db60a29.png"
              alt="Curated ranges"
              width={600}
              height={600}
              className="w-full h-full object-cover rounded-[20px]"
            />
          </div>
        </div>
      </div>
      
      {/* Our Philosophy Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Video */}
          <div className="w-full aspect-square">
            <video
              src="/assets/gift-opening.mp4"
              className="w-full h-full object-cover rounded-[20px]"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          
          {/* Right Side - Content */}
          <div className="flex flex-col gap-4 text-center text-brand-gold items-center">
            <h3 className="text-[1.68rem]">OUR PHILOSOPHY</h3>
            
            <h5 className="text-brand-green max-w-xs mx-auto">
              We design luxurious, meaningful pieces for those who find beauty in the art of giving.
            </h5>
            
            <h5 className="text-brand-green max-w-xs mx-auto">
              Our role is to shape your idea into a gift that feels uniquely yours.
            </h5>
            
            <div className="flex flex-col gap-3 justify-center items-center w-1/2">
              <Link href="/personalise" className="w-full">
                <Button className="text-brand-green w-full py-4 px-4 h-auto min-h-[3rem]">
                  PERSONALISE<br />A GIFT
                </Button>
              </Link>
              <Link href="/shop" className="w-full">
                <Button className="text-brand-green w-full py-4 px-4 h-auto min-h-[4rem]">
                  SHOP<br />EXCLUSIVE<br />RANGE
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* You're Invited Section */}
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl">
          {/* Left Side - Content */}
          <div className="flex flex-col gap-4 text-center text-brand-gold w-full items-center">
            <h3 className="text-[1.68rem]">YOU'RE INVITED</h3>
            
            <h5 className="text-brand-green max-w-xs mx-auto">
              Quiet exclusivity.
            </h5>
            <h5 className="text-brand-green max-w-xs mx-auto">
              Rare releases.
            </h5>
            <h5 className="text-brand-green max-w-xs mx-auto">
              A space for those who appreciate the extraordinary.
            </h5>
            
            <div className="flex flex-col gap-5 w-3/5">
              <Input
                type="email"
                placeholder="Enter your email"
                className="border-brand-green text-brand-green placeholder:text-brand-green/60 bg-transparent"
              />
              <Button className="text-brand-green w-full">SUBSCRIBE</Button>
            </div>
          </div>
          
          {/* Right Side - Image */}
          <div className="w-full aspect-square md:order-2">
            <Image
              src="/assets/2176d40e2dcd4504f63c7d2c34b05bb7.jpg"
              alt="You're invited"
              width={600}
              height={600}
              className="w-full h-full object-cover rounded-[20px]"
            />
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-brand-green mb-8 text-center">
          WHAT OUR CUSTOMERS SAY
        </h2>
        
        {/* Mobile Slider */}
        <div className="md:hidden">
          <Carousel
            opts={{
              loop: true,
              align: 'start',
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              <CarouselItem className="pl-2 md:pl-4 basis-full">
                <div className="flex flex-col gap-4 p-6 bg-brand-light-green rounded-[20px]">
                  <h5 className="text-brand-green">Sarah M.</h5>
                  <p className="text-brand-grey-green">
                    "Absolutely stunning quality! The embroidery work is exquisite and
                    the personalized message made it truly special. Highly recommend!"
                  </p>
                </div>
              </CarouselItem>
              <CarouselItem className="pl-2 md:pl-4 basis-full">
                <div className="flex flex-col gap-4 p-6 bg-brand-light-green rounded-[20px]">
                  <h5 className="text-brand-green">Michael R.</h5>
                  <p className="text-brand-grey-green">
                    "The perfect gift for my sister's wedding. Beautiful craftsmanship
                    and attention to detail. She absolutely loved it!"
                  </p>
                </div>
              </CarouselItem>
              <CarouselItem className="pl-2 md:pl-4 basis-full">
                <div className="flex flex-col gap-4 p-6 bg-brand-light-green rounded-[20px]">
                  <h5 className="text-brand-green">Emma L.</h5>
                  <p className="text-brand-grey-green">
                    "These towels are so luxurious! The quality is exceptional and the
                    personalization option made it a truly unique gift."
                  </p>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
        
        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {/* Review 1 */}
          <div className="flex flex-col gap-4 p-6 bg-brand-light-green rounded-[20px]">
            <h5 className="text-brand-green">Sarah M.</h5>
            <p className="text-brand-grey-green">
              "Absolutely stunning quality! The embroidery work is exquisite and
              the personalized message made it truly special. Highly recommend!"
            </p>
          </div>
          
          {/* Review 2 */}
          <div className="flex flex-col gap-4 p-6 bg-brand-light-green rounded-[20px]">
            <h5 className="text-brand-green">Michael R.</h5>
            <p className="text-brand-grey-green">
              "The perfect gift for my sister's wedding. Beautiful craftsmanship
              and attention to detail. She absolutely loved it!"
            </p>
          </div>
          
          {/* Review 3 */}
          <div className="flex flex-col gap-4 p-6 bg-brand-light-green rounded-[20px]">
            <h5 className="text-brand-green">Emma L.</h5>
            <p className="text-brand-grey-green">
              "These towels are so luxurious! The quality is exceptional and the
              personalization option made it a truly unique gift."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
