'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle =
    'inline-flex items-center justify-center font-medium tracking-wider uppercase transition-all duration-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary:
      'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] border border-white',
    secondary:
      'bg-brand-800 text-white hover:bg-brand-700 border border-brand-700 shadow-md',
    outline:
      'bg-transparent text-white border border-white/20 hover:border-white hover:bg-white/5',
    gold:
      'bg-brand-gold text-black font-semibold hover:bg-amber-400 shadow-[0_0_25px_rgba(212,175,55,0.3)] border border-brand-gold',
    ghost:
      'bg-transparent text-gray-400 hover:text-white hover:bg-white/5 border border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <button
      className={cn(baseStyle, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
