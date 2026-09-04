import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  metadataBase: new URL('https://rebelstream.vercel.app'),
  title: { default: 'Rebel Stream', template: '%s | Rebel Stream' },
  description: 'Watch popular movies, anime, and series on Rebel Stream.',
  applicationName: 'Rebel Stream',
  generator: 'Next.js',
  alternates: { canonical: '/' },
  icons: { icon: '/rebel-stream-logo.png', apple: '/rebel-stream-logo.png' },
  openGraph: {
    type: 'website',
    title: 'Rebel Stream',
    description: 'Watch popular movies, anime, and series on Rebel Stream.',
    url: 'https://rebelstream.vercel.app/',
    siteName: 'Rebel Stream',
    images: [{ url: '/rebel-stream-logo.png', width: 1408, height: 768, alt: 'Rebel Stream logo' }],
  },
  twitter: { card: 'summary_large_image', title: 'Rebel Stream', description: 'Watch popular movies, anime, and series on Rebel Stream.', images: ['/rebel-stream-logo.png'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Rebel Stream",
              url: "https://rebelstream.vercel.app/",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://rebelstream.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased font-sans">
        {children}
        <Script
          id="rebel-stream-ads"
          src="https://nap5k.com/tag.min.js"
          data-zone="11713436"
          strategy="afterInteractive"
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
