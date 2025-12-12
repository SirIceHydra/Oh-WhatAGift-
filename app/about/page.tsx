import Header from '@/components/layout/header';
import HeaderSecondary from '@/components/layout/header-secondary';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-brand-cream">
      {/* Show HeaderSecondary on mobile, Header on desktop */}
      <div className="md:hidden">
        <HeaderSecondary />
      </div>
      <div className="hidden md:block">
        <Header />
      </div>
      
      {/* How We Came To Be Section */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
        <h2 className="text-brand-gold mb-6 sm:mb-8 text-center text-2xl sm:text-3xl md:text-[38.4px]">
          HOW WE CAME TO BE
        </h2>
        
        {/* Image */}
        <div className="w-full sm:w-4/5 mx-auto mb-6 sm:mb-8">
          <Image
            src="/assets/about.png"
            alt="About us"
            width={960}
            height={640}
            className="w-full h-auto object-cover rounded-[20px]"
            priority
          />
        </div>
        
        {/* Quote */}
        <div className="mb-6 sm:mb-8 text-center px-2 sm:px-4">
          <blockquote className="text-brand-gold text-xl sm:text-2xl md:text-3xl lg:text-[44px] italic leading-relaxed">
            "I've been embroidering since childhood, long before I knew it would shape my life."
          </blockquote>
        </div>
        
        {/* Text Content */}
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-4">
          <p className="text-brand-green text-base sm:text-lg md:text-xl lg:text-[29.6px] leading-relaxed">
            I come from a lineage of women who were devoted seamstresses and embroiderers. Their artistry became my inheritance, guiding my hands and my imagination.
          </p>
          
          <p className="text-brand-green text-base sm:text-lg md:text-xl lg:text-[29.6px] leading-relaxed">
            Every stitch I create carries a piece of my story and the legacy they passed down. What began as a simple joy became my way of expressing meaning and beauty.
          </p>
          
          <p className="text-brand-green text-base sm:text-lg md:text-xl lg:text-[29.6px] leading-relaxed">
            Today, that heritage inspires a brand devoted to crafting luxurious, intentional gifts to be treasured.
          </p>
        </div>
      </div>
      
      {/* Our Values Section */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
        <h2 className="text-brand-gold mb-6 sm:mb-8 md:mb-12 text-center text-2xl sm:text-3xl md:text-[38.4px]">
          OUR VALUES
        </h2>
        
        {/* Four Quadrant Layout */}
        <div className="relative max-w-4xl mx-auto aspect-square">
          {/* Divider SVG - centered and scaled down on mobile */}
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <Image
              src="/decorative/values-divider.svg"
              alt="Values divider"
              width={658}
              height={658}
              className="w-[50%] h-[50%] sm:w-[60%] sm:h-[60%] md:w-[70%] md:h-[70%] lg:w-full lg:h-full object-contain"
            />
          </div>
          
          {/* Grid for quadrants */}
          <div className="grid grid-cols-2 grid-rows-2 h-full w-full relative z-10">
            {/* Top-Left: BEAUTY */}
            <div className="flex flex-col justify-center items-center p-3 sm:p-4 md:p-6 lg:p-8 text-center">
              <h3 className="text-brand-gold text-lg sm:text-xl md:text-2xl lg:text-[38.4px] mb-2 sm:mb-3 md:mb-4 font-sans leading-tight">BEAUTY</h3>
              <p className="text-brand-green text-xs sm:text-sm md:text-base lg:text-[29.6px] leading-relaxed px-2 sm:px-4">Artistry that transforms the everyday into the extraordinary.</p>
            </div>
            
            {/* Top-Right: EXCLUSIVITY */}
            <div className="flex flex-col justify-center items-center p-3 sm:p-4 md:p-6 lg:p-8 text-center">
              <h3 className="text-brand-gold text-lg sm:text-xl md:text-2xl lg:text-[38.4px] mb-2 sm:mb-3 md:mb-4 font-sans leading-tight">EXCLUSIVITY</h3>
              <p className="text-brand-green text-xs sm:text-sm md:text-base lg:text-[29.6px] leading-relaxed px-2 sm:px-4">Pieces made in thoughtful rarity, yours and yours alone.</p>
            </div>
            
            {/* Bottom-Left: MEANING */}
            <div className="flex flex-col justify-center items-center p-3 sm:p-4 md:p-6 lg:p-8 text-center">
              <h3 className="text-brand-gold text-lg sm:text-xl md:text-2xl lg:text-[38.4px] mb-2 sm:mb-3 md:mb-4 font-sans leading-tight">MEANING</h3>
              <p className="text-brand-green text-xs sm:text-sm md:text-base lg:text-[29.6px] leading-relaxed px-2 sm:px-4">Creations that hold emotion, intention, and story.</p>
            </div>
            
            {/* Bottom-Right: COMMUNITY */}
            <div className="flex flex-col justify-center items-center p-3 sm:p-4 md:p-6 lg:p-8 text-center">
              <h3 className="text-brand-gold text-lg sm:text-xl md:text-2xl lg:text-[38.4px] mb-2 sm:mb-3 md:mb-4 font-sans leading-tight">COMMUNITY</h3>
              <p className="text-brand-green text-xs sm:text-sm md:text-base lg:text-[29.6px] leading-relaxed px-2 sm:px-4">A heritage of craft woven through shared hands and hearts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
