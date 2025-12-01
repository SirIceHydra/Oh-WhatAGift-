import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-[3px]',
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function Loading({ size = 'md', text, className = '' }: LoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-brand-green/30 border-t-brand-green rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && (
        <p className={`text-brand-green ${textSizeClasses[size]}`}>{text}</p>
      )}
    </div>
  );
}

export function ProductSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`overflow-hidden bg-white transition-all duration-500 ${className}`}>
      {/* Image skeleton */}
      <div className="relative w-full aspect-square bg-brand-light-green/30 overflow-hidden animate-pulse">
        <div className="w-full h-full bg-brand-light-green/20" />
      </div>

      {/* Name + Price skeleton */}
      <div className="w-full px-6 py-5 text-center space-y-3">
        {/* Title skeleton */}
        <div className="w-3/4 h-5 bg-brand-light-green/30 rounded mx-auto animate-pulse" />
        
        {/* Price skeleton */}
        <div className="w-1/2 h-4 bg-brand-light-green/20 rounded mx-auto animate-pulse" />
      </div>
    </div>
  );
}

