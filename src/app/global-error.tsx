'use client';

import { useEffect } from 'react';

export default function RootGlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root Global Error caught by root boundary:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-20 h-20 bg-brand-900 border border-brand-800 rounded-full flex items-center justify-center mb-6">
          <img src="/logo.png" alt="BLACK ISLAND" className="w-14 h-14 rounded-full object-cover" />
        </div>
        <h2 className="text-2xl font-bold uppercase mb-2">BLACK ISLAND STORE</h2>
        <p className="text-xs text-gray-400 max-w-md mb-6 font-mono text-center">
          A client-side exception occurred. Click below to reload.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg font-mono"
        >
          Reload Application
        </button>
      </body>
    </html>
  );
}
