import type { Metadata } from "next"

/**
 * Relative self-canonical for a fixed page.
 * The root layout's metadataBase turns the path into an absolute URL.
 */
export function selfCanonical(path: string): Pick<Metadata, "alternates"> {
  return {
    alternates: { canonical: path },
  }
}
