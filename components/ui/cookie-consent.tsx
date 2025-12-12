'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      // Show popup after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-brand-cream border-2 border-brand-green rounded-lg shadow-lg p-4 md:p-6 relative">
          <button
            onClick={handleReject}
            className="absolute top-4 right-4 text-brand-green hover:text-brand-grey-green transition-colors"
            aria-label="Close cookie consent"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="pr-8">
            <h3 className="text-brand-gold text-lg md:text-xl font-semibold mb-3">
              Cookie Consent
            </h3>
            
            <p className="text-brand-green text-sm md:text-base mb-4 leading-relaxed">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
              By clicking &quot;Accept All&quot;, you consent to our use of cookies. You can also choose to reject 
              non-essential cookies or{' '}
              <Link 
                href="/policies/cookies" 
                className="underline hover:opacity-80 transition-opacity"
              >
                learn more about our cookie policy
              </Link>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={handleAccept}
                className="bg-brand-green text-brand-cream hover:bg-brand-green/90 border-brand-green flex-1 sm:flex-none"
              >
                Accept All
              </Button>
              <Button
                onClick={handleReject}
                variant="outline"
                className="border-brand-green text-brand-green hover:bg-brand-green/10 flex-1 sm:flex-none"
              >
                Reject Non-Essential
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

