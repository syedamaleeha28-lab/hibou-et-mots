import Link from "next/link"
import { getThemeExploreConfig } from "@/lib/content/themes/theme-explore-links"

type CategoryThemeSectionsProps = {
  slug: string
}

export function CategoryThemeSections({ slug }: CategoryThemeSectionsProps) {
  const config = getThemeExploreConfig(slug)
  if (!config) return null

  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
      <h2 className="font-heading text-xl font-extrabold text-foreground">{config.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{config.intro}</p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {config.links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm font-semibold text-primary hover:underline">
              {link.label}
            </Link>
            <span className="mt-0.5 block text-xs text-muted-foreground">{link.hint}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
