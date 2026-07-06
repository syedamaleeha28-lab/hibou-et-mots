import Image from "next/image"
import type { ContentPageData } from "@/lib/db/types/content-page-data"

const VARIANT_EYEBROWS: Record<ContentPageData["variant"], string> = {
  editorial: "Guide",
  educational: "Ressource pédagogique",
}

type ContentPageHeroProps = {
  page: Pick<ContentPageData, "h1" | "introText" | "variant" | "illustration">
}

export function ContentPageHero({ page }: ContentPageHeroProps) {
  const { illustration } = page

  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-extrabold uppercase tracking-wide text-primary">
          {VARIANT_EYEBROWS[page.variant]}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
          {page.h1}
        </h1>
        <div className="mt-5 rounded-2xl border border-border bg-card/80 p-5 sm:p-6">
          <div className="flex flex-col gap-4">
            {page.introText.split("\n\n").map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-base leading-relaxed text-foreground/90 sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {illustration && (
        <div className="mx-auto flex shrink-0 items-center justify-center lg:mx-0 lg:pt-8">
          <Image
            src={illustration.src}
            alt={illustration.alt}
            width={illustration.width ?? 160}
            height={illustration.height ?? 160}
            className="h-32 w-32 object-contain sm:h-40 sm:w-40"
          />
        </div>
      )}
    </header>
  )
}
