import type { Metadata } from "next"
import { LegalPageTemplate, LEGAL_PAGES } from "@/components/templates/legal/legal-page-template"
import { buildStaticPageMetadata } from "@/lib/seo/metadata"

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata({
    path: LEGAL_PAGES.mentionsLegales.path,
    title: LEGAL_PAGES.mentionsLegales.metaTitle,
    description: LEGAL_PAGES.mentionsLegales.metaDescription,
  })
}

export default function MentionsLegalesPage() {
  const page = LEGAL_PAGES.mentionsLegales

  return (
    <LegalPageTemplate title={page.title} description={page.description} path={page.path}>
      <p>
        Le site <strong>Hibou&Mots</strong> édite des mots mêlés gratuits à imprimer et à jouer en
        ligne pour les enfants, les enseignants et les familles.
      </p>
      <h2>Éditeur</h2>
      <p>
        Hibou&Mots — contact :{" "}
        <a href="mailto:contact@hibou-et-mots.fr">contact@hibou-et-mots.fr</a>
      </p>
      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
      </p>
      <h2>Propriété intellectuelle</h2>
      <p>
        Les grilles, textes et éléments graphiques du site sont protégés. Toute reproduction non
        autorisée est interdite.
      </p>
    </LegalPageTemplate>
  )
}
