import './globals.css'
import { ReactNode } from 'react'
import Nav from '@/components/Nav'
import { Inter, Playfair_Display } from 'next/font/google'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-body bg-brand-cream text-gray-900`}>
        <ToastProvider>
          <Nav />
          <main className="max-w-6xl mx-auto p-4">{children}</main>
        </ToastProvider>
      </body>
    </html>
  )
}