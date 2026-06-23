import type { Metadata } from "next"
import Link from "next/link"
import { AuthorAttribution } from "@/components/seo/author-attribution"
import { BreadcrumbTrail } from "@/components/layout/breadcrumb-trail"
import { SchemaJsonLd } from "@/components/seo"
import {
  formatFrenchDate,
  SITE_AUTHOR,
  SITE_CONTENT_UPDATED_DATE,
  SITE_PUBLISHED_DATE,
} from "@/lib/content/author"
import { buildStaticPageMetadata } from "@/lib/seo/metadata"
import { buildAuthorPageSchemaGraph } from "@/lib/seo/schema/author-page"
import { CONTACT_EMAIL, ROUTES } from "@/lib/seo/routes"

const PAGE_PATH = ROUTES.auteur
const META_TITLE = "Auteur — Équipe Hibou&Mots"
const META_DESCRIPTION =
  "Découvrez l'équipe Hibou&Mots : créateurs de mots mêlés éducatifs gratuits en français pour les enfants, les enseignants et les familles."

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata({
    path: PAGE_PATH,
    title: META_TITLE,
    description: META_DESCRIPTION,
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
              { label: "Auteur", href: PAGE_PATH },
            ]}
            className="mb-6"
          />

          <header className="flex flex-col gap-3">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              {SITE_AUTHOR.name}
            </h1>
            <p className="text-lg font-semibold text-primary">{SITE_AUTHOR.jobTitle}</p>
            <p className="max-w-xl text-sm text-muted-foreground">
              Publié le {formatFrenchDate(SITE_PUBLISHED_DATE)} · Mis à jour le{" "}
              {formatFrenchDate(SITE_CONTENT_UPDATED_DATE)}
            </p>
          </header>

          <div className="prose prose-neutral mt-8 max-w-none text-foreground/90">
            <h2>Créateur du site</h2>
            <p>
              <strong>{SITE_AUTHOR.name}</strong> conçoit et publie l&apos;ensemble du contenu
              éditorial de Hibou&Mots : grilles de mots mêlés, jeux de mots cachés, guides
              pédagogiques et ressources pour la classe. Le site est édité en français, sans
              inscription obligatoire, pour un usage familial et scolaire.
            </p>

            <h2>Mission éducative</h2>
            <p>{SITE_AUTHOR.mission}</p>
            <p>
              Consultez aussi la page{" "}
              <Link href={ROUTES.aPropos}>À propos de Hibou&Mots</Link> pour la présentation
              complète du projet.
            </p>

            <h2>Expérience en contenu éducatif</h2>
            <p>{SITE_AUTHOR.experience}</p>
            <ul>
              {SITE_AUTHOR.knowsAbout.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>

            <h2>Objectif du site</h2>
            <p>{SITE_AUTHOR.purpose}</p>
            <p>
              Parcourez le <Link href={ROUTES.gratuits}>catalogue gratuit</Link>, le{" "}
              <Link href={ROUTES.generateur}>générateur de grilles</Link> ou les ressources{" "}
              <Link href={ROUTES.pedagogie}>pédagogie des mots mêlés</Link>.
            </p>

            <h2>Contact</h2>
            <p>
              Pour toute question éditoriale ou pédagogique :{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> ou le{" "}
              <Link href={ROUTES.contact}>formulaire de contact</Link>.
            </p>
          </div>

          <div className="mt-8">
            <AuthorAttribution variant="detailed" />
          </div>
        </div>
      </div>
    </>
  )
}
