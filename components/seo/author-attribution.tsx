import Link from "next/link"
import {
  formatFrenchDate,
  SITE_AUTHOR,
  SITE_CONTENT_UPDATED_DATE,
  SITE_PUBLISHED_DATE,
} from "@/lib/content/author"
import { ROUTES } from "@/lib/seo/routes"

type AuthorAttributionProps = {
  /** Show full mission blurb (about / author pages). */
  variant?: "compact" | "detailed"
  className?: string
}

export function AuthorAttribution({ variant = "compact", className }: AuthorAttributionProps) {
  return (
    <aside
      className={
        className ??
        "rounded-2xl border border-border bg-card/60 px-5 py-4 text-sm leading-relaxed text-muted-foreground"
      }
    >
      <p className="font-heading text-xs font-extrabold uppercase tracking-wide text-foreground/70">
        Rédaction &amp; expertise
      </p>
      <p className="mt-2">
        Contenu rédigé par{" "}
        <Link href={ROUTES.auteur} className="font-semibold text-primary hover:underline">
          {SITE_AUTHOR.name}
        </Link>
        , {SITE_AUTHOR.jobTitle.toLowerCase()} — spécialisée dans les mots mêlés éducatifs en
        français.
      </p>
      {variant === "detailed" && (
        <p className="mt-2">{SITE_AUTHOR.experience}</p>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        Publié le {formatFrenchDate(SITE_PUBLISHED_DATE)}
        {" · "}
        Mis à jour le {formatFrenchDate(SITE_CONTENT_UPDATED_DATE)}
        {" · "}
        <a href={`mailto:${SITE_AUTHOR.email}`} className="text-primary hover:underline">
          {SITE_AUTHOR.email}
        </a>
      </p>
    </aside>
  )
}
