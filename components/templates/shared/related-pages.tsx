import Link from "next/link"
import { cn } from "@/lib/utils"

export type RelatedPageLink = {
  label: string
  href: string
}

type RelatedPagesProps = {
  links: RelatedPageLink[]
  title?: string
  className?: string
}

export function RelatedPages({
  links,
  title = "Pages associées",
  className,
}: RelatedPagesProps) {
  if (links.length === 0) return null

  return (
    <section
      className={cn(
        "rounded-3xl border border-border bg-card/70 p-6 sm:p-8",
        className,
      )}
    >
      <h2 className="font-heading text-xl font-extrabold text-foreground">{title}</h2>
      <ul className="mt-4 flex flex-col gap-2 text-sm font-semibold">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-primary underline-offset-4 hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
