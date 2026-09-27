import type { Metadata } from "next"
import { LegalPageTemplate, LEGAL_PAGES } from "@/components/templates/legal/legal-page-template"
import { buildStaticPageMetadata } from "@/lib/seo/metadata"
import { CONTACT_EMAIL } from "@/lib/seo/routes"

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata({
    path: LEGAL_PAGES.contact.path,
    title: LEGAL_PAGES.contact.metaTitle,
    description: LEGAL_PAGES.contact.metaDescription,
  })
}

export default function ContactPage() {
  const page = LEGAL_PAGES.contact

  return (
    <LegalPageTemplate title={page.title} description={page.description} path={page.path}>
      <p>
        Une question sur une grille, une idée de thème ou un partenariat école ? Nous lisons chaque
        message.
      </p>
      <form className="mt-6 grid gap-4 rounded-2xl border border-border bg-card p-6" action="#" method="post">
        <label className="grid gap-1.5 text-sm font-bold">
          Nom
          <input
            type="text"
            name="name"
            required
            className="rounded-xl border border-border bg-background px-3 py-2 font-semibold"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-bold">
          Adresse e-mail
          <input
            type="email"
            name="email"
            required
            className="rounded-xl border border-border bg-background px-3 py-2 font-semibold"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-bold">
          Message
          <textarea
            name="message"
            required
            rows={5}
            className="rounded-xl border border-border bg-background px-3 py-2 font-semibold"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-primary-foreground"
        >
          Envoyer
        </button>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">
        Vous pouvez aussi nous écrire directement à{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPageTemplate>
  )
}
