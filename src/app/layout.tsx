import type { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { CinematicIntro } from '@/components/layout/CinematicIntro';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: 'BLACK ISLAND | Luxury Syrian Streetwear',
  description: 'Official online store for BLACK ISLAND streetwear based in Damascus, Syria – Qudsaya. Premium heavyweight hoodies, sneakers, and oversized apparel made in Turkey 🇹🇷.',
  openGraph: {
    title: 'BLACK ISLAND Streetwear Damascus',
    description: 'Premium Turkish Streetwear delivered across Syria from Damascus Qudsaya.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cairo.variable} dark`} suppressHydrationWarning>
      <body className="bg-brand-950 text-gray-100 min-h-screen flex flex-col font-sans antialiased selection:bg-brand-gold selection:text-black" suppressHydrationWarning>
        <LanguageProvider>
          <WishlistProvider>
            <CartProvider>
              <CinematicIntro />
              <Header />
              <main className="flex-1">{children}</main>
              <CartDrawer />
              <Footer />
            </CartProvider>
          </WishlistProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
