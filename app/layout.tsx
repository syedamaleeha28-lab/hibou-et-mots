import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Baloo_2, Nunito } from 'next/font/google'
import { headers } from 'next/headers'
import { MainShell } from '@/components/layout'
import { DEFAULT_SITE_URL, resolveSiteOrigin } from '@/lib/seo/routes'
import './globals.css'

const baloo = Baloo_2({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})
const nunito = Nunito({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL(resolveSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL)),
  title: 'Hibou & Mots — Mots mêlés gratuits à imprimer et jouer en ligne',
  description:
    'Des mots mêlés en français pour la maternelle, le primaire, le collège, les adultes et les seniors. Grilles à imprimer, générateur et jeu en ligne gratuits.',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'icon',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FFF4E2',
}

// PT-BR pack: was a plain sync component with hardcoded lang="fr". Now
// async so it can read the `x-locale` header set by middleware.ts and
// pick the right <html lang> per request. See middleware.ts for the
// accepted ISR→SSR tradeoff this introduces sitewide.
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const locale = headersList.get('x-locale') === 'pt-BR' ? 'pt-BR' : 'fr'

  return (
    <html
      lang={locale}
      className={`${baloo.variable} ${nunito.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <MainShell>{children}</MainShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
