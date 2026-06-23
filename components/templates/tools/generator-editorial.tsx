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
            eyebrow="Avantages"
            title="Pourquoi utiliser le générateur Hibou&Mots ?"
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
            title="Créer sa grille en 5 étapes"
            description="De la liste de mots à la grille jouable — en moins de deux minutes."
          />
          <ol className="mt-6 list-decimal space-y-4 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>
              <strong className="text-foreground">Choisir un modèle ou saisir vos mots.</strong>{" "}
              Sélectionnez un thème prédéfini (animaux, école, fêtes…) ou collez votre propre liste,
              un mot par ligne ou séparés par des virgules.
            </li>
            <li>
              <strong className="text-foreground">Régler la difficulté.</strong> Facile : horizontal
              et vertical uniquement. Moyen et difficile : ajoutez les diagonales et, au besoin, les
              mots inversés pour les plus grands.
            </li>
            <li>
              <strong className="text-foreground">Ajuster la taille de grille.</strong> 8×8 pour les
              débutants, 10×10 au primaire, 12×12 et plus pour les niveaux CM2–6e. Activez le grand
              format si la lecture fatigue vos élèves.
            </li>
            <li>
              <strong className="text-foreground">Générer et vérifier.</strong> Cliquez sur
              «&nbsp;Générer&nbsp;» : la grille apparaît avec la liste de mots placés. Si un mot ne
              rentre pas, réduisez la liste ou agrandissez la grille, puis relancez.
            </li>
            <li>
              <strong className="text-foreground">Jouer ou imprimer.</strong> Testez la grille
              directement dans la page, ou ouvrez le catalogue{" "}
              <Link href={ROUTES.gratuits} className="font-semibold text-primary hover:underline">
                mots mêlés gratuits
              </Link>{" "}
              pour comparer avec une grille publiée sur le même thème.
            </li>
          </ol>
        </section>

        <TeacherUseCases context="generator" />
        <ParentUseCases context="generator" />
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
            Besoin d&apos;inspiration pédagogique ? Consultez les grilles par niveau sur{" "}
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
