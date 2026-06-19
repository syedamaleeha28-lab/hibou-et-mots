import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/seo/routes"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hibou-et-mots.fr"

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
