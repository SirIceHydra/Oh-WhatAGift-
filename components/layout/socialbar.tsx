import { Instagram, Facebook, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function SocialBar() {
  return (
    <div className="bg-brand-light-green">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between w-full">
          {/* Social media icons */}
          <div className="flex items-center gap-4 pl-10">
            <Link href="#" className="text-brand-green">
              <Instagram size={20} />
            </Link>
            <Link href="#" className="text-brand-green">
              <Facebook size={20} />
            </Link>
            <Link href="#" className="text-brand-green">
              <Linkedin size={20} />
            </Link>
          </div>
          
          {/* Shipping text */}
          <p className="text-brand-green text-center flex-1">
            FREE DOMESTIC SHIPPING ON ORDERS OVER R1500
          </p>
        </div>
      </div>
    </div>
  );
}
