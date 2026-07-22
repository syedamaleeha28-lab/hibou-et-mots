/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    // Fêtes/saisons pages wrongly crawled under /mots-meles-thematiques/ → canonical silo
    const seasonalThemeRedirects = [
      "noel",
      "halloween",
      "paques",
      "carnaval",
      "rentree",
      "ete",
      "printemps",
    ].flatMap((slug) => [
      {
        source: `/mots-meles-thematiques/${slug}`,
        destination: `/mots-meles-fetes-saisons/${slug}/`,
        permanent: true,
      },
      {
        source: `/mots-meles-thematiques/${slug}/`,
        destination: `/mots-meles-fetes-saisons/${slug}/`,
        permanent: true,
      },
    ])

    return [
      ...seasonalThemeRedirects,
      // Soft-404 / malformed crawl paths → canonical pages
      {
        source: "/mots-meles-thematiques/fruits/-2",
        destination: "/mots-meles-thematiques/fruits/",
        permanent: true,
      },
      {
        source: "/mots-meles-thematiques/fruits/-2/",
        destination: "/mots-meles-thematiques/fruits/",
        permanent: true,
      },
      {
        source: "/mots-meles-thematiques/meteo/-2",
        destination: "/mots-meles-thematiques/meteo/",
        permanent: true,
      },
      {
        source: "/mots-meles-thematiques/meteo/-2/",
        destination: "/mots-meles-thematiques/meteo/",
        permanent: true,
      },
      {
        source: "/mots-meles/fruits-facile-04/-3",
        destination: "/mots-meles/fruits-facile-04/",
        permanent: true,
      },
      {
        source: "/mots-meles/fruits-facile-04/-3/",
        destination: "/mots-meles/fruits-facile-04/",
        permanent: true,
      },
      {
        source: "/application-mots-meles/-1",
        destination: "/application-mots-meles/",
        permanent: true,
      },
      {
        source: "/application-mots-meles/-1/",
        destination: "/application-mots-meles/",
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      // Serve the static Mots Mêlés PWA (public/app) at /app/
      { source: "/app", destination: "/app/index.html" },
      { source: "/app/", destination: "/app/index.html" },
    ]
  },
  async headers() {
    return [
      {
        source: "/.well-known/assetlinks.json",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
    ]
  },
}

export default nextConfig
