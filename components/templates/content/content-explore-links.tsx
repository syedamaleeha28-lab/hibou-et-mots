import Link from "next/link"
import type { ContentPageData } from "@/lib/db/types/content-page-data"
import type { CategoryExploreLink } from "@/lib/seo/linking/category-explore-links"

type ContentExploreLinksProps = {
  page: Pick<ContentPageData, "h1" | "exploreLinks">
}

function exploreTopic(h1: string): string {
  return h1.replace(/^Mots mêlés\s+/i, "")
}

export function ContentExploreLinks({ page }: ContentExploreLinksProps) {
  const links = page.exploreLinks ?? []
  if (links.length === 0) return null

  const topic = exploreTopic(page.h1)

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
        {links.map((link: CategoryExploreLink) => (
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
