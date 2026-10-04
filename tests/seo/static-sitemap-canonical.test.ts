import type { Metadata } from "next"
import { describe, expect, it } from "vitest"
import { absoluteUrl, resolveSiteOrigin } from "@/lib/seo/routes"
import { getStaticSitemapEntries } from "@/lib/seo/sitemap/static"
import { staticPathToAppPageFile } from "@/lib/seo/sitemap/routability"

const pageModules = (
  import.meta as ImportMeta & {
    glob(pattern: string): Record<string, () => Promise<PageModule>>
  }
).glob("../../app/**/page.tsx")

type PageModule = {
  metadata?: Metadata | Promise<Metadata>
  generateMetadata?: (props: {
    searchParams?: Promise<{ page?: string } | undefined>
    params?: Promise<Record<string, string>>
  }) => Metadata | Promise<Metadata>
}

function moduleKeyForPath(pathname: string): string {
  const file = staticPathToAppPageFile(pathname).replaceAll("\\", "/")
  const key = Object.keys(pageModules).find((candidate) =>
    candidate.replaceAll("\\", "/").endsWith(file),
  )
  if (!key) throw new Error(`no page module for ${pathname} (${file})`)
  return key
}

function canonicalHref(metadata: Metadata): string | undefined {
  const canonical = metadata.alternates?.canonical
  if (!canonical) return undefined
  if (typeof canonical === "string") return canonical
  if (canonical instanceof URL) return canonical.toString()
  if (typeof canonical === "object" && canonical.url) {
    return canonical.url instanceof URL ? canonical.url.toString() : String(canonical.url)
  }
  return undefined
}

/** Same absolutization Next applies with the layout metadataBase. */
function resolveCanonical(href: string): string {
  const absolute = /^https?:\/\//i.test(href) ? href : absoluteUrl(href)
  const url = new URL(absolute)
  if (url.pathname !== "/" && !url.pathname.endsWith("/")) url.pathname += "/"
  url.hash = ""
  return `${url.origin}${url.pathname}${url.search}`
}

describe("static sitemap canonicals", () => {
  it("gives every static-sitemap path a canonical equal to its own URL", async () => {
    const origin = resolveSiteOrigin()
    const failures: string[] = []

    for (const entry of getStaticSitemapEntries(origin)) {
      const pathname = new URL(entry.loc).pathname
      const load = pageModules[moduleKeyForPath(pathname)] as () => Promise<PageModule>
      const page = await load()
      const metadata = page.generateMetadata
        ? await page.generateMetadata({
            searchParams: Promise.resolve(undefined),
            params: Promise.resolve({}),
          })
        : await page.metadata
      const href = metadata ? canonicalHref(metadata) : undefined
      const resolved = href ? resolveCanonical(href) : undefined
      const expected = absoluteUrl(pathname, origin)
      if (resolved !== expected) {
        failures.push(`${pathname} -> ${resolved ?? "missing"}`)
      }
    }

    expect(failures).toEqual([])
  })
})
