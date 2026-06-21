import { absoluteUrl } from "./routes"

/** Site-wide default Open Graph image (1200×630). */
export const DEFAULT_OG_IMAGE_PATH = "/og-default.png"

export const DEFAULT_OG_IMAGE_WIDTH = 1200
export const DEFAULT_OG_IMAGE_HEIGHT = 630

export function resolveOgImageUrl(input?: {
  override?: string | null
  siteUrl?: string
}): string {
  const siteUrl = input?.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://hibou-et-mots.fr"
  const override = input?.override?.trim()

  if (override) {
    if (override.startsWith("http://") || override.startsWith("https://")) {
      return override
    }
    const path = override.startsWith("/") ? override : `/${override}`
    return absoluteUrl(path, siteUrl)
  }

  return absoluteUrl(DEFAULT_OG_IMAGE_PATH, siteUrl)
}
