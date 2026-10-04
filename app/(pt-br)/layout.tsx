import type { Metadata, Viewport } from 'next'
import { RootHtmlShell } from '@/components/layout/root-html-shell'
import { DEFAULT_SITE_URL, resolveSiteOrigin } from '@/lib/seo/routes'
import '../globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(resolveSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL)),
  title: 'Hibou & Mots — Caça-Palavras Grátis para Imprimir e Jogar Online',
  description:
    'Caça-palavras grátis em português para todas as idades. Grades para imprimir em PDF ou jogar online.',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <RootHtmlShell lang="pt-BR">{children}</RootHtmlShell>
}
