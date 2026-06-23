import Link from "next/link"
import type { CategoryPageData } from "@/lib/db/types/page-data"
import { getCategoryExploreLinks } from "@/lib/seo/linking/category-explore-links"

type CategoryExploreLinksProps = {
  category: CategoryPageData
}

export function CategoryExploreLinks({ category }: CategoryExploreLinksProps) {
  const links = getCategoryExploreLinks(category)
  if (links.length === 0) return null

  const topic =
    category.theme?.name ??
    category.grade?.name ??
    category.difficulty?.name ??
    category.h1.replace(/^Mots mêlés\s+/i, "")

  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
      <h2 className="font-heading text-xl font-extrabold text-foreground">
        Explorer les mots mêlés {topic}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Poursuivez avec le générateur, des PDF à imprimer, des grilles en ligne ou d&apos;autres
        rubriques du catalogue — toujours autour du thème {topic}.
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm font-semibold text-primary hover:underline">
              {link.label}
            </Link>
            <span className="mt-0.5 block text-xs text-muted-foreground">{link.description}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
