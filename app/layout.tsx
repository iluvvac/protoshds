import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'SHDS',
  description: 'SMART HSSE DASHBOARD SYSTEM',
  icons: {
    icon: [
      {
        url: '/shds_logo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/shds_logo.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/shds_logo.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/shds_logo.png.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
