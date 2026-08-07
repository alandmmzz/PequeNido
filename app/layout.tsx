import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Nunito, Fraunces } from 'next/font/google'
import { CartProvider } from '@/components/cart-provider'
import { WhatsappButton } from '@/components/whatsapp-button'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Peque Nido | Juguetes y libros para bebés',
  description:
    'Peque Nido es la tienda de juguetes y libros pensados para acompañar cada etapa del bebé, de 0 meses en adelante. Materiales naturales y diseño cuidado.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#6b7a4a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`light bg-background ${nunito.variable} ${fraunces.variable}`}
    >
      <body className="font-sans antialiased">
        <CartProvider>{children}</CartProvider>
        <WhatsappButton />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
