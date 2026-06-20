import { existsSync } from "node:fs"
import { join } from "node:path"
import { getStaticSitemapEntries } from "@/lib/seo/sitemap/static"
import { normalizePath } from "@/lib/seo/canonical"

/** Map a public path to an expected app router page file. */
export function staticPathToAppPageFile(path: string): string {
  const normalized = normalizePath(path)
  if (normalized === "/") return join("app", "page.tsx")

  const segments = normalized.replace(/^\/|\/$/g, "").split("/")
  return join("app", ...segments, "page.tsx")
}

export function listStaticSitemapRoutability(rootDir = process.cwd()): Array<{
  path: string
  pageFile: string
  exists: boolean
}> {
  const entries = getStaticSitemapEntries("https://example.test")

  return entries.map((entry) => {
    const url = new URL(entry.loc)
    const pageFile = staticPathToAppPageFile(url.pathname)
    return {
      path: url.pathname,
      pageFile,
      exists: existsSync(join(rootDir, pageFile)),
    }
  })
}

export function findMissingStaticSitemapRoutes(rootDir = process.cwd()): string[] {
  return listStaticSitemapRoutability(rootDir)
    .filter((entry) => !entry.exists)
    .map((entry) => entry.path)
}
