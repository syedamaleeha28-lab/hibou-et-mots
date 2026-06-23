import Link from "next/link"
import { AuthorAttribution } from "@/components/seo/author-attribution"
import { FaqAccordion } from "@/components/templates/shared/faq-accordion"
import { SectionHeading } from "@/components/layout/section-heading"
import { ONLINE_PLAY_FAQ } from "@/lib/content/phase1"
import { ROUTES } from "@/lib/seo/routes"
import {
  ParentUseCases,
  PrintableVsOnlineComparison,
  TeacherUseCases,
  ToolHubLinks,
} from "./tool-editorial-shared"

export function OnlinePlayEditorial() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      <div className="mt-10 flex flex-col gap-10">
        <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
          <SectionHeading
            align="left"
            eyebrow="Avantages"
            title="Pourquoi jouer en ligne sur Hibou&Mots ?"
            description="Une partie prête en un clic — sans application à installer, sur tous vos appareils."
          />
          <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              Le jeu en ligne élimine les frictions : pas de téléchargement, pas de compte, pas
              d&apos;attente. Vous choisissez un thème et une difficulté, la grille se charge dans
              le navigateur et vous sélectionnez les mots en cliquant la première et la dernière
              lettre. Chaque mot trouvé se surligne ; la liste se met à jour pour suivre votre
              progression. Idéal pour une pause de dix minutes à la maison ou une activité d&apos;accueil
              en classe.
            </p>
            <p>
              Le chronomètre intégré permet de se challenger sans pression, ou de jouer en mode
              détente sans le regarder. Le mode grand format agrandit les cellules pour les jeunes
              lecteurs et les seniors. Et si vous préférez le papier, basculez vers les{" "}
              <Link href={ROUTES.imprimer} className="font-semibold text-primary hover:underline">
                grilles PDF
              </Link>{" "}
              ou composez une liste sur mesure avec le{" "}
              <Link href={ROUTES.generateur} className="font-semibold text-primary hover:underline">
                générateur
              </Link>
              .
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Compatible ordinateur, tablette et smartphone</li>
              <li>Thèmes variés : animaux, école, fêtes, vocabulaire…</li>
              <li>Trois niveaux : facile, moyen, difficile</li>
              <li>Nouvelle partie instantanée, 100 % gratuit</li>
            </ul>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
          <SectionHeading
            align="left"
            eyebrow="Mode d'emploi"
            title="Comment jouer en 5 étapes"
            description="De l'ouverture de la page à la dernière lettre trouvée."
          />
          <ol className="mt-6 list-decimal space-y-4 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>
              <strong className="text-foreground">Choisir un thème.</strong> Animaux, sport, Noël,
              vocabulaire… pick celui qui correspond à l&apos;âge ou au programme de la semaine.
            </li>
            <li>
              <strong className="text-foreground">Régler la difficulté.</strong> Facile pour les
              maternelles et CP (horizontal / vertical), moyen avec diagonales, difficile pour les
              grilles plus denses.
            </li>
            <li>
              <strong className="text-foreground">Repérer un mot dans la liste.</strong> Lisez la
              liste à gauche ou sous la grille, puis cherchez le mot dans toutes les directions
              autorisées.
            </li>
            <li>
              <strong className="text-foreground">Sélectionner le mot.</strong> Cliquez sur la
              première lettre, puis sur la dernière : le mot se surligne s&apos;il est correct.
            </li>
            <li>
              <strong className="text-foreground">Terminer ou relancer.</strong> Cochez toute la
              liste pour finir la partie ; appuyez sur «&nbsp;Nouvelle partie&nbsp;» pour changer de
              thème ou battre votre temps au chronomètre.
            </li>
          </ol>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Pour des grilles calibrées par classe, ouvrez{" "}
            <Link href={ROUTES.ecoleHub} className="font-semibold text-primary hover:underline">
              Mots mêlés École
            </Link>{" "}
            ; pour les plus jeunes, essayez la section{" "}
            <Link href={ROUTES.enfants} className="font-semibold text-primary hover:underline">
              mots mêlés enfants
            </Link>
            .
          </p>
        </section>

        <TeacherUseCases context="online" />
        <ParentUseCases context="online" />
        <PrintableVsOnlineComparison focus="online" />
        <ToolHubLinks />
        <FaqAccordion items={ONLINE_PLAY_FAQ} />
        <AuthorAttribution />
      </div>
    </div>
  )
}
