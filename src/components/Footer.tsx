import { Link } from 'react-router-dom'

const logoImage = '/logos/logo_round.svg'

const Footer = () => {
  return (
    <footer className="bg-[#fefaf5] relative w-full" data-name="Footer">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10">
        {/* Top Section - Logo and Links */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="inline-block">
              <img 
                src={logoImage} 
                alt="Oh! What a Gift! Logo" 
                className="h-48 w-auto"
              />
            </Link>
          </div>

          {/* Footer Links Grid */}
          <div className="flex flex-wrap gap-8 md:gap-12 lg:gap-16">
            {/* Shop Column */}
            <div className="flex flex-col gap-3">
              <p className="font-karla font-bold text-brand-main-20 text-base mb-1">
                Shop
              </p>
              <div className="flex flex-col gap-2 font-karla font-normal text-brand-main-20 text-sm">
                <Link to="/shop" className="hover:opacity-70 transition-opacity">
                  All Gifts
                </Link>
                <Link to="/custom-embroidery" className="hover:opacity-70 transition-opacity">
                  Custom Embroidery
                </Link>
                <Link to="/gift-sets" className="hover:opacity-70 transition-opacity">
                  Gift Sets
                </Link>
                <Link to="/occasions" className="hover:opacity-70 transition-opacity">
                  Shop by Occasion
                </Link>
              </div>
            </div>

            {/* Help Column */}
            <div className="flex flex-col gap-3">
              <p className="font-karla font-bold text-brand-main-20 text-base mb-1">
                Help
              </p>
              <div className="flex flex-col gap-2 font-karla font-normal text-brand-main-20 text-sm">
                <Link to="/shipping" className="hover:opacity-70 transition-opacity">
                  Shipping Policy
                </Link>
                <Link to="/returns" className="hover:opacity-70 transition-opacity">
                  Returns
                </Link>
                <Link to="/personalization" className="hover:opacity-70 transition-opacity">
                  Personalization Guide
                </Link>
                <Link to="/faq" className="hover:opacity-70 transition-opacity">
                  FAQ
                </Link>
              </div>
            </div>

            {/* Legal Column */}
            <div className="flex flex-col gap-3">
              <p className="font-karla font-bold text-brand-main-20 text-base mb-1">
                Legal
              </p>
              <div className="flex flex-col gap-2 font-karla font-normal text-brand-main-20 text-sm">
                <Link to="/privacy" className="hover:opacity-70 transition-opacity">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:opacity-70 transition-opacity">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="hover:opacity-70 transition-opacity">
                  Cookies Policy
                </Link>
              </div>
            </div>

            {/* About Column */}
            <div className="flex flex-col gap-3">
              <p className="font-karla font-bold text-brand-main-20 text-base mb-1">
                About
              </p>
              <div className="flex flex-col gap-2 font-karla font-normal text-brand-main-20 text-sm">
                <Link to="/about" className="hover:opacity-70 transition-opacity">
                  Our Story
                </Link>
                <Link to="/contact" className="hover:opacity-70 transition-opacity">
                  Contact Us
                </Link>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                  Instagram
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-main-50/30 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 font-karla font-normal text-brand-main-30 text-sm">
            <p>&copy; {new Date().getFullYear()} Oh! What a Gift! All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:opacity-70 transition-opacity">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:opacity-70 transition-opacity">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:opacity-70 transition-opacity">
                Cookies Policy
              </Link>
            </div>
            <p>Website Design and Development by Kaizen Technology</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
