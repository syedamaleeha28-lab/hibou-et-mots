import type { Metadata } from "next"
import Link from "next/link"
import { AuthorAttribution } from "@/components/seo/author-attribution"
import { BreadcrumbTrail } from "@/components/layout/breadcrumb-trail"
import { SchemaJsonLd } from "@/components/seo"
import { formatFrenchDate, SITE_CONTENT_UPDATED_DATE, SITE_PUBLISHED_DATE } from "@/lib/content/author"
import {
  REVIEWER_PAGE_DESCRIPTION,
  REVIEWER_PAGE_H1,
  REVIEWER_PAGE_HEADING,
  REVIEWER_PAGE_TITLE,
  SITE_REVIEWER,
} from "@/lib/content/reviewer"
import { buildStaticPageMetadata } from "@/lib/seo/metadata"
import { buildAuthorPageSchemaGraph } from "@/lib/seo/schema/author-page"
import { CONTACT_EMAIL, ROUTES } from "@/lib/seo/routes"

const PAGE_PATH = ROUTES.auteur

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata({
    path: PAGE_PATH,
    title: REVIEWER_PAGE_TITLE,
    description: REVIEWER_PAGE_DESCRIPTION,
  })
}

export default function AuthorPage() {
  const schemaGraph = buildAuthorPageSchemaGraph()

  return (
    <>
      <SchemaJsonLd data={schemaGraph} />
      <div className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          <BreadcrumbTrail
            items={[
              { label: "Accueil", href: ROUTES.home },
              { label: "Enseignant", href: PAGE_PATH },
            ]}
            className="mb-6"
          />

          <header className="flex flex-col gap-3">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              {REVIEWER_PAGE_H1}
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground">
              Publié le {formatFrenchDate(SITE_PUBLISHED_DATE)} · Mis à jour le{" "}
              {formatFrenchDate(SITE_CONTENT_UPDATED_DATE)}
            </p>
          </header>

          <div className="prose prose-neutral mt-8 max-w-none text-foreground/90">
            <h2>{REVIEWER_PAGE_HEADING}</h2>
            <p>{SITE_REVIEWER.description}</p>
            <p>
              Consultez aussi la page <Link href={ROUTES.aPropos}>À propos de Hibou&Mots</Link>.
            </p>

            <h2>Contact</h2>
            <p>
              Pour toute question : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> ou le{" "}
              <Link href={ROUTES.contact}>formulaire de contact</Link>.
            </p>
          </div>

          <div className="mt-8">
            <AuthorAttribution pagePath={PAGE_PATH} />
          </div>
        </div>
      </div>
    </>
  )
}
