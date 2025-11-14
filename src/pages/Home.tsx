import { useEffect, useState } from 'react'
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
// Custom personalised section product images
const imgCustomProduct1 = '/Home%20page%20images/do-everything-with-love-embroidered-kitchen-towels.jpg'
const imgCustomProduct2 = '/Home%20page%20images/be-our-guest-towels.jpg'
const imgCustomProduct3 = '/Home%20page%20images/WhatsApp%20Image%202025-11-04%20at%2007.52.30%20(1).jpeg'
// Tea Towel sections images
const imgTeaTowel1 = '/drive/20251109_114801.jpg'
const imgTeaTowel2 = '/drive/20251109_114834.jpg'
const imgTeaTowel3 = '/drive/20251109_115027.jpg'
const imgProductImage10 = '/Home%20page%20images/Onion.jpeg'

const Home = () => {
  // Carousel images for each section
  const carousel1Images = [imgProductImage1, imgProductImage2, imgProductImage10]
  const carousel2Images = [imgProductsImage, imgProductsImage1, imgProductsImage2]
  const carousel3Images = [imgTeaTowel1, imgTeaTowel2, imgTeaTowel3]

  // Carousel state
  const [carousel1Index, setCarousel1Index] = useState(0)
  const [carousel2Index, setCarousel2Index] = useState(0)
  const [carousel3Index, setCarousel3Index] = useState(0)

  // Auto-advance for carousel 1
  useEffect(() => {
    const interval = setInterval(() => {
      setCarousel1Index((prev) => (prev + 1) % carousel1Images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [carousel1Images.length])

  // Auto-advance for carousel 2
  useEffect(() => {
    const interval = setInterval(() => {
      setCarousel2Index((prev) => (prev + 1) % carousel2Images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [carousel2Images.length])

  // Auto-advance for carousel 3
  useEffect(() => {
    const interval = setInterval(() => {
      setCarousel3Index((prev) => (prev + 1) % carousel3Images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [carousel3Images.length])

  return (
    <div className="bg-brand-main-90 relative min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20 bg-brand-main-90 w-full">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
              {/* Main Heading */}
              <div className="relative z-10">
                <h1 className="font-playfair font-black text-brand-main-20 text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-tight sm:leading-none">
                  ~Thoughtful gifts that speak from the heart
                </h1>
              </div>

              {/* Descriptive Text */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-4 sm:gap-6">
                <div className="font-karla font-normal text-brand-main-30 text-base sm:text-lg md:text-xl lg:text-2xl leading-normal">
                  <p className="mb-0">Custom embroidered treasures</p>
                  <p>handcrafted with love</p>
                </div>
                <div className="font-karla font-normal text-brand-main-30 text-base sm:text-lg md:text-xl lg:text-2xl leading-normal">
                  <p className="mb-0">to make every moment</p>
                  <p>unforgettable</p>
                </div>
              </div>
            </div>

            {/* Right Side - Main Product Image with Rotated Text */}
            <div className="relative flex justify-center lg:justify-center order-1 lg:order-2">
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
                        className="absolute font-karla font-normal text-brand-main-30 text-base sm:text-lg md:text-2xl leading-normal whitespace-nowrap pointer-events-none"
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
          </div>
        </div>
      </section>

      {/* Shop Customer Favourites Section */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-[#fefaf5] w-full">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="font-playfair font-black text-brand-main-20 text-3xl sm:text-4xl md:text-5xl lg:text-[64px] mb-8 sm:mb-10 md:mb-12">
            ~Shop Customer Favourites
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            <ProductCard 
              image={imgProductsImage1}
              title="Custom Embroidered Towels"
              price="R 320"
              buttonVariant="beige-bg"
              className="h-full"
            />
            <ProductCard 
              image={imgProductsImage}
              title="Embroidered Collection"
              price="R 3,200"
              buttonVariant="beige-bg"
              className="h-full"
            />
            <ProductCard 
              image={imgProductsImage2}
              title="Personalized Gift Set"
              price="R 450"
              buttonVariant="beige-bg"
              className="h-full"
            />
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

      {/* Section 1: Custom Personalised Towels & Goods */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-[#fefaf5] w-full">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="mb-8 sm:mb-12 md:mb-16">
            <h2 className="font-playfair font-black text-brand-main-20 text-3xl sm:text-4xl md:text-5xl lg:text-[64px] mb-4 sm:mb-6">
              Custom Personalised Towels & Goods
            </h2>
            <p className="font-karla font-normal text-brand-main-20 text-base sm:text-lg md:text-xl leading-[1.5] max-w-4xl">
              Create something truly yours. Choose from our premium towels and linens, and add your own personal touch — from names and initials to bespoke designs. Perfect for thoughtful gifts, weddings, or simply treating yourself to something unique.
            </p>
          </div>

          {/* Image Carousel */}
          <div className="relative mb-12 sm:mb-16 md:mb-20">
            <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-lg">
              <img 
                src={carousel1Images[carousel1Index]} 
                alt="Custom personalised towels" 
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            <ProductCard 
              image={imgCustomProduct1}
              title="Custom Embroidered Towel"
              price="R 320"
              buttonVariant="beige-bg"
              className="h-full"
            />
            <ProductCard 
              image={imgCustomProduct2}
              title="Personalised Bath Towel"
              price="R 350"
              buttonVariant="beige-bg"
              className="h-full"
            />
            <ProductCard 
              image={imgCustomProduct3}
              title="Monogrammed Towel Set"
              price="R 380"
              buttonVariant="beige-bg"
              className="h-full"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Embroidered Luxury Towel Ranges */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-brand-main-90 w-full">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="mb-8 sm:mb-12 md:mb-16">
            <h2 className="font-playfair font-black text-brand-main-20 text-3xl sm:text-4xl md:text-5xl lg:text-[64px] mb-4 sm:mb-6">
              Embroidered Luxury Towel Ranges
            </h2>
            <p className="font-karla font-normal text-brand-main-20 text-base sm:text-lg md:text-xl leading-[1.5] max-w-4xl">
              Our embroidered luxury towel collection is designed in-house, and combines softness, quality, and artistry. Each piece is beautifully stitched with timeless designs, bringing a touch of elegance and charm to your bathroom or gifting occasion.
              <span className="block mt-2">These can also be personalised with a short name or message for an extra-special touch.</span>
            </p>
          </div>

          {/* Image Carousel */}
          <div className="relative mb-12 sm:mb-16 md:mb-20">
            <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-lg">
              <img 
                src={carousel2Images[carousel2Index]} 
                alt="Embroidered luxury towels" 
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            <ProductCard 
              image={imgProductsImage}
              title="Luxury Embroidered Towel"
              price="R 420"
              className="h-full"
            />
            <ProductCard 
              image={imgProductsImage1}
              title="Designer Towel Collection"
              price="R 450"
              className="h-full"
            />
            <ProductCard 
              image={imgProductsImage2}
              title="Elegant Embroidered Set"
              price="R 480"
              className="h-full"
            />
          </div>
        </div>
      </section>

      {/* Section 3: Embroidered Luxury Tea Towel Ranges */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-[#fefaf5] w-full">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="mb-8 sm:mb-12 md:mb-16">
            <h2 className="font-playfair font-black text-brand-main-20 text-3xl sm:text-4xl md:text-5xl lg:text-[64px] mb-4 sm:mb-6">
              Embroidered Luxury Tea Towel Ranges
            </h2>
            <p className="font-karla font-normal text-brand-main-20 text-base sm:text-lg md:text-xl leading-[1.5] max-w-4xl">
              Add a little beauty to everyday moments. Our embroidered tea towels are crafted from high-quality fabrics and detailed with vibrant designs — perfect for your kitchen, gifting, or as stylish décor accents.
              <span className="block mt-2">Personalise yours with a short name or message to make it truly one of a kind.</span>
            </p>
          </div>

          {/* Image Carousel */}
          <div className="relative mb-12 sm:mb-16 md:mb-20">
            <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-lg">
              <img 
                src={carousel3Images[carousel3Index]} 
                alt="Embroidered tea towels" 
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            <ProductCard 
              image={imgTeaTowel1}
              title="Embroidered Tea Towel"
              price="R 180"
              buttonVariant="beige-bg"
              className="h-full"
            />
            <ProductCard 
              image={imgTeaTowel2}
              title="Designer Tea Towel Set"
              price="R 220"
              buttonVariant="beige-bg"
              className="h-full"
            />
            <ProductCard 
              image={imgTeaTowel3}
              title="Luxury Kitchen Towel"
              price="R 200"
              buttonVariant="beige-bg"
              className="h-full"
            />
          </div>
        </div>
      </section>

      {/* Occasions Section - Full Width Banner */}
      <section className="relative w-full bg-[#fefaf5]">
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
              <ButtonWithIcon text="Shop by occasion" variant="beige-bg" />
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
