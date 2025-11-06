const About = () => {
  return (
    <div className="py-12 sm:py-16 md:py-20 bg-brand-main-90">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-black text-brand-main-20 mb-6 sm:mb-8 text-center">
            Our Story
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-base sm:text-lg md:text-xl font-karla font-normal text-brand-main-30 mb-4 sm:mb-6">
              At Oh! What a Gift!, we believe that the best gifts are the ones that tell a story. 
              Founded with a passion for creating meaningful connections, we specialize in custom 
              embroidered gifts and personalized presents that turn ordinary moments into extraordinary memories.
            </p>
            
            <p className="text-base sm:text-lg md:text-xl font-karla font-normal text-brand-main-30 mb-4 sm:mb-6">
              Every stitch, every monogram, and every personalized detail is crafted with care and 
              attention to ensure your gift is as unique as the person receiving it. Whether it's 
              a birthday, anniversary, wedding, or just because, we help you show you care with 
              thoughtfully designed gifts that speak from the heart.
            </p>
            
            <div className="bg-[#fefaf5] rounded-xl p-6 sm:p-8 my-6 sm:my-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-black text-brand-main-20 mb-3 sm:mb-4">What Makes Us Special</h2>
              <ul className="space-y-2 sm:space-y-3 font-karla font-normal text-brand-main-30 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-brand-accent-gold mr-2 text-lg sm:text-xl flex-shrink-0">✓</span>
                  <span>Handcrafted custom embroidery with precision and artistry</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-accent-gold mr-2 text-lg sm:text-xl flex-shrink-0">✓</span>
                  <span>Wide selection of gifts for every occasion and personality</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-accent-gold mr-2 text-lg sm:text-xl flex-shrink-0">✓</span>
                  <span>Personalized gift wrapping and messaging options</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-accent-gold mr-2 text-lg sm:text-xl flex-shrink-0">✓</span>
                  <span>Quality materials and craftsmanship that lasts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-accent-gold mr-2 text-lg sm:text-xl flex-shrink-0">✓</span>
                  <span>Worldwide shipping to spread joy everywhere</span>
                </li>
              </ul>
            </div>

            <p className="text-base sm:text-lg md:text-xl font-karla font-normal text-brand-main-30 mb-4 sm:mb-6">
              Our mission is simple: to help you find and create the perfect gift that brings 
              smiles, creates memories, and shows your loved ones just how much they mean to you. 
              Because when it comes to gifting, it's not just about the present—it's about the 
              thought, the love, and the moment of connection it creates.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
