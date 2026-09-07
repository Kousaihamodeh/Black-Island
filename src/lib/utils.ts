import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(amount);

  return `$${formatted}`;
}

export function formatUSDPrice(amountUSD: number): string {
  return `$${amountUSD.toFixed(2)}`;
}
