import Link from "next/link"
import { FaqAccordion } from "@/components/templates/shared/faq-accordion"
import { AuthorAttribution } from "@/components/seo/author-attribution"
import { SectionHeading } from "@/components/layout/section-heading"
import { GENERATOR_FAQ } from "@/lib/content/phase1"
import { ROUTES } from "@/lib/seo/routes"
import {
  ParentUseCases,
  PrintableVsOnlineComparison,
  TeacherUseCases,
  ToolHubLinks,
} from "./tool-editorial-shared"

export function GeneratorEditorial() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      <div className="mt-10 flex flex-col gap-10">
        <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
          <SectionHeading
            align="left"
            eyebrow="Introduction"
            title="Un générateur gratuit, en français, sans connexion"
            description="Créez une grille unique en quelques secondes — sans compte, sans limite, entièrement en français."
          />
          <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              Le générateur transforme votre propre liste de mots en grille de mots mêlés prête à
              jouer — un jeu de mots cachés que vous personnalisez entièrement. Contrairement à un
              modèle figé, vous contrôlez le vocabulaire : mots de la semaine, prénoms,
              thématique de projet ou liste de révision avant un contrôle. L&apos;aperçu en direct
              montre la grille générée instantanément ; vous ajustez la taille, la difficulté et les
              directions jusqu&apos;à obtenir le bon niveau.
            </p>
            <p>
              C&apos;est gratuit et illimité : aucune inscription, aucun palier payant. Vous pouvez
              enchaîner les essais, mélanger la disposition avec un nouveau tirage, puis{" "}
              <Link href={ROUTES.jouer} className="font-semibold text-primary hover:underline">
                jouer en ligne
              </Link>{" "}
              ou imprimer via la page{" "}
              <Link href={ROUTES.imprimer} className="font-semibold text-primary hover:underline">
                mots mêlés à imprimer
              </Link>
              . Le mode grand format améliore la lisibilité pour les plus jeunes ou pour une
              projection en classe.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Personnalisation totale de la liste de mots</li>
              <li>Trois niveaux de difficulté (facile, moyen, difficile)</li>
              <li>Taille de grille réglable et option diagonales</li>
              <li>Aperçu interactif avant impression ou partie en ligne</li>
            </ul>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
          <SectionHeading
            align="left"
            eyebrow="Mode d'emploi"
            title="Comment utiliser le générateur"
            description="Trois étapes pour passer de votre liste de mots à une grille jouable."
          />
          <ol className="mt-6 list-decimal space-y-4 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>
              <strong className="text-foreground">Saisissez vos mots.</strong>{" "}
              Sélectionnez un thème prédéfini (animaux, école, fêtes…) ou collez votre propre liste,
              un mot par ligne ou séparés par des virgules.
            </li>
            <li>
              <strong className="text-foreground">Personnalisez la grille.</strong> Réglez la taille,
              la difficulté (facile, moyen, difficile), les diagonales et le thème visuel.
            </li>
            <li>
              <strong className="text-foreground">Générez et jouez.</strong> Cliquez sur
              «&nbsp;Générer&nbsp;», testez la grille en ligne ou imprimez-la en PDF.
            </li>
          </ol>
        </section>

        <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
          <SectionHeading
            align="left"
            eyebrow="Options"
            title="Personnalisez votre grille"
            description="Mots, taille, difficulté et thème — chaque paramètre adapte la grille à votre public."
          />
          <ul className="mt-6 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Liste de mots libre ou thème prédéfini</li>
            <li>Taille de grille de 8×8 à 15×15</li>
            <li>Trois niveaux de difficulté avec diagonales optionnelles</li>
            <li>Mode grand format pour une meilleure lisibilité</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
          <SectionHeading
            align="left"
            eyebrow="Usages"
            title="Idées d'utilisation"
            description="Classe, anniversaire, entreprise ou famille — le générateur s'adapte à chaque occasion."
          />
          <TeacherUseCases context="generator" />
          <ParentUseCases context="generator" />
        </section>

        <PrintableVsOnlineComparison focus="generator" />

        <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
          <h2 className="font-heading text-xl font-extrabold text-foreground">
            Conseils pour une bonne grille
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Maternelle et CP : visez 6 à 8 mots courts (4 à 6 lettres). CE1–CE2 : 8 à 10 mots. CM1–CM2
            et 6e : mots plus longs, diagonales autorisées. Évitez les listes trop longues pour une
            petite grille — le moteur signale les mots non placés. Pour une classe entière, créez
            deux ou trois listes proches et générez des grilles différentes afin que chaque élève ait
            sa version.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Besoin d&apos;inspiration ? Parcourez les{" "}
            <Link href={ROUTES.gratuits} className="font-semibold text-primary hover:underline">
              mots mêlés gratuits
            </Link>
            , les grilles par niveau sur{" "}
            <Link href={ROUTES.ecoleHub} className="font-semibold text-primary hover:underline">
              Mots mêlés École
            </Link>{" "}
            ou les activités{" "}
            <Link href={ROUTES.enfants} className="font-semibold text-primary hover:underline">
              pour les enfants
            </Link>
            .
          </p>
        </section>

        <ToolHubLinks />
        <FaqAccordion items={GENERATOR_FAQ} />
        <AuthorAttribution />
      </div>
    </div>
  )
}
