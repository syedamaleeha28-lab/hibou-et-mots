import Link from "next/link"
import { Printer, Sparkles } from "lucide-react"
import type { ContentPageCta } from "@/lib/db/types/content-page-data"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/seo/routes"

const DEFAULT_CONTENT_CTA: ContentPageCta = {
  title: "Crée ta propre grille",
  description:
    "Compose un mots mêlés personnalisé avec tes mots, puis imprime-le ou joue en ligne.",
  primaryLabel: "Générateur gratuit",
  primaryHref: ROUTES.generateur,
  secondaryLabel: "Jouer en ligne",
  secondaryHref: ROUTES.jouer,
  tertiaryLabel: "Imprimer",
  tertiaryHref: ROUTES.imprimer,
}

type ContentPageCtaSectionProps = {
  cta?: ContentPageCta
}

export function ContentPageCtaSection({ cta }: ContentPageCtaSectionProps) {
  const config = cta ?? DEFAULT_CONTENT_CTA

  return (
    <section className="rounded-3xl border border-border bg-primary/10 p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-2xl font-extrabold text-foreground">{config.title}</h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            {config.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            nativeButton={false}
            className="rounded-full bg-primary font-extrabold text-primary-foreground hover:bg-primary/90"
            render={<Link href={config.primaryHref} />}
          >
            <Sparkles className="size-4" />
            {config.primaryLabel}
          </Button>
          {config.secondaryHref && config.secondaryLabel && (
            <Button
              nativeButton={false}
              variant="outline"
              className="rounded-full font-extrabold"
              render={<Link href={config.secondaryHref} />}
            >
              {config.secondaryLabel}
            </Button>
          )}
          {config.tertiaryHref && config.tertiaryLabel && (
            <Button
              nativeButton={false}
              variant="outline"
              className="rounded-full font-extrabold"
              render={<Link href={config.tertiaryHref} />}
            >
              <Printer className="size-4" />
              {config.tertiaryLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
