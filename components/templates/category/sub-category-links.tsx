import type { CategoryPageData } from "@/lib/db/types/page-data"
import { shouldShowSubCategories } from "@/lib/seo/linking"
import { CategoryCard } from "@/components/cards/category-card"
import { GradeLevelCard } from "@/components/cards/grade-level-card"
import { SectionHeading } from "@/components/layout/section-heading"

type SubCategoryLinksProps = {
  category: Pick<CategoryPageData, "type" | "subCategories">
}

export function SubCategoryLinks({ category }: SubCategoryLinksProps) {
  if (!shouldShowSubCategories(category.type, category.subCategories.length)) {
    return null
  }

  const isGradeHub = category.type === "GRADE"

  return (
    <section>
      <SectionHeading
        align="left"
        eyebrow="Explorer"
        title={isGradeHub ? "Choisir un niveau scolaire" : "Sous-catégories"}
        description="Accède rapidement aux grilles adaptées à ton public ou à ton thème."
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
