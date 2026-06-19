import Link from "next/link"
import type { SubCategoryLink } from "@/lib/db/types/page-data"
import { cn } from "@/lib/utils"

type GradeLevelCardProps = {
  grade: SubCategoryLink
  className?: string
}

export function GradeLevelCard({ grade, className }: GradeLevelCardProps) {
  return (
    <Link
      href={grade.href}
      className={cn(
        "flex flex-col items-center gap-2 rounded-3xl border border-border bg-card px-4 py-6 text-center transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md",
        className,
      )}
    >
      <span className="font-heading text-2xl font-extrabold text-primary">{grade.badge ?? grade.label}</span>
      <span className="font-heading text-sm font-extrabold text-foreground">{grade.label}</span>
      {grade.puzzleCount != null && (
        <span className="text-xs font-bold text-muted-foreground">{grade.puzzleCount} grilles</span>
      )}
    </Link>
  )
}
