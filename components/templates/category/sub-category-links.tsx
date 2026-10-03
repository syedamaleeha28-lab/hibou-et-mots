import type { CategoryPageData } from "@/lib/db/types/page-data"
import { shouldShowSubCategories } from "@/lib/seo/linking"
import { CategoryCard } from "@/components/cards/category-card"
import { GradeLevelCard } from "@/components/cards/grade-level-card"
import { SectionHeading } from "@/components/layout/section-heading"

type SubCategoryLinksProps = {
  category: Pick<CategoryPageData, "type" | "subCategories">
  // NEW: was hardcoded French. Links to subcategories already come from
  // the category's own locale-scoped data — only this heading leaked.
  locale?: "fr" | "pt-BR"
}

const COPY = {
  fr: {
    eyebrow: "Explorer",
    gradeTitle: "Choisir un niveau scolaire",
    defaultTitle: "Sous-catégories",
    description: "Accède rapidement aux grilles adaptées à ton public ou à ton thème.",
  },
  "pt-BR": {
    eyebrow: "Explorar",
    gradeTitle: "Escolher uma série escolar",
    defaultTitle: "Subcategorias",
    description: "Acesse rapidamente as grades adaptadas ao seu público ou ao seu tema.",
  },
} as const

export function SubCategoryLinks({ category, locale = "fr" }: SubCategoryLinksProps) {
  if (!shouldShowSubCategories(category.type, category.subCategories.length)) {
    return null
  }

  const isGradeHub = category.type === "GRADE"
  const copy = COPY[locale]

  return (
    <section>
      <SectionHeading
        align="left"
        eyebrow={copy.eyebrow}
        title={isGradeHub ? copy.gradeTitle : copy.defaultTitle}
        description={copy.description}
      />
      <div
        className={
          isGradeHub
            ? "mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            : "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {category.subCategories.map((sub) =>
          isGradeHub ? (
            <GradeLevelCard key={sub.id} grade={sub} />
          ) : (
            <CategoryCard key={sub.id} category={sub} />
          ),
        )}
      </div>
    </section>
  )
}
