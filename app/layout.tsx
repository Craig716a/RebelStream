import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rebelstream.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Rebel Stream — Movies and TV Shows',
    template: '%s | Rebel Stream',
  },
  description: 'Discover movies and TV shows on Rebel Stream with rich details, seasons, and episodes.',
  applicationName: 'Rebel Stream',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Rebel Stream',
    url: siteUrl,
    title: 'Rebel Stream — Movies and TV Shows',
    description: 'Discover movies and TV shows on Rebel Stream.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rebel Stream — Movies and TV Shows',
    description: 'Discover movies and TV shows on Rebel Stream.',
  },
  robots: { index: true, follow: true },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark bg-background ${inter.variable}`}>
      <body className="antialiased font-sans">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
