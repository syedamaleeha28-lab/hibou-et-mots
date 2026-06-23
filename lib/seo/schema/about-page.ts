import { ROUTES, absoluteUrl, DEFAULT_SITE_URL } from "@/lib/seo/routes"
import { buildBreadcrumbListSchema } from "@/lib/seo/breadcrumbs"
import { buildOrganizationSchema } from "./home"
import { buildSchemaGraph } from "./graph"

const ABOUT_TITLE = "À propos de Hibou&Mots"
const ABOUT_DESCRIPTION =
  "Découvrez la mission de Hibou&Mots : des mots mêlés gratuits en français pour aider les enfants à enrichir leur vocabulaire, à la maison comme en classe."

export function buildAboutPageSchemaGraph(siteUrl?: string): Record<string, unknown> {
  const base = (siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "")
  const homeUrl = absoluteUrl(ROUTES.home, base)
  const aboutUrl = absoluteUrl(ROUTES.aPropos, base)

  const breadcrumb = buildBreadcrumbListSchema(
    [
      { label: "Accueil", href: ROUTES.home },
      { label: "À propos", href: ROUTES.aPropos },
    ],
    siteUrl,
  )

  const webPage = {
    "@type": "WebPage",
    "@id": `${aboutUrl}#webpage`,
    url: aboutUrl,
    name: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${homeUrl}#website` },
    about: { "@id": `${homeUrl}#organization` },
    publisher: { "@id": `${homeUrl}#organization` },
  }

  return buildSchemaGraph([breadcrumb, webPage, buildOrganizationSchema(siteUrl)])
}
