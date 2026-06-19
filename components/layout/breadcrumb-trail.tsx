import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { SchemaJsonLd } from "@/components/seo"
import { buildBreadcrumbListSchema, type BreadcrumbItem } from "@/lib/seo"
import { cn } from "@/lib/utils"

export type BreadcrumbTrailProps = {
  items: BreadcrumbItem[]
  className?: string
}

export function BreadcrumbTrail({ items, className }: BreadcrumbTrailProps) {
  if (items.length === 0) return null

  const schema = buildBreadcrumbListSchema(items)

  return (
    <>
      <SchemaJsonLd data={schema} />
      <nav aria-label="Fil d'Ariane" className={cn("text-sm", className)}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <li key={`${item.href}-${index}`} className="inline-flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                )}
                {isLast ? (
                  <span
                    className="font-semibold text-foreground"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="font-semibold text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
