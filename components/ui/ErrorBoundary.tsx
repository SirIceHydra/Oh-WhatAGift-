import React from 'react';
import { Button } from './button';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  error: string | null;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ error, onRetry, className = '' }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <div className={`flex flex-col items-center justify-center gap-4 p-6 ${className}`}>
      <div className="flex flex-col items-center gap-3 text-brand-green">
        <AlertCircle className="w-6 h-6 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-medium text-brand-green mb-2">Error loading products</h3>
          <p className="text-brand-grey-green text-sm">{error}</p>
        </div>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-brand-green text-white hover:bg-brand-green/90 border-brand-green"
        >
          Retry
        </Button>
      )}
    </div>
  );
}

