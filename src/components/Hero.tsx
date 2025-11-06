const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Welcome to Your Brand
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Building amazing experiences with modern web technologies
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-secondary">
              Learn More
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors duration-200 border-2 border-white/50">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

