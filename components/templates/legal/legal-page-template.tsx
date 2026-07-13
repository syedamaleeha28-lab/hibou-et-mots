import { BreadcrumbTrail } from "@/components/layout/breadcrumb-trail"
import { SectionHeading } from "@/components/layout/section-heading"
import { ROUTES } from "@/lib/seo/routes"

export type LegalPageTemplateProps = {
  title: string
  description: string
  path: string
  children: React.ReactNode
}

export function LegalPageTemplate({ title, description, path, children }: LegalPageTemplateProps) {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <BreadcrumbTrail
          items={[
            { label: "Accueil", href: ROUTES.home },
            { label: title, href: path },
          ]}
          className="mb-6"
        />

        <SectionHeading align="left" eyebrow="Informations" title={title} description={description} />

        <div className="prose prose-neutral mt-8 max-w-none text-foreground/90">{children}</div>
      </div>
    </div>
  )
}

export type LegalPageConfig = {
  path: string
  title: string
  description: string
  metaTitle: string
  metaDescription: string
}

export const LEGAL_PAGES = {
  mentionsLegales: {
    path: ROUTES.mentionsLegales,
    title: "Mentions légales",
    description: "Informations légales sur l'éditeur du site Hibou&Mots.",
    metaTitle: "Mentions légales — Hibou&Mots",
    metaDescription: "Mentions légales du site Hibou&Mots : éditeur, hébergement et contact.",
  },
  confidentialite: {
    path: ROUTES.confidentialite,
    title: "Politique de confidentialité",
    description: "Comment Hibou&Mots traite vos données personnelles.",
    metaTitle: "Politique de confidentialité — Hibou&Mots",
    metaDescription:
      "Politique de confidentialité de Hibou&Mots : cookies, données collectées et vos droits.",
  },
  contact: {
    path: ROUTES.contact,
    title: "Contact",
    description: "Une question sur les mots mêlés, la classe ou le site ? Écrivez-nous.",
    metaTitle: "Contact — Hibou&Mots",
    metaDescription: "Contactez l'équipe Hibou&Mots pour toute question sur les grilles ou le site.",
  },
} as const satisfies Record<string, LegalPageConfig>
