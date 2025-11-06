import { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="py-12 sm:py-16 md:py-20 bg-brand-main-90">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-black text-brand-main-20 mb-6 sm:mb-8 text-center">
            Get in Touch
          </h1>
          
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium font-karla text-brand-main-20 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-brand-main-50 rounded-lg focus:ring-2 focus:ring-brand-accent-gold focus:border-transparent outline-none transition font-karla text-sm sm:text-base"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium font-karla text-brand-main-20 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-brand-main-50 rounded-lg focus:ring-2 focus:ring-brand-accent-gold focus:border-transparent outline-none transition font-karla text-sm sm:text-base"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium font-karla text-brand-main-20 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-brand-main-50 rounded-lg focus:ring-2 focus:ring-brand-accent-gold focus:border-transparent outline-none transition resize-none font-karla text-sm sm:text-base"
                  placeholder="Tell us about your gift ideas or questions..."
                />
              </div>
              
              <button
                type="submit"
                className="btn-brand w-full bg-brand-accent-gold text-white hover:bg-brand-main-50 transition-colors text-sm sm:text-base py-3"
              >
                Send Message
              </button>
            </form>
          </div>
          
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div className="bg-white rounded-lg p-5 sm:p-6 shadow-md">
              <div className="text-brand-accent-gold mb-2">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold font-karla text-brand-main-20 mb-1 text-sm sm:text-base">Email</h3>
              <p className="font-karla text-brand-main-30 text-xs sm:text-sm">hello@ohwhatagift.com</p>
            </div>
            
            <div className="bg-white rounded-lg p-5 sm:p-6 shadow-md">
              <div className="text-brand-accent-gold mb-2">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold font-karla text-brand-main-20 mb-1 text-sm sm:text-base">Phone</h3>
              <p className="font-karla text-brand-main-30 text-xs sm:text-sm">+1 (555) GIFT-LOVE</p>
            </div>
            
            <div className="bg-white rounded-lg p-5 sm:p-6 shadow-md sm:col-span-2 md:col-span-1">
              <div className="text-brand-accent-gold mb-2">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold font-karla text-brand-main-20 mb-1 text-sm sm:text-base">Office Hours</h3>
              <p className="font-karla text-brand-main-30 text-xs sm:text-sm">Mon-Fri: 9am-6pm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
