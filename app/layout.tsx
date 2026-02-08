import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OneView - Panel de Métricas de IA',
  description: 'Dashboard de métricas para agentes de IA',
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
