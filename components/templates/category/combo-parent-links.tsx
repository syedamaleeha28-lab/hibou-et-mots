import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { ComboParentLink } from "@/lib/db/types/page-data"

type ComboParentLinksProps = {
  links: ComboParentLink[]
}

export function ComboParentLinks({ links }: ComboParentLinksProps) {
  if (links.length === 0) return null

  return (
    <section className="rounded-2xl border border-border bg-muted/30 p-5">
      <h2 className="font-heading text-lg font-extrabold text-foreground">
        Explorer les catégories parentes
      </h2>
      <ul className="mt-4 flex flex-col gap-3 sm:flex-row">
        {links.map((link) => (
          <li key={link.href} className="flex-1">
            <Link
              href={link.href}
              className="group flex h-full flex-col gap-2 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
            >
              <span className="font-heading font-extrabold text-foreground">{link.label}</span>
              <span className="text-sm text-muted-foreground">{link.description}</span>
              <ArrowRight className="mt-auto size-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
