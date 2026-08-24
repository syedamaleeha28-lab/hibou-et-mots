import Link from "next/link"
import { PUZZLE_FORMAT_LINKS, type PuzzleFormatLink } from "@/lib/navigation"

type PuzzleFormatLinksProps = {
  /** The format the visitor is currently on — filtered out of the list. */
  current: PuzzleFormatLink["id"]
}

/**
 * Cross-links between the three puzzle FORMATS (mots mêlés, mots croisés,
 * mots coupés). Deliberately separate from CategoryExploreLinks (which is
 * rich, mots-mêlés-internal content discovery) — this is a different,
 * universal concern: does a visitor on one puzzle format know the other
 * two exist? Before this component, the answer was no, from any page on
 * the site, in either direction. Rendered on category pages, puzzle
 * detail pages, and all crossword/mots-coupés pages, so every format
 * links to every other format from within the content itself — the
 * actual signal that tells Google (and visitors) these are one coherent
 * "word games" topic, not three unrelated islands sharing a domain.
 */
export function PuzzleFormatLinks({ current }: PuzzleFormatLinksProps) {
  const others = PUZZLE_FORMAT_LINKS.filter((format) => format.id !== current)
  if (others.length === 0) return null

  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
      <h2 className="font-heading text-lg font-extrabold text-foreground">
        Envie d&apos;essayer un autre jeu de mots&nbsp;?
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {others.map((format) => (
          <li key={format.id}>
            <Link
              href={format.href}
              className="block rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-muted"
            >
              <span className="block text-sm font-extrabold text-foreground">{format.label}</span>
              {format.description && (
                <span className="mt-1 block text-xs text-muted-foreground">{format.description}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
