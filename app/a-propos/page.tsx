import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbTrail } from "@/components/layout/breadcrumb-trail"
import { SchemaJsonLd } from "@/components/seo"
import { buildStaticPageMetadata } from "@/lib/seo/metadata"
import { buildAboutPageSchemaGraph } from "@/lib/seo/schema/about-page"
import { CONTACT_EMAIL, ROUTES } from "@/lib/seo/routes"

const PAGE_PATH = ROUTES.aPropos
const META_TITLE = "À propos — Hibou&Mots"
const META_DESCRIPTION =
  "La mission de Hibou&Mots : des mots mêlés gratuits en français pour les enfants, les enseignants et les familles — à imprimer ou à jouer en ligne."

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata({
    path: PAGE_PATH,
    title: META_TITLE,
    description: META_DESCRIPTION,
  })
}

export default function AboutPage() {
  const schemaGraph = buildAboutPageSchemaGraph()

  return (
    <>
      <SchemaJsonLd data={schemaGraph} />
      <div className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          <BreadcrumbTrail
            items={[
              { label: "Accueil", href: ROUTES.home },
              { label: "À propos", href: PAGE_PATH },
            ]}
            className="mb-6"
          />

          <header className="flex flex-col gap-3">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              À propos de Hibou&Mots
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Un site français dédié aux mots mêlés gratuits — pour apprendre le vocabulaire en
              s&apos;amusant, à la maison comme à l&apos;école.
            </p>
          </header>

          <div className="prose prose-neutral mt-8 max-w-none text-foreground/90">
            <h2>Notre mission</h2>
            <p>
              <strong>Hibou&Mots</strong> rend les mots mêlés accessibles à tous : enfants, parents,
              enseignants et passionnés de jeux de lettres. Nous publions des grilles en français,
              classées par niveau scolaire, par thème et par saison, que l&apos;on peut{" "}
              <Link href={ROUTES.jouer}>jouer en ligne</Link> ou{" "}
              <Link href={ROUTES.imprimer}>imprimer en PDF</Link> gratuitement.
            </p>
            <p>
              Retrouvez l&apos;ensemble du catalogue sur la{" "}
              <Link href={ROUTES.home}>page d&apos;accueil</Link> ou parcourez les grilles par
              niveau sur la page <Link href={ROUTES.ecoleHub}>Mots mêlés École</Link>.
            </p>

            <h2>Une ressource éducative en français</h2>
            <p>
              Les mots mêlés complètent la lecture et l&apos;orthographe au primaire et au collège.
              Chaque grille invite l&apos;enfant à reconnaître la forme complète d&apos;un mot, à le
              repérer dans différentes directions et à consolider le vocabulaire travaillé en classe
              — dictée, lecture ou leçon de français.
            </p>
            <p>
              Les grilles sont calibrées par cycle (maternelle, CP, CE1, CE2, CM1, CM2, 6e) avec
              des tailles et des listes de mots adaptées. Les enseignants peuvent aussi créer une
              fiche sur mesure avec le{" "}
              <Link href={ROUTES.generateur}>générateur de mots mêlés</Link>.
            </p>

            <h2>Pourquoi les mots mêlés aident à apprendre le vocabulaire</h2>
            <p>
              Trouver un mot dans une grille oblige à mémoriser sa silhouette visuelle : chaque
              lettre compte, dans l&apos;ordre ou en sens inverse. Cette activité renforce la
              reconnaissance des mots outils, des champs lexicaux (animaux, saison, géographie…) et
              du vocabulaire scolaire, sans la pression d&apos;une évaluation classique.
            </p>
            <ul>
              <li>Repérage visuel et attention soutenue</li>
              <li>Révision du vocabulaire thématique ou de la dictée</li>
              <li>Activité calme, en autonomie ou en petit groupe</li>
              <li>Plaisir de jeu qui motive la lecture</li>
            </ul>

            <h2>Pour les enseignants et les parents</h2>
            <p>
              <strong>En classe</strong>, les grilles servent en accueil du matin, en fin de séance
              ou en différenciation. Chaque puzzle est disponible en PDF A4 avec corrigé — prêt à
              distribuer sans préparation lourde. Consultez aussi nos{" "}
              <Link href={ROUTES.ressources}>ressources pour enseignants</Link> et la page{" "}
              <Link href={ROUTES.pedagogie}>pédagogie des mots mêlés</Link>.
            </p>
            <p>
              <strong>À la maison</strong>, les parents trouvent des grilles par âge sur la page{" "}
              <Link href={ROUTES.enfants}>Mots mêlés enfants</Link>, des thèmes du quotidien et un
              outil pour composer une grille personnalisée (anniversaire, révision, voyage sans
              écran).
            </p>

            <h2>Grilles à imprimer et en ligne</h2>
            <p>
              Toutes les grilles publiées peuvent être jouées directement dans le navigateur. Pour
              une version papier, téléchargez le PDF depuis chaque puzzle ou parcourez la section{" "}
              <Link href={ROUTES.imprimer}>mots mêlés à imprimer</Link>. Le{" "}
              <Link href={ROUTES.generateur}>générateur</Link> permet enfin de saisir vos propres
              mots et d&apos;obtenir une grille unique en quelques secondes.
            </p>

            <h2>Nous contacter</h2>
            <p>
              Une question, une idée de thème ou un partenariat école ? Écrivez-nous à{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> ou utilisez le{" "}
              <Link href={ROUTES.contact}>formulaire de contact</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
