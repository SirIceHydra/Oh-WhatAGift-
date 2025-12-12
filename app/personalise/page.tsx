import Header from '@/components/layout/header';
import HeaderSecondary from '@/components/layout/header-secondary';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PersonalisePage() {
  return (
    <div className="w-full min-h-screen bg-brand-cream">
      {/* Show HeaderSecondary on mobile, Header on desktop */}
      <div className="md:hidden">
        <HeaderSecondary />
      </div>
      <div className="hidden md:block">
        <Header />
      </div>
      
      {/* Personalisation Options Section */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Column 1: Personalise a blank item */}
          <div className="flex flex-col">
            <div className="w-full h-[250px] sm:h-[300px] md:h-[400px] rounded-[20px] overflow-hidden mb-4 sm:mb-6">
              <Image
                src="/hardcode/products/product1.png"
                alt="Personalise a blank item"
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-brand-gold text-xl sm:text-2xl md:text-h4 mb-3 sm:mb-4">Personalise a blank item</h3>
            <p className="text-brand-grey-green text-sm sm:text-base md:text-body mb-4 sm:mb-6 flex-1">
              Choose from our range of towels, tea towels, tote bags, etc. Perfect for someone special!
            </p>
            <Link href="/custom" className="w-full">
              <Button className="w-full bg-white border-brand-green text-brand-green hover:bg-brand-light-green/20 text-xs sm:text-sm md:text-base py-3 sm:py-4 min-h-[48px] sm:min-h-[56px]">
                EXPLORE PERSONALISATION OPTIONS AVAILABLE
              </Button>
            </Link>
          </div>

          {/* Column 2: Corporate/Bulk Personalisations */}
          <div className="flex flex-col">
            <div className="w-full h-[250px] sm:h-[300px] md:h-[400px] rounded-[20px] overflow-hidden mb-4 sm:mb-6">
              <Image
                src="/assets/5f64c4ec3e8d607bfead46e64f4905f2.png"
                alt="Corporate/Bulk Personalisations"
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-brand-gold text-xl sm:text-2xl md:text-h4 mb-3 sm:mb-4">Corporate/Bulk Personalisations</h3>
            <p className="text-brand-grey-green text-sm sm:text-base md:text-body mb-4 sm:mb-6 flex-1">
              Perfect for company branding, corporate gifting, bridal parties, etc. Contact us for bulk
            </p>
            <Link href="/contact" className="w-full">
              <Button className="w-full bg-white border-brand-green text-brand-green hover:bg-brand-light-green/20 text-xs sm:text-sm md:text-base py-3 sm:py-4 min-h-[48px] sm:min-h-[56px]">
                CONTACT US FOR BULK/CORPORATE OPTIONS
              </Button>
            </Link>
          </div>

          {/* Column 3: Other Personalisations (Vision Section) */}
          <div className="flex flex-col">
            <div className="w-full h-[250px] sm:h-[300px] md:h-[400px] rounded-[20px] overflow-hidden mb-4 sm:mb-6">
              <Image
                src="/assets/width_600.jpeg"
                alt="Other Personalisations"
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-brand-gold text-xl sm:text-2xl md:text-h4 mb-3 sm:mb-4">Other Personalisations</h3>
            <p className="text-brand-grey-green text-sm sm:text-base md:text-body mb-4 sm:mb-6 flex-1 leading-relaxed">
              Have a vision in mind that isn't listed here? Be it a custom design, or a sentimental image - Let us help bring your vision to life.
            </p>
            <Link href="/contact" className="w-full">
              <Button className="w-full bg-white border-brand-green text-brand-green hover:bg-brand-light-green/20 text-xs sm:text-sm md:text-base py-3 sm:py-4 min-h-[48px] sm:min-h-[56px]">
                CONTACT US FOR CUSTOM PERSONALISATION
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
