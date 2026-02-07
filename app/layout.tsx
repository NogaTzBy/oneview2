import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OneView - Dashboard Shopify',
  description: 'Dashboard de análisis y gestión para tiendas Shopify',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

