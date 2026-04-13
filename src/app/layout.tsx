import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Praxis — Professional Simulation Platform',
    template: '%s | Praxis',
  },
  description: "Prove you can work — before you're hired. Build a verified performance portfolio through realistic workplace simulation.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'Praxis — Professional Simulation Platform',
    description: "Prove you can work — before you're hired. Build a verified performance portfolio through realistic workplace simulation.",
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
