import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ReactQueryProvider } from '@/lib/queryClient'
import { Toaster } from 'sonner'
import FaviconUpdater from '@/components/shared/FaviconUpdater'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'CivicTrack — Smart Complaint Management',
  description: 'Track and manage civic complaints efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${inter.className} min-h-screen flex flex-col`}>
        <FaviconUpdater />
        <ReactQueryProvider>
          <div className="flex-1">{children}</div>
          <footer className="py-3 text-center text-sm text-muted-foreground border-t">
            Made with Love ❤️ ~ Ronit Shaw
          </footer>
          <Toaster richColors position="top-right" />
        </ReactQueryProvider>
      </body>
    </html>
  )
}