import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import ButtonWithIcon from '../components/ButtonWithIcon'

// Image imports
// Hero image - Two-Tone Towels
const imgProductImage = '/Home%20page%20images/Two-Tone_Towels-Oasis_Green2__99305.jpg'
// Custom Embroidery section images
const imgProductImage1 = '/Home%20page%20images/Orange.jpeg'
const imgProductImage2 = '/Home%20page%20images/Arabic.jpeg'
// Gift Categories section images
const imgProductImage3 = '/Home%20page%20images/Corporate%20gifts.webp'
const imgProductImage4 = '/Home%20page%20images/Trending_HandWovenBath_ShowerMat.webp'
// Seasonal Highlights images
const imgProductsImage = '/Home%20page%20images/WhatsApp%20Image%202025-11-04%20at%2007.52.29.jpeg'
const imgProductsImage1 = '/Home%20page%20images/WhatsApp%20Image%202025-11-04%20at%2007.52.29%20(1).jpeg'
const imgProductsImage2 = '/Home%20page%20images/WhatsApp%20Image%202025-11-04%20at%2007.52.29%20(2).jpeg'
// Best Sellers images
const imgProductImage6 = '/Home%20page%20images/do-everything-with-love-embroidered-kitchen-towels.jpg'
const imgProductImage7 = '/Home%20page%20images/71l1+QkOOcL.jpg'
const imgProductImage8 = '/Home%20page%20images/WhatsApp%20Image%202025-11-04%20at%2007.52.30%20(1).jpeg'
const imgProductImage9 = '/Home%20page%20images/b68ff580-e451-4a77-b08b-90b696b91881.d5c87f295caa9005b873cad20e2f9fec.webp'
const imgProductImage10 = '/Home%20page%20images/Onion.jpeg'

const Home = () => {
  // State for mobile image toggle in Custom Embroidery section
  const [showFrontImage, setShowFrontImage] = useState(true)

  return (
    <div className="bg-brand-main-90 relative min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20 bg-brand-main-90 w-full">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Main Product Image with Rotated Text */}
          <div className="relative flex justify-center mb-4 sm:mb-6">
            <div className="relative w-full max-w-[280px] sm:max-w-[350px] md:max-w-[448px] aspect-[448/666]">
              {/* Product Image */}
              <div className="relative w-full h-full rounded-t-[200px] sm:rounded-t-[250px] md:rounded-t-[312px] overflow-hidden">
                <img 
                  src={imgProductImage} 
                  alt="Personalized gift showcase" 
                  className="w-full h-full object-cover object-center"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0)] from-[46.108%] to-brand-main-90 rounded-t-[200px] sm:rounded-t-[250px] md:rounded-t-[312px]" />
              </div>

              {/* Rotated "PERSONALIZED" Text - Overlaying inside the image - Hidden on mobile */}
              <div className="hidden md:block absolute left-[96px] top-[-40px]" style={{ width: '255px', height: '63px', zIndex: 10 }}>
                <div className="relative w-full h-full">
                  {/* PERSONALIZED text with similar rotation pattern */}
                  {[
                    { letter: 'P', x: 0, y: 34.68, rotation: -28.252 },
                    { letter: 'E', x: 24.46, y: 22.10, rotation: -22.383 },
                    { letter: 'R', x: 46.84, y: 13.24, rotation: -16.502 },
                    { letter: 'S', x: 73.45, y: 5.84, rotation: -10.332 },
                    { letter: 'O', x: 99.45, y: 1.55, rotation: -4.449 },
                    { letter: 'N', x: 124.55, y: 0, rotation: 1.29 },
                    { letter: 'A', x: 149.63, y: 0.98, rotation: 6.888 },
                    { letter: 'L', x: 173.24, y: 4.22, rotation: 12.198 },
                    { letter: 'I', x: 195.29, y: 9.35, rotation: 17.363 },
                    { letter: 'Z', x: 216.85, y: 16.44, rotation: 22.67 },
                    { letter: 'E', x: 238.88, y: 26.01, rotation: 28.407 },
                    { letter: 'D', x: 260, y: 35, rotation: 33 },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="absolute font-karla font-normal text-brand-main-30 text-2xl leading-normal whitespace-nowrap pointer-events-none"
                      style={{
                        left: `${item.x}px`,
                        top: `${item.y}px`,
                        transform: `rotate(${item.rotation}deg)`,
                        transformOrigin: 'center center',
                      }}
                    >
                      {item.letter}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Heading - Positioned higher into the image */}
          <div className="text-center -mt-16 sm:-mt-20 md:-mt-32 mb-4 sm:mb-6 relative z-10 px-2">
            <h1 className="font-playfair font-black text-brand-main-20 text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-tight sm:leading-none">
              ~Thoughtful gifts that speak from the heart
            </h1>
          </div>

          {/* Descriptive Text - Two columns positioned below heading */}
          <div className="flex flex-col sm:flex-row justify-between max-w-6xl mx-auto -mt-2 sm:-mt-4 gap-4 sm:gap-0 px-2">
            <div className="font-karla font-normal text-brand-main-30 text-base sm:text-lg md:text-xl lg:text-2xl leading-normal text-center sm:text-left">
              <p className="mb-0">Custom embroidered treasures</p>
              <p>handcrafted with love</p>
            </div>
            <div className="font-karla font-normal text-brand-main-30 text-base sm:text-lg md:text-xl lg:text-2xl leading-normal text-center sm:text-right">
              <p className="mb-0">to make every moment</p>
              <p>unforgettable</p>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Embroidery Section */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-brand-accent-green w-full">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
              <p className="font-karla font-normal text-brand-main-20 text-lg sm:text-xl md:text-2xl">
                Custom Embroidery
              </p>
              <h2 className="font-playfair font-black text-brand-main-20 text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-tight sm:leading-none">
                ~Make it personal
              </h2>
              <p className="font-karla font-normal text-brand-main-20 text-sm sm:text-base md:text-lg leading-[1.5] max-w-[598px]">
                Transform ordinary items into extraordinary gifts with our custom embroidery services. From monogrammed towels to personalized blankets, add a special touch that shows you care. Each piece is carefully crafted to perfection.
              </p>
              <div className="pt-2">
                <ButtonWithIcon text="Shop Embroidery" />
              </div>
            </div>

            {/* Right Images */}
            <div className="relative order-1 lg:order-2">
              {/* Mobile: Single image with toggle button */}
              <div className="md:hidden relative w-full h-[400px] sm:h-[500px]">
                <div className="relative w-full h-full">
                  <img 
                    src={showFrontImage ? imgProductImage1 : imgProductImage2} 
                    alt={showFrontImage ? "Custom embroidered gifts - front" : "Custom embroidered gifts - back"} 
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                  {/* Toggle button - only visible on mobile */}
                  <button
                    onClick={() => setShowFrontImage(!showFrontImage)}
                    className="absolute bottom-4 right-4 bg-brand-main-90/90 hover:bg-brand-main-90 text-brand-main-20 px-4 py-2 rounded-lg font-karla text-sm font-medium transition-colors duration-200 flex items-center gap-2 shadow-lg"
                    aria-label={showFrontImage ? "Show back view" : "Show front view"}
                  >
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" 
                      />
                    </svg>
                    {showFrontImage ? 'View Back' : 'View Front'}
                  </button>
                </div>
              </div>
              
              {/* Desktop: Overlay images (unchanged) */}
              <div className="hidden md:block relative w-full h-[600px] lg:h-[896px]">
                <img 
                  src={imgProductImage2} 
                  alt="Custom embroidered gifts" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bg-brand-main-90 w-[300px] md:w-[396px] h-[400px] md:h-[518px] left-[129px] top-[150px] md:top-[188px]" />
                <div className="absolute w-[200px] md:w-[312px] h-[300px] md:h-[408px] left-1/2 top-[200px] md:top-[244px] -translate-x-1/2">
                  <img 
                    src={imgProductImage1} 
                    alt="Embroidered product detail" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Categories Section */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-brand-main-90 w-full">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="font-playfair font-black text-brand-main-20 text-3xl sm:text-4xl md:text-5xl lg:text-[64px] text-center mb-8 sm:mb-12 md:mb-16">
            Gift Categories
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            {/* Left Image */}
            <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[661px] rounded-t-[150px] sm:rounded-t-[200px] md:rounded-t-[250px] lg:rounded-t-[312px] overflow-hidden order-1">
              <img 
                src={imgProductImage3} 
                alt="Corporate gifts" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Center - Categories List */}
            <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10 lg:gap-14 order-2">
              {/* Category List */}
              <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10 lg:gap-14 font-playfair font-normal text-brand-main-20 text-xl sm:text-2xl md:text-3xl lg:text-[32px] tracking-brand-medium uppercase">
                <p>Home & Living</p>
                <p>Apparel</p>
                <p>Accessories</p>
                <p>Gift Sets</p>
                <p>Corporate Gifts</p>
              </div>

              <ButtonWithIcon text="View all" className="mt-4 sm:mt-6 md:mt-8" />
            </div>

            {/* Right Image */}
            <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[661px] rounded-t-[150px] sm:rounded-t-[200px] md:rounded-t-[250px] lg:rounded-t-[312px] overflow-hidden order-3">
              <img 
                src={imgProductImage4} 
                alt="Trending gifts" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Occasions Section - Full Width Banner */}
      <section className="relative w-full bg-brand-accent-green">
        <div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[900px] xl:h-[1000px] overflow-hidden">
          <video 
            src="/Home%20page%20images/Towel%20Video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
          
          {/* Text container with backdrop blur and semi-transparent background */}
          <div className="absolute left-4 sm:left-6 md:left-[calc(8.333%+35px)] top-8 sm:top-12 md:top-16 lg:top-[136px] right-4 sm:right-6 md:right-auto">
            <div className="backdrop-blur-sm bg-white/10 rounded-lg p-6 sm:p-8 md:p-10 border border-white/20">
              <h2 className="font-playfair font-black text-brand-main-20 drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)] text-2xl sm:text-3xl md:text-4xl lg:text-[64px] leading-tight sm:leading-none mb-4 sm:mb-6 md:mb-8">
                <p>Perfect for</p>
                <p>Every Occasion</p>
              </h2>
              <ButtonWithIcon text="Shop by occasion" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-brand-main-90 w-full">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="font-playfair font-black text-brand-main-20 text-3xl sm:text-4xl md:text-5xl lg:text-[64px] mb-8 sm:mb-10 md:mb-12">
            ~Featured Items
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 items-start">
            {/* Left Side Product */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[464px]">
                <img 
                  src={imgProductsImage1} 
                  alt="Off-white Dreamy" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3">
                <div>
                  <p className="font-karla font-bold text-brand-main-20 text-base sm:text-lg mb-1 sm:mb-2">
                    Custom Embroidered Towels
                  </p>
                  <p className="font-karla font-normal text-brand-main-30 text-sm sm:text-base">
                    R 320
                  </p>
                </div>
                <ButtonWithIcon text="Add to Cart" />
              </div>
            </div>

            {/* Center Image */}
            <div className="relative lg:col-start-2 flex justify-center order-2 lg:order-none">
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                <div className="relative w-full max-w-[280px] sm:max-w-[350px] md:max-w-[414px] aspect-[414/620]">
                  <div className="w-full h-full rounded-t-[200px] sm:rounded-t-[250px] md:rounded-t-[312px] overflow-hidden">
                    <img 
                      src={imgProductsImage} 
                      alt="Featured item" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-karla font-bold text-brand-main-20 text-base sm:text-lg mb-1 sm:mb-2">
                      Embroidered Collection
                    </p>
                    <p className="font-karla font-normal text-brand-main-30 text-sm sm:text-base">
                      R 3,200
                    </p>
                  </div>
                  <ButtonWithIcon text="Add to Cart" />
                </div>
              </div>
            </div>

            {/* Right Side Product */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[464px]">
                <img 
                  src={imgProductsImage2} 
                  alt="Off-white classics" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3">
                <div>
                  <p className="font-karla font-bold text-brand-main-20 text-base sm:text-lg mb-1 sm:mb-2">
                    Personalized Gift Set
                  </p>
                  <p className="font-karla font-normal text-brand-main-30 text-sm sm:text-base">
                    R 450
                  </p>
                </div>
                <ButtonWithIcon text="Add to Cart" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-brand-accent-green w-full">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-8 sm:mb-10 md:mb-12 gap-4">
            <h2 className="font-playfair font-black text-brand-main-20 text-3xl sm:text-4xl md:text-5xl lg:text-[64px]">
              ~Best Sellers
            </h2>
            <ButtonWithIcon text="View ALL" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 lg:gap-16">
            <div className="flex flex-col">
              <ProductCard 
                image={imgProductImage6}
                title="Do Everything With Love Towel"
                price="R 320"
                className="items-end"
              />
              <div className="mt-4">
                <ButtonWithIcon text="Add to Cart" />
              </div>
            </div>
            <div className="flex flex-col">
              <ProductCard 
                image={imgProductImage7}
                title="Be Our Guest Towels"
                price="R 350"
                className="items-start"
              />
              <div className="mt-4">
                <ButtonWithIcon text="Add to Cart" />
              </div>
            </div>
            <div className="flex flex-col">
              <ProductCard 
                image={imgProductImage8}
                title="Monogrammed Bath Towel"
                price="R 380"
                className="items-end"
              />
              <div className="mt-4">
                <ButtonWithIcon text="Add to Cart" />
              </div>
            </div>
            <div className="flex flex-col">
              <ProductCard 
                image={imgProductImage9}
                title="Embroidered Decorative Towels"
                price="R 340"
                className="items-start"
              />
              <div className="mt-4">
                <ButtonWithIcon text="Add to Cart" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-brand-main-90 w-full">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
              {/* Left Image */}
              <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[466px] rounded-t-[150px] sm:rounded-t-[180px] md:rounded-t-[200px] overflow-hidden">
                <img 
                  src={imgProductImage10} 
                  alt="Gift ideas" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Content */}
              <div className="space-y-6 sm:space-y-8">
                <h2 className="font-playfair font-black text-brand-main-20 text-3xl sm:text-4xl md:text-5xl lg:text-[64px]">
                  NEWSLETTER
                </h2>
                <p className="font-karla font-normal text-brand-main-20 text-base sm:text-lg md:text-xl lg:text-2xl leading-[1.5] text-center lg:text-left">
                  SUBSCRIBE TO GET GIFT IDEAS AND EXCLUSIVE OFFERS
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <input
                    type="email"
                    placeholder="Email"
                    className="border-b border-brand-main-50 border-solid h-12 sm:h-14 px-4 sm:px-6 py-3 sm:py-4 font-karla font-normal text-brand-main-50 text-sm sm:text-base md:text-lg uppercase flex-1 focus:outline-none focus:border-brand-main-30"
                  />
                  <ButtonWithIcon text="SUBSCRIBE" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
