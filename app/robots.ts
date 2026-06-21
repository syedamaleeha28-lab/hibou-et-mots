import type { MetadataRoute } from "next"
import { absoluteUrl, DEFAULT_SITE_URL } from "@/lib/seo/routes"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/recherche/",
          "/generateur-mots-meles/resultat/",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml", siteUrl),
  }
}
