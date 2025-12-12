import Header from '@/components/layout/header';
import HeaderSecondary from '@/components/layout/header-secondary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ContactPage() {
  return (
    <div className="w-full min-h-screen bg-brand-cream">
      {/* Show HeaderSecondary on mobile, Header on desktop */}
      <div className="md:hidden">
        <HeaderSecondary />
      </div>
      <div className="hidden md:block">
        <Header />
      </div>
      
      {/* Contact Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-brand-gold mb-12 text-center text-[38.4px]">
          GET IN TOUCH
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div>
            <h3 className="text-brand-gold text-h4 mb-6">Send us a message</h3>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-brand-green text-body mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  className="border-brand-green text-brand-green placeholder:text-brand-green/60 bg-transparent focus-visible:ring-brand-green"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-brand-green text-body mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="border-brand-green text-brand-green placeholder:text-brand-green/60 bg-transparent focus-visible:ring-brand-green"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-brand-green text-body mb-2">
                  Subject
                </label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="What is this regarding?"
                  className="border-brand-green text-brand-green placeholder:text-brand-green/60 bg-transparent focus-visible:ring-brand-green"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-brand-green text-body mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  placeholder="Tell us how we can help..."
                  className="flex w-full rounded-md border border-brand-green bg-transparent px-3 py-2 text-sm text-brand-green placeholder:text-brand-green/60 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-white border-brand-green text-brand-green hover:bg-brand-light-green/20"
              >
                SEND MESSAGE
              </Button>
            </form>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-brand-gold text-h4 mb-6">Contact Information</h3>
            
            <div className="space-y-8">
              <div>
                <h5 className="text-brand-gold text-h5 mb-3">Email</h5>
                <a 
                  href="mailto:hello@ohwhatagift.com" 
                  className="text-brand-green text-body hover:opacity-80 transition-opacity"
                >
                  hello@ohwhatagift.com
                </a>
              </div>
              
              <div>
                <h5 className="text-brand-gold text-h5 mb-3">Phone</h5>
                <a 
                  href="tel:+27123456789" 
                  className="text-brand-green text-body hover:opacity-80 transition-opacity"
                >
                  +27 12 345 6789
                </a>
              </div>
              
              <div>
                <h5 className="text-brand-gold text-h5 mb-3">Business Hours</h5>
                <div className="text-brand-green text-body space-y-1">
                  <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                  <p>Saturday: 10:00 AM - 2:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
              
              <div>
                <h5 className="text-brand-gold text-h5 mb-3">Follow Us</h5>
                <div className="flex gap-4">
                  <a 
                    href="#" 
                    className="text-brand-green text-body hover:opacity-80 transition-opacity"
                  >
                    Instagram
                  </a>
                  <a 
                    href="#" 
                    className="text-brand-green text-body hover:opacity-80 transition-opacity"
                  >
                    Facebook
                  </a>
                  <a 
                    href="#" 
                    className="text-brand-green text-body hover:opacity-80 transition-opacity"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-brand-light-green rounded-[20px]">
              <h5 className="text-brand-gold text-h5 mb-3">For Bulk Orders</h5>
              <p className="text-brand-green text-body mb-4">
                Interested in corporate gifting or bulk personalisation? We'd love to discuss your requirements and create something special for your team or event.
              </p>
              <a 
                href="/personalise" 
                className="text-brand-green text-body underline hover:opacity-80 transition-opacity"
              >
                Learn more about bulk options →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

