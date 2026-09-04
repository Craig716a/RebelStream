import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Rebel Stream',
  description: 'Stream movies and shows on Rebel Stream.',
  metadataBase: new URL('https://app-restoration.vercel.app'),
  alternates: { canonical: '/' },
  openGraph: { url: 'https://app-restoration.vercel.app' },
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(navigator.serviceWorker)navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){if((r.active&&r.active.scriptURL||'').indexOf('5gvci.com')>-1)r.unregister()})});if(window.__rebelAdLoaded)return;window.__rebelAdLoaded=true;var key='rebel-ad-last-load',now=Date.now(),last=Number(sessionStorage.getItem(key)||0);if(now-last<60000)return;sessionStorage.setItem(key,String(now));var s=document.createElement('script');s.dataset.zone='11713436';s.src='https://nap5k.com/tag.min.js';s.async=true;document.body.appendChild(s)})()`,
          }}
        />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
