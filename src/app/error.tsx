'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Client-Side Error caught by boundary:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-black text-white flex flex-col items-center justify-center text-center p-6 font-sans">
      <div className="w-20 h-20 bg-brand-900 border border-brand-800 rounded-full flex items-center justify-center mb-6 shadow-2xl">
        <img src="/logo.png" alt="BLACK ISLAND" className="w-14 h-14 rounded-full object-cover" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase mb-2 text-white">
        BLACK ISLAND STORE
      </h2>
      <p className="text-xs sm:text-sm text-gray-400 max-w-md mb-6 font-mono">
        Something unexpected occurred while loading the page. Please click below to refresh and try again.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-brand-gold text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-amber-300 transition-all shadow-lg font-mono"
        >
          Reload Page
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-brand-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-brand-700 hover:bg-brand-850 transition-all font-mono"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
