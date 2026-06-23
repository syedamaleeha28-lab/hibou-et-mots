import Link from "next/link"
import { ROUTES, comboPath, gradePath, seasonalPath, themePath } from "@/lib/seo/routes"

type CategoryThemeSectionsProps = {
  slug: string
}

const THEME_SECTION_SLUGS = new Set(["animaux", "halloween", "noel"])

export function CategoryThemeSections({ slug }: CategoryThemeSectionsProps) {
  if (!THEME_SECTION_SLUGS.has(slug)) return null

  if (slug === "animaux") return <AnimauxThemeLinks />
  if (slug === "halloween") return <HalloweenThemeLinks />
  if (slug === "noel") return <NoelThemeLinks />

  return null
}

function AnimauxThemeLinks() {
  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
      <h2 className="font-heading text-xl font-extrabold text-foreground">
        Explorer les mots mêlés Animaux
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Poursuivez avec des grilles calibrées par âge, des PDF prêts à imprimer ou une partie en
        ligne — toujours autour du vocabulaire animaux.
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        <li>
          <Link href={gradePath("maternelle")} className="text-sm font-semibold text-primary hover:underline">
            Mots mêlés Maternelle
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Grilles courtes pour les premiers jeux de mots cachés
          </span>
        </li>
        <li>
          <Link href={gradePath("cp")} className="text-sm font-semibold text-primary hover:underline">
            Mots mêlés CP
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Vocabulaire animaux adapté au cycle 2
          </span>
        </li>
        <li>
          <Link href={ROUTES.enfants} className="text-sm font-semibold text-primary hover:underline">
            Mots mêlés Enfants
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Toutes les grilles pour les 3–12 ans
          </span>
        </li>
        <li>
          <Link href={ROUTES.imprimer} className="text-sm font-semibold text-primary hover:underline">
            Mots mêlés à imprimer
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            PDF A4 avec corrigé pour la classe ou la maison
          </span>
        </li>
        <li>
          <Link href={ROUTES.jouer} className="text-sm font-semibold text-primary hover:underline">
            Jouer en ligne
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Partie immédiate sans impression
          </span>
        </li>
        <li>
          <Link href={ROUTES.generateur} className="text-sm font-semibold text-primary hover:underline">
            Générateur de grilles
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Composez votre propre liste d&apos;animaux
          </span>
        </li>
        <li>
          <Link href={ROUTES.ecoleHub} className="text-sm font-semibold text-primary hover:underline">
            Mots mêlés École
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Parcours par niveau de la maternelle à la 6e
          </span>
        </li>
        <li>
          <Link href={themePath("sport")} className="text-sm font-semibold text-primary hover:underline">
            Thème Sport
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Variez avec un autre champ lexical
          </span>
        </li>
      </ul>
    </section>
  )
}

function HalloweenThemeLinks() {
  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
      <h2 className="font-heading text-xl font-extrabold text-foreground">
        Explorer les mots mêlés Halloween
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Prolongez l&apos;activité d&apos;automne avec des grilles par niveau, des PDF à imprimer ou
        d&apos;autres fêtes saisonnières.
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        <li>
          <Link href={comboPath("ce1", "halloween")} className="text-sm font-semibold text-primary hover:underline">
            Mots mêlés CE1 × Halloween
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Vocabulaire Halloween calibré pour le CE1
          </span>
        </li>
        <li>
          <Link href={gradePath("cp")} className="text-sm font-semibold text-primary hover:underline">
            Mots mêlés CP
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Grilles adaptées aux premières classes
          </span>
        </li>
        <li>
          <Link href={ROUTES.fetesHub} className="text-sm font-semibold text-primary hover:underline">
            Fêtes &amp; Saisons
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Noël, Pâques, Carnaval et plus
          </span>
        </li>
        <li>
          <Link href={seasonalPath("noel")} className="text-sm font-semibold text-primary hover:underline">
            Mots mêlés Noël
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Poursuivre avec la fête de fin d&apos;année
          </span>
        </li>
        <li>
          <Link href={ROUTES.imprimer} className="text-sm font-semibold text-primary hover:underline">
            Mots mêlés à imprimer
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            PDF A4 avec corrigé pour la classe ou la maison
          </span>
        </li>
        <li>
          <Link href={ROUTES.jouer} className="text-sm font-semibold text-primary hover:underline">
            Jouer en ligne
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Partie immédiate sans préparation
          </span>
        </li>
        <li>
          <Link href={ROUTES.generateur} className="text-sm font-semibold text-primary hover:underline">
            Générateur de grilles
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Composez votre propre liste de mots d&apos;Halloween
          </span>
        </li>
        <li>
          <Link href={ROUTES.enfants} className="text-sm font-semibold text-primary hover:underline">
            Mots mêlés Enfants
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Toutes les grilles pour les 3–12 ans
          </span>
        </li>
      </ul>
    </section>
  )
}

function NoelThemeLinks() {
  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
      <h2 className="font-heading text-xl font-extrabold text-foreground">
        Explorer les mots mêlés Noël
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Prolongez l&apos;activité de Noël avec des grilles par niveau, des PDF festifs ou d&apos;autres
        thèmes saisonniers.
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        <li>
          <Link href={comboPath("ce1", "noel")} className="text-sm font-semibold text-primary hover:underline">
            Mots mêlés CE1 × Noël
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Vocabulaire de Noël calibré pour le CE1
          </span>
        </li>
        <li>
          <Link href={gradePath("cp")} className="text-sm font-semibold text-primary hover:underline">
            Mots mêlés CP
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Grilles adaptées aux premières classes
          </span>
        </li>
        <li>
          <Link href={ROUTES.fetesHub} className="text-sm font-semibold text-primary hover:underline">
            Fêtes &amp; Saisons
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Halloween, Pâques, Carnaval et plus
          </span>
        </li>
        <li>
          <Link href={seasonalPath("halloween")} className="text-sm font-semibold text-primary hover:underline">
            Mots mêlés Halloween
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Autre fête saisonnière populaire
          </span>
        </li>
        <li>
          <Link href={ROUTES.imprimer} className="text-sm font-semibold text-primary hover:underline">
            Mots mêlés à imprimer
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            PDF A4 avec corrigé pour les vacances scolaires
          </span>
        </li>
        <li>
          <Link href={ROUTES.jouer} className="text-sm font-semibold text-primary hover:underline">
            Jouer en ligne
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Partie immédiate sans préparation
          </span>
        </li>
        <li>
          <Link href={ROUTES.generateur} className="text-sm font-semibold text-primary hover:underline">
            Générateur de grilles
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Composez votre propre liste de mots de Noël
          </span>
        </li>
        <li>
          <Link href={ROUTES.enfants} className="text-sm font-semibold text-primary hover:underline">
            Mots mêlés Enfants
          </Link>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Toutes les grilles pour les 3–12 ans
          </span>
        </li>
      </ul>
    </section>
  )
}
