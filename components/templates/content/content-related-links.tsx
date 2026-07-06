import type { ContentRelatedLink } from "@/lib/db/types/content-page-data"
import { RelatedCategoriesRow } from "@/components/templates/category/related-categories-row"

type ContentRelatedLinksProps = {
  links: ContentRelatedLink[]
}

export function ContentRelatedLinks({ links }: ContentRelatedLinksProps) {
  if (links.length === 0) return null

  return (
    <RelatedCategoriesRow
      categories={links.map((link) => ({
        id: link.id,
        label: link.label,
        href: link.href,
        description: link.description,
      }))}
    />
  )
}
