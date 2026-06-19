import type { CategoryPageData } from "@/lib/db/types/page-data"
import { CategoryCard } from "@/components/cards/category-card"
import { SectionHeading } from "@/components/layout/section-heading"

type RelatedCategoriesRowProps = {
  categories: CategoryPageData["relatedCategories"]
}

export function RelatedCategoriesRow({ categories }: RelatedCategoriesRowProps) {
  if (categories.length === 0) return null

  return (
    <section>
      <SectionHeading
        align="left"
        eyebrow="À découvrir"
        title="Catégories liées"
        description="Continue l'aventure avec d'autres thèmes, niveaux ou difficultés."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  )
}
