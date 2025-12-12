import { Instagram, Facebook, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function SocialBar() {
  return (
    <div className="bg-brand-light-green relative z-20">
      <div className="container mx-auto px-4 py-2 sm:py-3">
        <div className="relative flex items-center justify-center w-full">
          {/* Social media icons - positioned absolutely on the left */}
          <div className="absolute left-0 flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <Link href="#" className="text-brand-green relative z-10">
              <Instagram size={18} className="sm:w-5 sm:h-5" />
            </Link>
            <Link href="#" className="text-brand-green relative z-10">
              <Facebook size={18} className="sm:w-5 sm:h-5" />
            </Link>
            <Link href="#" className="text-brand-green relative z-10">
              <Linkedin size={18} className="sm:w-5 sm:h-5" />
            </Link>
          </div>
          
          {/* Shipping text - centered */}
          <p className="text-brand-green text-center relative z-10 text-xs sm:text-sm md:text-base px-2">
            FREE DOMESTIC SHIPPING ON ORDERS OVER R1500
          </p>
        </div>
      </div>
    </div>
  );
}
