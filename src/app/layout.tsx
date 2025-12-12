// src/app/layout.tsx (or app/layout.tsx)
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { ClientProviders, Navbar, Footer } from '@/shared/components'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  // Strong brand + main keyword
  title: 'IndianTradeMart | India’s Trusted B2B Marketplace for Suppliers & Buyers',

  // Clear value prop, B2B, India focus, bulk enquiries
  description:
    'IndianTradeMart is a B2B marketplace for India that connects verified manufacturers, suppliers, wholesalers and distributors with serious buyers. Post requirements, compare quotes and grow your business with reliable B2B trade leads.',

  // Richer, long-tail B2B keywords
  keywords: [
    'B2B marketplace India',
    'Indian B2B platform',
    'wholesale suppliers India',
    'manufacturers India',
    'distributors India',
    'B2B trade leads',
    'bulk order suppliers',
    'business directory India',
    'industrial supplies marketplace',
    'IndianTradeMart',
  ],

  authors: [{ name: 'IndianTradeMart' }],
  creator: 'IndianTradeMart',
  publisher: 'IndianTradeMart',

  // For canonical URLs & OG/Twitter
  metadataBase: new URL('https://indiantrademart.com'),

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://indiantrademart.com',
    siteName: 'IndianTradeMart',
    title: 'IndianTradeMart | India’s Trusted B2B Marketplace',
    description:
      'Discover verified manufacturers, suppliers and wholesalers across India. Post your B2B requirements, get multiple quotes and grow your business on IndianTradeMart.',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'IndianTradeMart | India’s Trusted B2B Marketplace',
    description:
      'B2B marketplace for manufacturers, suppliers, wholesalers and buyers in India. Generate and manage serious trade leads with IndianTradeMart.',
  },

  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },

  // Optional: helps Google understand site type
  category: 'business',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body className={inter.className}>
        <ClientProviders>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  )
}
