import type { Metadata } from "next"
import { LegalPageTemplate, LEGAL_PAGES } from "@/components/templates/legal/legal-page-template"
import { buildStaticPageMetadata } from "@/lib/seo/metadata"

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata({
    path: LEGAL_PAGES.confidentialite.path,
    title: LEGAL_PAGES.confidentialite.metaTitle,
    description: LEGAL_PAGES.confidentialite.metaDescription,
  })
}

export default function ConfidentialitePage() {
  const page = LEGAL_PAGES.confidentialite

  return (
    <LegalPageTemplate title={page.title} description={page.description} path={page.path}>
      <p>
        Hibou&Mots respecte votre vie privée. Cette page décrit les données que nous pouvons
        collecter et la manière dont nous les utilisons.
      </p>
      <h2>Données collectées</h2>
      <p>
        Lors de votre visite, des mesures d&apos;audience anonymisées peuvent être collectées pour
        améliorer le site. Si vous nous écrivez via le formulaire de contact, nous utilisons votre
        adresse e-mail uniquement pour répondre à votre message.
      </p>
      <h2>Cookies</h2>
      <p>
        Des cookies techniques peuvent être nécessaires au fonctionnement du site. Les cookies de
        mesure d&apos;audience ne sont activés qu&apos;avec votre consentement lorsque la
        réglementation l&apos;exige.
      </p>
      <h2>Vos droits</h2>
      <p>
        Vous pouvez demander l&apos;accès, la rectification ou la suppression de vos données en
        écrivant à{" "}
        <a href="mailto:contact@hibou-et-mots.fr">contact@hibou-et-mots.fr</a>.
      </p>
    </LegalPageTemplate>
  )
}
