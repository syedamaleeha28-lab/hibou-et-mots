import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { RelatedCategoryLink, SubCategoryLink } from "@/lib/db/types/page-data"
import { cn } from "@/lib/utils"

type CategoryCardProps = {
  category: SubCategoryLink | RelatedCategoryLink
  className?: string
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      href={category.href}
      className={cn(
        "group flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 ring-2 ring-transparent transition-all hover:-translate-y-1 hover:shadow-lg",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-lg font-extrabold leading-tight text-foreground">
          {category.label}
        </h3>
        {category.description && (
          <p className="text-sm leading-snug text-muted-foreground">{category.description}</p>
        )}
      </div>
      <div className="mt-auto flex items-center justify-between pt-2">
        {category.puzzleCount != null && (
          <span className="text-xs font-bold text-muted-foreground">
            {category.puzzleCount} grilles
          </span>
        )}
        <ArrowRight className="size-4 text-primary opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
      </div>
    </Link>
  )
}
