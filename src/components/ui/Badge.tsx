import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'sale' | 'new' | 'gold' | 'outline' | 'dark';
  className?: string;
}

export function Badge({ children, variant = 'dark', className }: BadgeProps) {
  const styles = {
    sale: 'bg-red-600/90 text-white font-bold border border-red-500/50',
    new: 'bg-white text-black font-bold border border-white',
    gold: 'bg-brand-gold/20 text-brand-gold border border-brand-gold/40 font-semibold',
    outline: 'bg-black/60 backdrop-blur-md text-gray-300 border border-white/20',
    dark: 'bg-brand-850 text-gray-300 border border-brand-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase shadow-sm',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
