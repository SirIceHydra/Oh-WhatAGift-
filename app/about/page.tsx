import HeaderSecondary from '@/components/layout/header-secondary';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-brand-cream">
      <HeaderSecondary />
      
      {/* How We Came To Be Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-brand-gold mb-8 text-center text-[38.4px]">
          HOW WE CAME TO BE
        </h2>
        
        {/* Image */}
        <div className="w-4/5 mx-auto mb-8">
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
        <div className="mb-8 text-center">
          <blockquote className="text-brand-gold text-[44px] italic">
            "I've been embroidering since childhood, long before I knew it would shape my life."
          </blockquote>
        </div>
        
        {/* Text Content */}
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-brand-green text-[29.6px]">
            I come from a lineage of women who were devoted seamstresses and embroiderers. Their artistry became my inheritance, guiding my hands and my imagination.
          </p>
          
          <p className="text-brand-green text-[29.6px]">
            Every stitch I create carries a piece of my story and the legacy they passed down. What began as a simple joy became my way of expressing meaning and beauty.
          </p>
          
          <p className="text-brand-green text-[29.6px]">
            Today, that heritage inspires a brand devoted to crafting luxurious, intentional gifts to be treasured.
          </p>
        </div>
      </div>
      
      {/* Our Values Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-brand-gold mb-12 text-center text-[38.4px]">
          OUR VALUES
        </h2>
        
        {/* Four Quadrant Layout */}
        <div className="relative max-w-4xl mx-auto aspect-square">
          {/* Divider SVG - centered */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Image
              src="/decorative/values-divider.svg"
              alt="Values divider"
              width={658}
              height={658}
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Grid for quadrants */}
          <div className="grid grid-cols-2 grid-rows-2 h-full w-full relative z-0">
            {/* Top-Left: BEAUTY */}
            <div className="flex flex-col justify-center items-center p-8 text-center">
              <h3 className="text-brand-gold text-[38.4px] mb-4 font-sans">BEAUTY</h3>
              <p className="text-brand-green text-[29.6px]">Artistry that transforms the everyday into the extraordinary.</p>
            </div>
            
            {/* Top-Right: EXCLUSIVITY */}
            <div className="flex flex-col justify-center items-center p-8 text-center">
              <h3 className="text-brand-gold text-[38.4px] mb-4 font-sans">EXCLUSIVITY</h3>
              <p className="text-brand-green text-[29.6px]">Pieces made in thoughtful rarity, yours and yours alone.</p>
            </div>
            
            {/* Bottom-Left: MEANING */}
            <div className="flex flex-col justify-center items-center p-8 text-center">
              <h3 className="text-brand-gold text-[38.4px] mb-4 font-sans">MEANING</h3>
              <p className="text-brand-green text-[29.6px]">Creations that hold emotion, intention, and story.</p>
            </div>
            
            {/* Bottom-Right: COMMUNITY */}
            <div className="flex flex-col justify-center items-center p-8 text-center">
              <h3 className="text-brand-gold text-[38.4px] mb-4 font-sans">COMMUNITY</h3>
              <p className="text-brand-green text-[29.6px]">A heritage of craft woven through shared hands and hearts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
