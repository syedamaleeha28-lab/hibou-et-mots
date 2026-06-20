"use client"

import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { buildSearchHref } from "@/lib/search/normalize"
import type { SearchFacets, SearchInput } from "@/lib/search/types"
import { cn } from "@/lib/utils"

type SearchFiltersProps = {
  input: SearchInput
  facets: SearchFacets
  className?: string
}

type FilterKey = "theme" | "grade" | "difficulty" | "category"

const FILTER_LABELS: Record<FilterKey, string> = {
  theme: "Thème",
  grade: "Niveau",
  difficulty: "Difficulté",
  category: "Catégorie",
}

function selectClassName() {
  return "h-10 w-full rounded-xl border border-border bg-card px-3 text-sm font-bold text-foreground outline-none ring-primary/30 focus:ring-2"
}

export function SearchFiltersPanel({ input, facets, className }: SearchFiltersProps) {
  const router = useRouter()
  const activeCount = Object.values(input.filters).filter(Boolean).length

  const pushFilters = (nextFilters: SearchInput["filters"]) => {
    router.push(
      buildSearchHref({
        query: input.query,
        filters: nextFilters,
        page: 1,
      }),
    )
  }

  const updateFilter = (key: FilterKey, value: string) => {
    pushFilters({
      ...input.filters,
      [key]: value || undefined,
    })
  }

  const clearFilters = () => {
    router.push(
      buildSearchHref({
        query: input.query,
        page: 1,
      }),
    )
  }

  return (
    <aside className={cn("rounded-2xl border border-border bg-card/70 p-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
          Filtres
        </h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-extrabold text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            <X className="size-3" />
            Effacer ({activeCount})
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {(Object.keys(FILTER_LABELS) as FilterKey[]).map((key) => {
          const options =
            key === "theme"
              ? facets.themes
              : key === "grade"
                ? facets.grades
                : key === "difficulty"
                  ? facets.difficulties
                  : facets.categories

          return (
            <label key={key} className="grid gap-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
                {FILTER_LABELS[key]}
              </span>
              <select
                value={input.filters[key] ?? ""}
                onChange={(event) => updateFilter(key, event.target.value)}
                className={selectClassName()}
              >
                <option value="">Tous</option>
                {options.map((option) => (
                  <option key={option.slug} value={option.slug}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          )
        })}
      </div>
    </aside>
  )
}
