import Link from "next/link"
import { FolderOpen, Sparkles, Wand2 } from "lucide-react"
import type { PuzzleCardData } from "@/lib/db/types/page-data"
import type { SearchCategoryHit } from "@/lib/search/types"
import { PuzzleCard } from "@/components/cards/puzzle-card"
import { SectionHeading } from "@/components/layout/section-heading"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/seo/routes"

type SearchEmptyStateProps = {
  query: string
  relatedCategories: SearchCategoryHit[]
  popularPuzzles: PuzzleCardData[]
}

export function SearchEmptyState({
  query,
  relatedCategories,
  popularPuzzles,
}: SearchEmptyStateProps) {
  const trimmedQuery = query.trim()

  return (
    <div className="flex flex-col gap-10">
      <div className="rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
        <p className="font-heading text-2xl font-extrabold text-foreground">
          Aucune grille trouvée
          {trimmedQuery ? (
            <>
              {" "}
              pour « <span className="text-primary">{trimmedQuery}</span> »
            </>
          ) : null}
        </p>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Essaie un autre mot-clé, retire un filtre ou crée ta propre grille avec le générateur
          gratuit.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            nativeButton={false}
            className="rounded-full bg-primary font-extrabold text-primary-foreground hover:bg-primary/90"
            render={<Link href={ROUTES.generateur} />}
          >
            <Wand2 className="size-4" />
            Ouvrir le générateur
          </Button>
          <Button
            nativeButton={false}
            variant="outline"
            className="rounded-full font-extrabold"
            render={<Link href={ROUTES.gratuits} />}
          >
            <Sparkles className="size-4" />
            Voir toutes les grilles
          </Button>
        </div>
      </div>

      {relatedCategories.length > 0 && (
        <section>
          <SectionHeading
            align="left"
            eyebrow="Suggestions"
            title="Catégories liées"
            description="Explore des thèmes ou niveaux proches de ta recherche."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCategories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-card/80"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <FolderOpen className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block font-heading text-base font-extrabold text-foreground">
                    {category.label}
                  </span>
                  {category.description && (
                    <span className="mt-1 block text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {popularPuzzles.length > 0 && (
        <section>
          <SectionHeading
            align="left"
            eyebrow="Populaires"
            title="Grilles les plus consultées"
            description="Ces mots mêlés plaisent beaucoup en ce moment."
          />
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {popularPuzzles.map((puzzle) => (
              <PuzzleCard key={puzzle.id} puzzle={puzzle} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
