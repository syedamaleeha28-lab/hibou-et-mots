import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles, Wand2 } from "lucide-react"
import type { CategoryPageData, RelatedCategoryLink } from "@/lib/db/types/page-data"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/seo/routes"

type CategoryEmptyStateProps = {
  category: Pick<CategoryPageData, "h1" | "relatedCategories" | "type">
}

function RelatedCategoryPills({ categories }: { categories: RelatedCategoryLink[] }) {
  const picks = categories.slice(0, 3)
  if (picks.length === 0) return null

  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <p className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
        Rubriques à explorer
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {picks.map((entry) => (
          <Link
            key={entry.id}
            href={entry.href}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            {entry.label}
            <ArrowRight className="size-3.5 opacity-70" />
          </Link>
        ))}
      </div>
    </div>
  )
}

export function CategoryEmptyState({ category }: CategoryEmptyStateProps) {
  const secondaryHref =
    category.type === "DIFFICULTY" || category.type === "PRESS_BRAND"
      ? ROUTES.gratuits
      : ROUTES.difficulteHub
  const secondaryLabel =
    category.type === "DIFFICULTY" || category.type === "PRESS_BRAND"
      ? "Toutes les grilles gratuites"
      : "Choisir un niveau"

  return (
    <section aria-label="Grilles à venir">
      <div className="rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-8 text-center sm:px-10 sm:py-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center">
          <Image
            src="/mascot-wave.png"
            alt="Hibou, la mascotte de Hibou&Mots"
            width={80}
            height={80}
            className="h-20 w-20 object-contain"
          />
        </div>

        <p className="mt-4 font-heading text-xl font-extrabold text-foreground sm:text-2xl">
          Pas encore de grilles ici — mais Hibou prépare la suite&nbsp;!
        </p>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
          Cette rubrique sera bientôt remplie de nouveaux mots mêlés. En attendant, jouez
          gratuitement ailleurs sur le site ou composez une grille sur mesure en quelques clics.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            nativeButton={false}
            className="rounded-full bg-primary font-extrabold text-primary-foreground hover:bg-primary/90"
            render={<Link href={ROUTES.gratuits} />}
          >
            <Sparkles className="size-4" />
            Explorer les grilles gratuites
          </Button>
          <Button
            nativeButton={false}
            variant="outline"
            className="rounded-full font-extrabold"
            render={<Link href={ROUTES.generateur} />}
          >
            <Wand2 className="size-4" />
            Créer ma grille
          </Button>
          <Button
            nativeButton={false}
            variant="outline"
            className="rounded-full font-extrabold"
            render={<Link href={secondaryHref} />}
          >
            {secondaryLabel}
          </Button>
        </div>

        <RelatedCategoryPills categories={category.relatedCategories} />
      </div>
    </section>
  )
}
