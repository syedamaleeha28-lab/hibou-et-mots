import type { CategoryPageData } from "@/lib/db/types/page-data"
import { CategoryCard } from "@/components/cards/category-card"
import { SectionHeading } from "@/components/layout/section-heading"

type RelatedCategoriesRowProps = {
  categories: CategoryPageData["relatedCategories"]
  // NEW: was hardcoded French. The cards themselves already link to
  // correctly-localized categories (relatedCategories comes from the
  // category's own locale-scoped data) — only this heading text leaked.
  locale?: "fr" | "pt-BR"
}

const COPY = {
  fr: {
    eyebrow: "À découvrir",
    title: "Catégories liées",
    description: "Continue l'aventure avec d'autres thèmes, niveaux ou difficultés.",
  },
  "pt-BR": {
    eyebrow: "Para descobrir",
    title: "Categorias relacionadas",
    description: "Continue a aventura com outros temas, níveis ou dificuldades.",
  },
} as const

export function RelatedCategoriesRow({ categories, locale = "fr" }: RelatedCategoriesRowProps) {
  if (categories.length === 0) return null
  const copy = COPY[locale]

  return (
    <section>
      <SectionHeading
        align="left"
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  )
}
