import HeaderSecondary from '@/components/layout/header-secondary';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function JournalPage() {
  return (
    <div className="w-full min-h-screen bg-brand-cream">
      <HeaderSecondary />
      
      {/* Behind The Designs Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-brand-gold mb-12 text-center text-[38.4px]">
          BEHIND THE DESIGNS
        </h2>
        
        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Blog Card 1 */}
          <article className="flex flex-col">
            <div className="w-full h-[300px] rounded-[20px] overflow-hidden mb-4">
              <Image
                src="/assets/about.png"
                alt="The Art of Embroidery"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <p className="text-brand-grey-green text-sm mb-2">March 15, 2025</p>
              <h3 className="text-brand-gold text-h4 mb-3">The Art of Embroidery</h3>
              <p className="text-brand-green text-body mb-4 flex-1">
                Discover the intricate techniques and traditions that have shaped our embroidery heritage, passed down through generations of skilled artisans.
              </p>
              <Link 
                href="#" 
                className="flex items-center gap-2 text-brand-light-gold text-sm hover:opacity-80 transition-opacity"
              >
                READ MORE
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>

          {/* Blog Card 2 */}
          <article className="flex flex-col">
            <div className="w-full h-[300px] rounded-[20px] overflow-hidden mb-4">
              <Image
                src="/assets/b3eff3cd52f1bca165b07cca1db60a29.png"
                alt="Design Inspiration"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <p className="text-brand-grey-green text-sm mb-2">February 28, 2025</p>
              <h3 className="text-brand-gold text-h4 mb-3">Design Inspiration from Nature</h3>
              <p className="text-brand-green text-body mb-4 flex-1">
                Explore how the beauty of the natural world influences our designs, from delicate florals to organic patterns that celebrate life's simple pleasures.
              </p>
              <Link 
                href="#" 
                className="flex items-center gap-2 text-brand-light-gold text-sm hover:opacity-80 transition-opacity"
              >
                READ MORE
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>

          {/* Blog Card 3 */}
          <article className="flex flex-col">
            <div className="w-full h-[300px] rounded-[20px] overflow-hidden mb-4">
              <Image
                src="/assets/2176d40e2dcd4504f63c7d2c34b05bb7.jpg"
                alt="Crafting Luxury"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <p className="text-brand-grey-green text-sm mb-2">February 10, 2025</p>
              <h3 className="text-brand-gold text-h4 mb-3">Crafting Luxury Gifts</h3>
              <p className="text-brand-green text-body mb-4 flex-1">
                Learn about our meticulous process of creating personalized gifts that become treasured heirlooms, each piece telling a unique story.
              </p>
              <Link 
                href="#" 
                className="flex items-center gap-2 text-brand-light-gold text-sm hover:opacity-80 transition-opacity"
              >
                READ MORE
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>

          {/* Blog Card 4 */}
          <article className="flex flex-col">
            <div className="w-full h-[300px] rounded-[20px] overflow-hidden mb-4">
              <Image
                src="/assets/5f64c4ec3e8d607bfead46e64f4905f2.png"
                alt="The Gift of Personalization"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <p className="text-brand-grey-green text-sm mb-2">January 22, 2025</p>
              <h3 className="text-brand-gold text-h4 mb-3">The Gift of Personalization</h3>
              <p className="text-brand-green text-body mb-4 flex-1">
                Discover how adding a personal touch transforms an ordinary gift into something extraordinary, creating lasting memories for your loved ones.
              </p>
              <Link 
                href="#" 
                className="flex items-center gap-2 text-brand-light-gold text-sm hover:opacity-80 transition-opacity"
              >
                READ MORE
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>

          {/* Blog Card 5 */}
          <article className="flex flex-col">
            <div className="w-full h-[300px] rounded-[20px] overflow-hidden mb-4">
              <Image
                src="/assets/about.png"
                alt="Sustainable Craftsmanship"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <p className="text-brand-grey-green text-sm mb-2">January 5, 2025</p>
              <h3 className="text-brand-gold text-h4 mb-3">Sustainable Craftsmanship</h3>
              <p className="text-brand-green text-body mb-4 flex-1">
                Our commitment to sustainable practices and ethical sourcing ensures that every piece we create honors both tradition and the environment.
              </p>
              <Link 
                href="#" 
                className="flex items-center gap-2 text-brand-light-gold text-sm hover:opacity-80 transition-opacity"
              >
                READ MORE
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>

          {/* Blog Card 6 */}
          <article className="flex flex-col">
            <div className="w-full h-[300px] rounded-[20px] overflow-hidden mb-4">
              <Image
                src="/assets/b3eff3cd52f1bca165b07cca1db60a29.png"
                alt="Behind the Scenes"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <p className="text-brand-grey-green text-sm mb-2">December 18, 2024</p>
              <h3 className="text-brand-gold text-h4 mb-3">Behind the Scenes</h3>
              <p className="text-brand-green text-body mb-4 flex-1">
                Take a journey into our workshop and meet the talented artisans who bring our designs to life with passion, precision, and dedication.
              </p>
              <Link 
                href="#" 
                className="flex items-center gap-2 text-brand-light-gold text-sm hover:opacity-80 transition-opacity"
              >
                READ MORE
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
