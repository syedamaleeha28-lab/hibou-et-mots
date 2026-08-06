import Image from "next/image"
import { cn } from "@/lib/utils"
import type { IllustrationSpec } from "@/lib/images/page-illustrations"

type PageIllustrationProps = {
  variant: "hero" | "preview"
  illustration: IllustrationSpec
  className?: string
}

/**
 * Single reusable image slot used by every category and content page.
 * - "hero": above-the-fold, eager-loaded (priority) for good LCP.
 * - "preview": further down the page, lazy-loaded (next/image default).
 * Next.js Image automatically serves WebP/AVIF and generates responsive
 * srcset variants — no manual format conversion needed here.
 */
export function PageIllustration({ variant, illustration, className }: PageIllustrationProps) {
  const { src, alt, title, caption, width, height } = illustration

  return (
    <figure className={cn("overflow-hidden rounded-3xl", className)}>
      <Image
        src={src}
        alt={alt}
        title={title}
        width={width}
        height={height}
        priority={variant === "hero"}
        loading={variant === "hero" ? undefined : "lazy"}
        sizes="(min-width: 1024px) 800px, 100vw"
        className="h-auto w-full object-cover"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm font-semibold text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
