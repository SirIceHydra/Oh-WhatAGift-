import { useState } from 'react'
import { Link } from 'react-router-dom'

const imgIconCart = '/assets/f09c1768c33d64c5e97ca3cde78957571dd01bfa.svg'
const logoImage = '/Oh!WhatAGiftLogo.svg'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="bg-brand-main-90 sticky top-0 z-50 shadow-sm" data-name="Nav-Bar">
      <nav className="container mx-auto px-4 sm:px-6 md:px-10 py-4 sm:py-6 md:py-10">
        <div className="flex items-center justify-between relative">
          {/* Left Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-10 font-karla font-normal text-brand-main-20 text-sm xl:text-base">
            <Link to="/shop" className="hover:opacity-70 transition-opacity">
              Shop Gifts
            </Link>
            <Link to="/custom-embroidery" className="hover:opacity-70 transition-opacity">
              Custom Embroidery
            </Link>
            <Link to="/gift-sets" className="hover:opacity-70 transition-opacity">
              Gift Sets
            </Link>
            <Link to="/about" className="hover:opacity-70 transition-opacity">
              About
            </Link>
          </div>

          {/* Center Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link to="/" className="flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="Oh! What a Gift! Logo" 
                className="h-16 sm:h-20 md:h-24 lg:h-32 w-auto"
              />
            </Link>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 font-karla font-normal text-brand-main-20 text-base">
            {/* Search Bar */}
            <div className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="Search gifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-brand-main-30 rounded-lg px-3 py-2 pr-9 w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-brand-accent-gold focus:border-transparent font-karla text-xs lg:text-sm"
              />
              <svg
                className="absolute right-2 lg:right-3 w-4 h-4 lg:w-5 lg:h-5 text-brand-main-30 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button className="w-5 h-5 sm:w-6 sm:h-6 hover:opacity-70 transition-opacity relative flex-shrink-0" aria-label="Shopping cart">
              <img src={imgIconCart} alt="Cart" className="w-full h-full" />
              {/* Cart badge could go here */}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-brand-main-20 focus:outline-none ml-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-3">
            {/* Mobile Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search gifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-brand-main-30 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-brand-accent-gold focus:border-transparent font-karla text-sm"
              />
            </div>
            <Link
              to="/shop"
              className="block text-brand-main-20 hover:opacity-70 transition-opacity py-2 text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop Gifts
            </Link>
            <Link
              to="/custom-embroidery"
              className="block text-brand-main-20 hover:opacity-70 transition-opacity py-2 text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Custom Embroidery
            </Link>
            <Link
              to="/gift-sets"
              className="block text-brand-main-20 hover:opacity-70 transition-opacity py-2 text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Gift Sets
            </Link>
            <Link
              to="/about"
              className="block text-brand-main-20 hover:opacity-70 transition-opacity py-2 text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
