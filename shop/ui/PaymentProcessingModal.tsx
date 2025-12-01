import React from 'react';
import { Loader2, CreditCard, ArrowRight } from 'lucide-react';

interface PaymentProcessingModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function PaymentProcessingModal({ isOpen, onClose }: PaymentProcessingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-primarySupport border border-tertiary/20 rounded-lg p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-tertiary" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Loader2 className="w-6 h-6 text-tertiary animate-spin" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--white)' }}>
          Processing Payment
        </h3>

        {/* Message */}
        <p className="text-gray-300 mb-6 leading-relaxed">
          Your order has been created successfully! You're being redirected to PayFast for secure payment processing.
        </p>

        {/* Progress Steps */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-6 h-6 bg-tertiary rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-xs">✓</span>
            </div>
            <span style={{ color: 'var(--white)' }}>Order Created</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="w-6 h-6 bg-tertiary/20 rounded-full flex items-center justify-center">
              <Loader2 className="w-3 h-3 text-tertiary animate-spin" />
            </div>
            <span style={{ color: 'var(--white)' }}>Redirecting to PayFast</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm opacity-50">
            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">3</span>
            </div>
            <span style={{ color: 'var(--white)' }}>Complete Payment</span>
          </div>
        </div>

        {/* Redirect Message */}
        <div className="bg-tertiary/10 border border-tertiary/20 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <ArrowRight className="w-4 h-4 text-tertiary" />
            <span style={{ color: 'var(--white)' }}>
              You will be redirected automatically in a moment...
            </span>
          </div>
        </div>

        {/* Manual redirect button (fallback) */}
        <button
          onClick={() => {
            // This will be handled by the parent component
            if (onClose) onClose();
          }}
          className="btn btn-primary w-full"
        >
          Continue to PayFast
        </button>
      </div>
    </div>
  );
}
