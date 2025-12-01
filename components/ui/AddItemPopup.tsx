import React, { useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface AddItemPopupProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function AddItemPopup({ isOpen, onClose, message }: AddItemPopupProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-brand-green text-white rounded-lg shadow-lg p-4 min-w-[300px] max-w-md border border-brand-green/20">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-sm">
              {message} added to cart
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-brand-light-green transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

