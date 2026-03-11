import './globals.css'
import { QueryProvider } from '@/lib/queryClient'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'CivicTrack',
  description: 'Citizen Complaint Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  )
}