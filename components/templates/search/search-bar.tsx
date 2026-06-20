"use client"

import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { buildSearchHref } from "@/lib/search/normalize"
import type { SearchFilters, SearchInput } from "@/lib/search/types"
import { cn } from "@/lib/utils"

type SearchBarProps = {
  input: SearchInput
  className?: string
}

export function SearchBar({ input, className }: SearchBarProps) {
  const router = useRouter()

  return (
    <form
      action={buildSearchHref({ filters: input.filters, page: 1 })}
      method="get"
      className={cn("relative", className)}
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const query = String(formData.get("q") ?? "").trim()
        router.push(
          buildSearchHref({
            query,
            filters: input.filters,
            page: 1,
          }),
        )
      }}
    >
      {input.filters.theme && (
        <input type="hidden" name="theme" value={input.filters.theme} />
      )}
      {input.filters.grade && (
        <input type="hidden" name="grade" value={input.filters.grade} />
      )}
      {input.filters.difficulty && (
        <input type="hidden" name="difficulty" value={input.filters.difficulty} />
      )}
      {input.filters.category && (
        <input type="hidden" name="category" value={input.filters.category} />
      )}

      <label htmlFor="search-query" className="sr-only">
        Rechercher des mots mêlés
      </label>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        id="search-query"
        name="q"
        type="search"
        defaultValue={input.query}
        placeholder="Titre, thème, niveau, difficulté…"
        autoComplete="off"
        enterKeyHint="search"
        className="h-12 w-full rounded-2xl border border-border bg-card pl-12 pr-28 text-base font-semibold text-foreground shadow-sm outline-none ring-primary/30 placeholder:text-muted-foreground focus:ring-2"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Rechercher
      </button>
    </form>
  )
}

export type { SearchFilters }
