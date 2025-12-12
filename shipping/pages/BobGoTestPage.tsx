'use client';

import React from 'react';
import { BobGoTest } from '../ui/BobGoTest';
import Header from '@/components/layout/header';
import HeaderSecondary from '@/components/layout/header-secondary';

export default function BobGoTestPage() {
  return (
    <div className="w-full min-h-screen bg-brand-cream">
      {/* Show HeaderSecondary on mobile, Header on desktop */}
      <div className="md:hidden">
        <HeaderSecondary />
      </div>
      <div className="hidden md:block">
        <Header />
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-brand-gold">BobGo Shipping API Test</h1>
          <p className="text-center text-brand-grey-green/80 mb-8">
            This page allows you to test the BobGo shipping API integration before using it in the checkout process.
          </p>
          
          <BobGoTest />
          
          <div className="mt-8 p-6 bg-white rounded-lg border-2 border-brand-green/20">
            <h3 className="text-lg font-semibold mb-4 text-brand-grey-green">Test Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-brand-grey-green/80">
              <li>Click "Test BobGo API" to send a test request to BobGo</li>
              <li>Check the configuration section to verify your API settings</li>
              <li>Review the API response to see available shipping options</li>
              <li>If successful, you can proceed to test the checkout integration</li>
              <li>If there are errors, check your environment variables and API key</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
