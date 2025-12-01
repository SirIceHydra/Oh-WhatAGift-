import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-brand-cream border-t border-brand-green mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-0 mb-8 items-center justify-between">
          {/* Logo Section */}
          <div>
            <Image
              src="/logos/logo_round.svg"
              alt="Oh! What a Gift! Logo"
              width={300}
              height={300}
              className="w-full max-w-[300px] h-auto"
            />
          </div>

          {/* Navigation Columns Group */}
          <div className="flex flex-row gap-4 pr-8">
            {/* Shop Column */}
            <div>
              <h5 className="text-brand-green mb-4 uppercase text-body font-bold font-cocogothic">Shop</h5>
              <ul className="space-y-1">
                <li>
                  <Link href="#" className="text-brand-grey-green hover:text-brand-green text-sm font-cocogothic">
                    All Gifts
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-brand-grey-green hover:text-brand-green text-sm font-cocogothic">
                    Custom Embroidery
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-brand-grey-green hover:text-brand-green text-sm font-cocogothic">
                    Gift Sets
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-brand-grey-green hover:text-brand-green text-sm font-cocogothic">
                    Shop by Occasion
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help Column */}
            <div>
              <h5 className="text-brand-green mb-4 uppercase text-body font-bold font-cocogothic">Help</h5>
              <ul className="space-y-1">
                <li>
                  <Link href="/policies/shipping" className="text-brand-grey-green hover:text-brand-green text-sm font-cocogothic">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="/policies/returns" className="text-brand-grey-green hover:text-brand-green text-sm font-cocogothic">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-brand-grey-green hover:text-brand-green text-sm font-cocogothic">
                    Personalization Guide
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-brand-grey-green hover:text-brand-green text-sm font-cocogothic">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h5 className="text-brand-green mb-4 uppercase text-body font-bold font-cocogothic">Legal</h5>
              <ul className="space-y-1">
                <li>
                  <Link href="/policies/privacy" className="text-brand-grey-green hover:text-brand-green text-sm font-cocogothic">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/policies/terms" className="text-brand-grey-green hover:text-brand-green text-sm font-cocogothic">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/policies/cookies" className="text-brand-grey-green hover:text-brand-green text-sm font-cocogothic">
                    Cookies Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* About Column */}
            <div>
              <h5 className="text-brand-green mb-4 uppercase text-body font-bold font-cocogothic">About</h5>
              <ul className="space-y-1">
                <li>
                  <Link href="/about" className="text-brand-grey-green hover:text-brand-green text-sm font-cocogothic">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-brand-grey-green hover:text-brand-green text-sm font-cocogothic">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-brand-grey-green hover:text-brand-green text-sm font-cocogothic">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-brand-grey-green hover:text-brand-green text-sm font-cocogothic">
                    Facebook
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-brand-green pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-brand-grey-green">
            <p className="text-sm">
              © 2025 Oh! What a Gift! All rights reserved.
            </p>
            <p className="text-body font-cocogothic text-center">
               Designed and Developed by Kaizen Technology
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}