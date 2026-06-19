import type { SitemapImageEntry, SitemapUrlEntry } from "./types"

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function formatLastMod(value?: Date | string): string | undefined {
  if (!value) return undefined
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toISOString()
}

export function buildUrlSetXml(entries: SitemapUrlEntry[]): string {
  const urls = entries
    .map((entry) => {
      const parts = [`  <url>`, `    <loc>${escapeXml(entry.loc)}</loc>`]
      const lastMod = formatLastMod(entry.lastModified)
      if (lastMod) parts.push(`    <lastmod>${lastMod}</lastmod>`)
      if (entry.changeFrequency) {
        parts.push(`    <changefreq>${entry.changeFrequency}</changefreq>`)
      }
      if (entry.priority != null) {
        parts.push(`    <priority>${entry.priority.toFixed(1)}</priority>`)
      }
      parts.push(`  </url>`)
      return parts.join("\n")
    })
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
}

export function buildSitemapIndexXml(sitemapLocs: string[]): string {
  const entries = sitemapLocs
    .map(
      (loc) =>
        `  <sitemap>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n  </sitemap>`,
    )
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>`
}

export function buildImageUrlSetXml(entries: SitemapImageEntry[]): string {
  const urls = entries
    .map((entry) => {
      return [
        `  <url>`,
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        `    <image:image>`,
        `      <image:loc>${escapeXml(entry.imageLoc)}</image:loc>`,
        entry.title ? `      <image:title>${escapeXml(entry.title)}</image:title>` : "",
        entry.caption ? `      <image:caption>${escapeXml(entry.caption)}</image:caption>` : "",
        `    </image:image>`,
        `  </url>`,
      ]
        .filter(Boolean)
        .join("\n")
    })
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>`
}

export function sitemapResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": `public, max-age=${3600}, s-maxage=${3600}`,
    },
  })
}
