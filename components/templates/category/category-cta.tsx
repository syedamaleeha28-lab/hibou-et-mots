import Link from "next/link"
import { Printer, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/seo"
import { generatorCtaHref } from "@/lib/seo/linking"

type CategoryCtaProps = {
  themeSlug?: string
}

export function CategoryCta({ themeSlug }: CategoryCtaProps) {
  return (
    <section className="rounded-3xl border border-border bg-primary/10 p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-2xl font-extrabold text-foreground">
            Crée ta propre grille
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Compose un mots mêlés personnalisé avec tes mots, puis imprime-le ou joue en ligne.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            nativeButton={false}
            className="rounded-full bg-primary font-extrabold text-primary-foreground hover:bg-primary/90"
            render={<Link href={generatorCtaHref(themeSlug)} />}
          >
            <Sparkles className="size-4" />
            Générateur gratuit
          </Button>
          <Button
            nativeButton={false}
            variant="outline"
            className="rounded-full font-extrabold"
            render={<Link href={ROUTES.jouer} />}
          >
            Jouer en ligne
          </Button>
          <Button
            nativeButton={false}
            variant="outline"
            className="rounded-full font-extrabold"
            render={<Link href={ROUTES.imprimer} />}
          >
            <Printer className="size-4" />
            Imprimer
          </Button>
        </div>
      </div>
    </section>
  )
}
