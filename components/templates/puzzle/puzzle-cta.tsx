import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generatorCtaHref } from "@/lib/seo/linking"

type PuzzleCtaProps = {
  themeSlug?: string
}

export function PuzzleCta({ themeSlug }: PuzzleCtaProps) {
  return (
    <section className="rounded-3xl border border-border bg-secondary/10 p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-foreground">
            Créez votre propre grille
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Personnalisez un mots mêlés avec vos mots et partagez-le en classe ou en famille.
          </p>
        </div>
        <Button
          nativeButton={false}
          className="rounded-full bg-primary font-extrabold text-primary-foreground hover:bg-primary/90"
          render={<Link href={generatorCtaHref(themeSlug)} />}
        >
          <Sparkles className="size-4" />
          Ouvrir le générateur
        </Button>
      </div>
    </section>
  )
}
