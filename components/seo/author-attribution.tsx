import {
  formatFrenchDate,
  SITE_AUTHOR,
  SITE_CONTENT_UPDATED_DATE,
  SITE_PUBLISHED_DATE,
} from "@/lib/content/author"
import { isReviewedPage, REVIEWER_BYLINE } from "@/lib/content/reviewer"

type AuthorAttributionProps = {
  /** Kept so existing call sites still type-check. */
  variant?: "compact" | "detailed"
  className?: string
  /** Canonical path. The reviewer line renders only for allowlisted paths. */
  pagePath?: string
}

export function AuthorAttribution({ className, pagePath }: AuthorAttributionProps) {
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
      <p className="mt-2">Contenu proposé par l&apos;équipe Hibou &amp; Mots.</p>
      {isReviewedPage(pagePath) ? <p className="mt-2">{REVIEWER_BYLINE}</p> : null}
      <p className="mt-2 text-xs text-muted-foreground">
        Publié le {formatFrenchDate(SITE_PUBLISHED_DATE)}
        {" · "}
        Mis à jour le {formatFrenchDate(SITE_CONTENT_UPDATED_DATE)}
        {" · "}
        <a href={`mailto:${SITE_AUTHOR.email}`} className="text-primary underline underline-offset-4">
          {SITE_AUTHOR.email}
        </a>
      </p>
    </aside>
  )
}
